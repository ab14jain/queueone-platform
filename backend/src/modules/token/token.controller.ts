import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { redis } from "../../config/redis";
import { formatTokenNumber } from "../../utils/tokenGenerator";
import { emitQueueUpdate } from "../../websocket/socket.server";
import { ensureQueueCache, getQueueRedisKeys } from "../queue/queue.service";

const DUPLICATE_WINDOW_SECONDS = 10;

export const createToken = async (req: Request, res: Response): Promise<void> => {
  const { queueId, patientName, mobile } = req.body as {
    queueId?: string;
    patientName?: string;
    mobile?: string;
  };

  if (!queueId) {
    res.status(400).json({ message: "queueId is required" });
    return;
  }

  if (!mobile || mobile.trim().length !== 10) {
    res.status(400).json({ message: "Valid 10-digit mobile number is required" });
    return;
  }

  const queue = await prisma.queue.findUnique({ where: { id: queueId } });
  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  if (queue.status !== "OPEN") {
    res.status(400).json({ message: "Queue is closed" });
    return;
  }

  // Check if user already has an active token in this queue
  const existingToken = await prisma.token.findFirst({
    where: {
      queueId,
      mobile,
      status: { in: ["WAITING", "SERVING"] },
    },
  });

  if (existingToken) {
    res.status(400).json({ 
      message: "You already have an active token in this queue",
      tokenNumber: existingToken.tokenNumber 
    });
    return;
  }

  // Prevent rapid duplicate token creation for the same device/mobile.
  const dedupeKey = mobile ? `queue:${queueId}:dedupe:${mobile}` : `queue:${queueId}:dedupe:${req.ip}`;
  const isDuplicate = await redis.set(dedupeKey, "1", "EX", DUPLICATE_WINDOW_SECONDS, "NX");
  if (!isDuplicate) {
    res.status(429).json({ message: "Please wait before creating another token" });
    return;
  }

  // Atomic sequence increment + token creation to avoid collisions.
  const token = await prisma.$transaction(async (tx: any) => {
    const updatedQueue = await tx.queue.update({
      where: { id: queueId },
      data: { currentSequence: { increment: 1 } },
    });

    const tokenNumber = formatTokenNumber(updatedQueue.tokenPrefix, updatedQueue.currentSequence);

    return tx.token.create({
      data: {
        queueId,
        tokenNumber,
        sequence: updatedQueue.currentSequence,
        patientName,
        mobile,
        status: "WAITING",
      },
    }) as Promise<{ id: string; queueId: string; tokenNumber: string; sequence: number; patientName: string | null; mobile: string | null; status: string; createdAt: Date; servedAt: Date | null }>;
  });

  // Ensure Redis is hydrated before pushing live queue data.
  await ensureQueueCache(queueId);
  const keys = getQueueRedisKeys(queueId);

  // Push into the waiting list and store minimal token details for quick lookup.
  await redis.rpush(keys.waiting, token.id);
  await redis.hset(`token:${token.id}`, {
    id: token.id,
    queueId: token.queueId,
    tokenNumber: token.tokenNumber,
    status: token.status,
  });

  const waitingCount = await redis.llen(keys.waiting);
  const currentTokenId = await redis.get(keys.current);
  const currentToken: { tokenNumber: string } | null = currentTokenId
    ? await prisma.token.findUnique({ where: { id: currentTokenId } })
    : null;
  emitQueueUpdate(queueId, {
    event: "queue:update",
    nowServing: currentToken ? currentToken.tokenNumber : null,
    waitingCount,
  });

  res.status(201).json({ tokenNumber: token.tokenNumber, tokenId: token.id, waitingCount });
};
// Look up token by phone number and queue
export const getTokenByMobile = async (req: Request, res: Response): Promise<void> => {
  const { publicId, mobile } = req.query as { publicId?: string; mobile?: string };

  if (!publicId || !mobile) {
    res.status(400).json({ message: "publicId and mobile are required" });
    return;
  }

  const queue = await prisma.queue.findUnique({
    where: { publicId },
    include: { location: true },
  });

  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  // Find latest token for this mobile number in this queue
  const token = await prisma.token.findFirst({
    where: {
      queueId: queue.id,
      mobile: mobile,
      status: { in: ["WAITING", "SERVING", "SERVED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    res.status(404).json({ message: "No token found for this mobile number" });
    return;
  }

  // Get current serving token
  const keys = getQueueRedisKeys(queue.id);
  const currentTokenId = await redis.get(keys.current);
  const currentToken = currentTokenId
    ? await prisma.token.findUnique({ where: { id: currentTokenId } })
    : null;

  // Get waiting count
  const waitingCount = await redis.llen(keys.waiting);

  res.json({
    token: {
      tokenNumber: token.tokenNumber,
      status: token.status,
      patientName: token.patientName,
      createdAt: token.createdAt,
    },
    queue: {
      name: queue.name,
      location: queue.location.name,
    },
    nowServing: currentToken?.tokenNumber || null,
    waitingCount,
  });
};