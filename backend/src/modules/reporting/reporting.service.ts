import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TimeRangeStats {
  period: string;
  totalTokens: number;
  waitingTokens: number;
  servingTokens: number;
  servedTokens: number;
  skippedTokens: number;
}

export interface DoctorStats {
  doctorId: string;
  doctorName: string;
  totalTokens: number;
  servedTokens: number;
  avgServiceTime?: number;
}

export class ReportingService {
  // Get daily statistics for a doctor
  async getDailyStats(doctorId: string, startDate?: Date, endDate?: Date): Promise<TimeRangeStats[]> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const end = endDate || new Date();

    const tokens = await prisma.token.findMany({
      where: {
        queue: {
          doctorId: doctorId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        queue: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by day
    const dailyStats = new Map<string, TimeRangeStats>();

    tokens.forEach((token) => {
      const dateKey = token.createdAt.toISOString().split('T')[0];

      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, {
          period: dateKey,
          totalTokens: 0,
          waitingTokens: 0,
          servingTokens: 0,
          servedTokens: 0,
          skippedTokens: 0,
        });
      }

      const stats = dailyStats.get(dateKey)!;
      stats.totalTokens++;

      switch (token.status) {
        case 'WAITING':
          stats.waitingTokens++;
          break;
        case 'SERVING':
          stats.servingTokens++;
          break;
        case 'SERVED':
          stats.servedTokens++;
          break;
        case 'SKIPPED':
          stats.skippedTokens++;
          break;
      }
    });

    return Array.from(dailyStats.values());
  }

  // Get weekly statistics for a doctor
  async getWeeklyStats(doctorId: string, startDate?: Date, endDate?: Date): Promise<TimeRangeStats[]> {
    const start = startDate || new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000); // Last 12 weeks
    const end = endDate || new Date();

    const tokens = await prisma.token.findMany({
      where: {
        queue: {
          doctorId: doctorId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        queue: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by week
    const weeklyStats = new Map<string, TimeRangeStats>();

    tokens.forEach((token) => {
      const date = new Date(token.createdAt);
      const weekNumber = this.getWeekNumber(date);
      const year = date.getFullYear();
      const weekKey = `${year}-W${weekNumber.toString().padStart(2, '0')}`;

      if (!weeklyStats.has(weekKey)) {
        weeklyStats.set(weekKey, {
          period: weekKey,
          totalTokens: 0,
          waitingTokens: 0,
          servingTokens: 0,
          servedTokens: 0,
          skippedTokens: 0,
        });
      }

      const stats = weeklyStats.get(weekKey)!;
      stats.totalTokens++;

      switch (token.status) {
        case 'WAITING':
          stats.waitingTokens++;
          break;
        case 'SERVING':
          stats.servingTokens++;
          break;
        case 'SERVED':
          stats.servedTokens++;
          break;
        case 'SKIPPED':
          stats.skippedTokens++;
          break;
      }
    });

    return Array.from(weeklyStats.values());
  }

  // Get monthly statistics for a doctor
  async getMonthlyStats(doctorId: string, startDate?: Date, endDate?: Date): Promise<TimeRangeStats[]> {
    const start = startDate || new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000); // Last 12 months
    const end = endDate || new Date();

    const tokens = await prisma.token.findMany({
      where: {
        queue: {
          doctorId: doctorId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        queue: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by month
    const monthlyStats = new Map<string, TimeRangeStats>();

    tokens.forEach((token) => {
      const date = new Date(token.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, {
          period: monthKey,
          totalTokens: 0,
          waitingTokens: 0,
          servingTokens: 0,
          servedTokens: 0,
          skippedTokens: 0,
        });
      }

      const stats = monthlyStats.get(monthKey)!;
      stats.totalTokens++;

      switch (token.status) {
        case 'WAITING':
          stats.waitingTokens++;
          break;
        case 'SERVING':
          stats.servingTokens++;
          break;
        case 'SERVED':
          stats.servedTokens++;
          break;
        case 'SKIPPED':
          stats.skippedTokens++;
          break;
      }
    });

    return Array.from(monthlyStats.values());
  }

  // Get yearly statistics for a doctor
  async getYearlyStats(doctorId: string, startDate?: Date, endDate?: Date): Promise<TimeRangeStats[]> {
    const start = startDate || new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000); // Last 5 years
    const end = endDate || new Date();

    const tokens = await prisma.token.findMany({
      where: {
        queue: {
          doctorId: doctorId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        queue: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by year
    const yearlyStats = new Map<string, TimeRangeStats>();

    tokens.forEach((token) => {
      const yearKey = token.createdAt.getFullYear().toString();

      if (!yearlyStats.has(yearKey)) {
        yearlyStats.set(yearKey, {
          period: yearKey,
          totalTokens: 0,
          waitingTokens: 0,
          servingTokens: 0,
          servedTokens: 0,
          skippedTokens: 0,
        });
      }

      const stats = yearlyStats.get(yearKey)!;
      stats.totalTokens++;

      switch (token.status) {
        case 'WAITING':
          stats.waitingTokens++;
          break;
        case 'SERVING':
          stats.servingTokens++;
          break;
        case 'SERVED':
          stats.servedTokens++;
          break;
        case 'SKIPPED':
          stats.skippedTokens++;
          break;
      }
    });

    return Array.from(yearlyStats.values());
  }

  // Get all doctors statistics summary
  async getAllDoctorsStats(startDate?: Date, endDate?: Date): Promise<DoctorStats[]> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const end = endDate || new Date();

    const doctors = await prisma.doctor.findMany({
      include: {
        queues: {
          include: {
            tokens: {
              where: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
            },
          },
        },
      },
    });

    return doctors.map((doctor) => {
      const allTokens = doctor.queues.flatMap((queue) => queue.tokens);
      const servedTokens = allTokens.filter((token) => token.status === 'SERVED');

      // Calculate average service time
      let avgServiceTime: number | undefined;
      if (servedTokens.length > 0) {
        const serviceTimes = servedTokens
          .filter((token) => token.servedAt)
          .map((token) => {
            const createdTime = token.createdAt.getTime();
            const servedTime = token.servedAt!.getTime();
            return (servedTime - createdTime) / 1000 / 60; // minutes
          });

        if (serviceTimes.length > 0) {
          avgServiceTime = serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length;
        }
      }

      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        totalTokens: allTokens.length,
        servedTokens: servedTokens.length,
        avgServiceTime,
      };
    });
  }

  // Get summary statistics for a specific doctor
  async getDoctorSummary(doctorId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const end = endDate || new Date();

    const tokens = await prisma.token.findMany({
      where: {
        queue: {
          doctorId: doctorId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalTokens = tokens.length;
    const waitingTokens = tokens.filter((t) => t.status === 'WAITING').length;
    const servingTokens = tokens.filter((t) => t.status === 'SERVING').length;
    const servedTokens = tokens.filter((t) => t.status === 'SERVED').length;
    const skippedTokens = tokens.filter((t) => t.status === 'SKIPPED').length;

    // Calculate average service time
    const servedWithTime = tokens.filter((t) => t.status === 'SERVED' && t.servedAt);
    let avgServiceTime: number | undefined;

    if (servedWithTime.length > 0) {
      const serviceTimes = servedWithTime.map((token) => {
        const createdTime = token.createdAt.getTime();
        const servedTime = token.servedAt!.getTime();
        return (servedTime - createdTime) / 1000 / 60; // minutes
      });
      avgServiceTime = serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length;
    }

    return {
      totalTokens,
      waitingTokens,
      servingTokens,
      servedTokens,
      skippedTokens,
      avgServiceTime,
      completionRate: totalTokens > 0 ? (servedTokens / totalTokens) * 100 : 0,
    };
  }

  // Helper function to get week number
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}

export const reportingService = new ReportingService();
