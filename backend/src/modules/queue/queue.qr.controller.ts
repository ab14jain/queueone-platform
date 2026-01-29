import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { generateQrPngBuffer } from "../../utils/qrCode";

const APP_BASE_URL = process.env.PUBLIC_APP_URL || "http://localhost:3000";

export const getQueueQrPng = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const queue = await prisma.queue.findUnique({ where: { id } });
  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const url = `${APP_BASE_URL}/q/${queue.publicId}`;
  const buffer = await generateQrPngBuffer(url);

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};

export const getQueueQrPngByPublicId = async (req: Request, res: Response): Promise<void> => {
  const { publicId } = req.params;
  const queue = await prisma.queue.findUnique({ where: { publicId } });
  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const url = `${APP_BASE_URL}/q/${queue.publicId}`;
  const buffer = await generateQrPngBuffer(url);

  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
};
