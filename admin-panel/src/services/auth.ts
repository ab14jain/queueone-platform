import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'DOCTOR' | 'STAFF' | 'ADMIN';
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const authApi = {
  // Doctor login
  doctorLogin: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/doctor/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Staff login
  staffLogin: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/staff/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Set doctor password
  setDoctorPassword: async (doctorId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/doctor/set-password`, {
        doctorId,
        password,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to set password',
      };
    }
  },

  // Create staff account
  createStaff: async (
    name: string,
    email: string,
    password: string,
    role: 'STAFF' | 'ADMIN' = 'STAFF'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/staff/create`, {
        name,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create staff account',
      };
    }
  },

  // Get current user
  getCurrentUser: async (token: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get user info',
      };
    }
  },

  // Set authorization header
  setAuthHeader: (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Clear authorization header
  clearAuthHeader: () => {
    delete axios.defaults.headers.common['Authorization'];
  },
};
