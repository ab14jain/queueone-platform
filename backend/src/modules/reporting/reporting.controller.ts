import { Request, Response } from 'express';
import { reportingService } from './reporting.service';

export class ReportingController {
  // GET /api/reporting/doctor/:doctorId/daily
  async getDailyStats(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await reportingService.getDailyStats(doctorId, start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily statistics',
      });
    }
  }

  // GET /api/reporting/doctor/:doctorId/weekly
  async getWeeklyStats(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await reportingService.getWeeklyStats(doctorId, start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weekly statistics',
      });
    }
  }

  // GET /api/reporting/doctor/:doctorId/monthly
  async getMonthlyStats(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await reportingService.getMonthlyStats(doctorId, start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch monthly statistics',
      });
    }
  }

  // GET /api/reporting/doctor/:doctorId/yearly
  async getYearlyStats(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await reportingService.getYearlyStats(doctorId, start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching yearly stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch yearly statistics',
      });
    }
  }

  // GET /api/reporting/doctor/:doctorId/summary
  async getDoctorSummary(req: Request, res: Response) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const summary = await reportingService.getDoctorSummary(doctorId, start, end);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error('Error fetching doctor summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch doctor summary',
      });
    }
  }

  // GET /api/reporting/doctors
  async getAllDoctorsStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await reportingService.getAllDoctorsStats(start, end);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching all doctors stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch doctors statistics',
      });
    }
  }
}

export const reportingController = new ReportingController();
