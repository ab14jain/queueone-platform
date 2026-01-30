import { Router } from "express";
import {
  getQueueByPublicId,
  callNextToken,
  skipCurrentToken,
  closeQueue,
  openQueue,
} from "./modules/queue/queue.controller";
import { getQueueQrPng, getQueueQrPngByPublicId } from "./modules/queue/queue.qr.controller";
import { enrollDoctor, getAllDoctors } from "./modules/doctor/doctor.controller";
import { createToken, getTokenByMobile } from "./modules/token/token.controller";
import { reportingController } from "./modules/reporting/reporting.controller";
import { authController } from "./modules/auth/auth.controller";
import { authenticate, authorize } from "./middleware/auth.middleware";

const router = Router();

// Public routes (no authentication required)
router.post("/tokens", createToken);
router.get("/tokens/lookup", getTokenByMobile);
router.get("/queues/:publicId", getQueueByPublicId);
router.get("/queues/public/:publicId/qr", getQueueQrPngByPublicId);

// Auth routes
router.post("/auth/doctor/login", authController.doctorLogin.bind(authController));
router.post("/auth/staff/login", authController.staffLogin.bind(authController));
router.post("/auth/doctor/set-password", authController.setDoctorPassword.bind(authController));
router.post("/auth/staff/create", authController.createStaff.bind(authController));
router.get("/auth/me", authenticate, authController.getCurrentUser.bind(authController));

// Protected routes - Require authentication (Doctor, Staff, or Admin)
router.post("/doctors/enroll", authenticate, authorize('STAFF', 'ADMIN'), enrollDoctor);
router.get("/doctors", authenticate, getAllDoctors);
router.get("/queues/:id/qr", authenticate, getQueueQrPng);
router.post("/queues/:id/next", authenticate, callNextToken);
router.post("/queues/:id/skip", authenticate, skipCurrentToken);
router.post("/queues/:id/close", authenticate, closeQueue);
router.post("/queues/:id/open", openQueue);

// Reporting routes - Require authentication
router.get("/reporting/doctors", authenticate, reportingController.getAllDoctorsStats.bind(reportingController));
router.get("/reporting/doctor/:doctorId/daily", authenticate, reportingController.getDailyStats.bind(reportingController));
router.get("/reporting/doctor/:doctorId/weekly", authenticate, reportingController.getWeeklyStats.bind(reportingController));
router.get("/reporting/doctor/:doctorId/monthly", authenticate, reportingController.getMonthlyStats.bind(reportingController));
router.get("/reporting/doctor/:doctorId/yearly", authenticate, reportingController.getYearlyStats.bind(reportingController));
router.get("/reporting/doctor/:doctorId/summary", authenticate, reportingController.getDoctorSummary.bind(reportingController));

export default router;
