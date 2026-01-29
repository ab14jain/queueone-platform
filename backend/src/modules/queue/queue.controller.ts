import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { redis } from "../../config/redis";
import { emitQueueUpdate } from "../../websocket/socket.server";
import { computeEstimatedWaitMinutes, ensureQueueCache, getQueueRedisKeys } from "./queue.service";

export const getQueueByPublicId = async (req: Request, res: Response): Promise<void> => {
  const { publicId } = req.params;

  const queue = await prisma.queue.findUnique({
    where: { publicId },
    include: { location: true },
  });

  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  // Ensure Redis mirrors current DB state for live queue operations.
  await ensureQueueCache(queue.id);

  const keys = getQueueRedisKeys(queue.id);
  const [currentTokenId, waitingCount] = await Promise.all([
    redis.get(keys.current),
    redis.llen(keys.waiting),
  ]);

  const currentToken = currentTokenId
    ? await prisma.token.findUnique({ where: { id: currentTokenId } })
    : null;

  const estimatedWaitMinutes = await computeEstimatedWaitMinutes(queue.id, waitingCount);

  res.json({
    queue: {
      id: queue.id,
      name: queue.name,
      publicId: queue.publicId,
      tokenPrefix: queue.tokenPrefix,
      status: queue.status,
      location: queue.location,
    },
    nowServing: currentToken ? currentToken.tokenNumber : null,
    waitingCount,
    estimatedWaitMinutes,
  });
};

export const callNextToken = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const queue = await prisma.queue.findUnique({
    where: { id },
    include: { location: true },
  });

  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  if (queue.status !== "OPEN") {
    res.status(400).json({ message: "Queue is closed" });
    return;
  }

  // Keep Redis and DB in sync before mutating current token.
  await ensureQueueCache(queue.id);
  const keys = getQueueRedisKeys(queue.id);

  const currentTokenId = await redis.get(keys.current);
  if (currentTokenId) {
    // Mark the previous token as served when moving ahead.
    await prisma.token.update({
      where: { id: currentTokenId },
      data: { status: "SERVED", servedAt: new Date() },
    });
  }

  const nextTokenId = await redis.lpop(keys.waiting);

  if (!nextTokenId) {
    // No one is waiting, clear the current token.
    await redis.del(keys.current);
    emitQueueUpdate(queue.id, { event: "queue:idle" });
    res.json({ message: "No tokens waiting", current: null, waitingCount: 0 });
    return;
  }

  const nextToken = await prisma.token.update({
    where: { id: nextTokenId },
    data: { status: "SERVING" },
  });

  await redis.set(keys.current, nextTokenId);
  const waitingCount = await redis.llen(keys.waiting);

  // Send SMS notification to patient
  if (nextToken.mobile) {
    try {
      const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5001";
      await fetch(`${notificationServiceUrl}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: nextToken.mobile,
          tokenNumber: nextToken.tokenNumber,
          queueName: queue.name,
          locationName: queue.location.name,
        }),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to send notification:", err);
      // Don't block queue operation if notification fails
    }
  }

  emitQueueUpdate(queue.id, {
    event: "queue:update",
    nowServing: nextToken.tokenNumber,
    waitingCount,
  });

  res.json({ current: nextToken.tokenNumber, waitingCount });
};

export const skipCurrentToken = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const queue = await prisma.queue.findUnique({ where: { id } });

  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  await ensureQueueCache(queue.id);
  const keys = getQueueRedisKeys(queue.id);

  const currentTokenId = await redis.get(keys.current);
  if (!currentTokenId) {
    res.status(400).json({ message: "No current token" });
    return;
  }

  await prisma.token.update({
    where: { id: currentTokenId },
    data: { status: "SKIPPED" },
  });

  await redis.del(keys.current);
  emitQueueUpdate(queue.id, { event: "queue:skipped" });

  res.json({ message: "Token skipped" });
};

export const closeQueue = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const existing = await prisma.queue.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const queue = await prisma.queue.update({
    where: { id },
    data: { status: "CLOSED" },
  });

  emitQueueUpdate(queue.id, { event: "queue:closed", status: queue.status });
  res.json({ status: queue.status });
};

export const openQueue = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const existing = await prisma.queue.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const queue = await prisma.queue.update({
    where: { id },
    data: { status: "OPEN" },
  });

  emitQueueUpdate(queue.id, { event: "queue:open", status: queue.status });
  res.json({ status: queue.status });
};
