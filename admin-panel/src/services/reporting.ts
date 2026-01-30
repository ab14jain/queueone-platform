import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export interface DoctorSummary {
  totalTokens: number;
  waitingTokens: number;
  servingTokens: number;
  servedTokens: number;
  skippedTokens: number;
  avgServiceTime?: number;
  completionRate: number;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export const reportingApi = {
  // Get daily statistics for a doctor
  getDailyStats: async (doctorId: string, dateRange?: DateRange): Promise<TimeRangeStats[]> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctor/${doctorId}/daily${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },

  // Get weekly statistics for a doctor
  getWeeklyStats: async (doctorId: string, dateRange?: DateRange): Promise<TimeRangeStats[]> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctor/${doctorId}/weekly${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },

  // Get monthly statistics for a doctor
  getMonthlyStats: async (doctorId: string, dateRange?: DateRange): Promise<TimeRangeStats[]> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctor/${doctorId}/monthly${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },

  // Get yearly statistics for a doctor
  getYearlyStats: async (doctorId: string, dateRange?: DateRange): Promise<TimeRangeStats[]> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctor/${doctorId}/yearly${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },

  // Get doctor summary
  getDoctorSummary: async (doctorId: string, dateRange?: DateRange): Promise<DoctorSummary> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctor/${doctorId}/summary${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },

  // Get all doctors statistics
  getAllDoctorsStats: async (dateRange?: DateRange): Promise<DoctorStats[]> => {
    const params = new URLSearchParams();
    if (dateRange?.startDate) {
      params.append('startDate', dateRange.startDate.toISOString());
    }
    if (dateRange?.endDate) {
      params.append('endDate', dateRange.endDate.toISOString());
    }

    const response = await axios.get(
      `${API_URL}/reporting/doctors${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data.data;
  },
};
