import { Router } from "express";
import {
  getQueueByPublicId,
  callNextToken,
  skipCurrentToken,
  closeQueue,
  openQueue,
} from "./modules/queue/queue.controller";
import { getQueueQrPng, getQueueQrPngByPublicId } from "./modules/queue/queue.qr.controller";
import { enrollDoctor } from "./modules/doctor/doctor.controller";
import { createToken, getTokenByMobile } from "./modules/token/token.controller";

const router = Router();

router.post("/doctors/enroll", enrollDoctor);
router.post("/tokens", createToken);
router.get("/tokens/lookup", getTokenByMobile);
router.get("/queues/:publicId", getQueueByPublicId);
router.get("/queues/:id/qr", getQueueQrPng);
router.get("/queues/public/:publicId/qr", getQueueQrPngByPublicId);
router.post("/queues/:id/next", callNextToken);
router.post("/queues/:id/skip", skipCurrentToken);
router.post("/queues/:id/close", closeQueue);
router.post("/queues/:id/open", openQueue);

export default router;
