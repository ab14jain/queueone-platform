const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Helper to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper to create headers with auth
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export type QueueResponse = {
  queue: {
    id: string;
    name: string;
    publicId: string;
    tokenPrefix: string;
    status: "OPEN" | "CLOSED";
    location: { name: string; address: string };
  };
  nowServing: string | null;
  waitingCount: number;
  estimatedWaitMinutes: number;
};

export const fetchQueue = async (publicId: string): Promise<QueueResponse> => {
  const response = await fetch(`${API_BASE}/queues/${publicId}`);
  if (!response.ok) {
    throw new Error("Unable to load queue");
  }
  return response.json();
};

export const callNext = async (queueId: string) => {
  const response = await fetch(`${API_BASE}/queues/${queueId}/next`, { 
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to call next token");
  }
  return response.json();
};

export const skipCurrent = async (queueId: string) => {
  const response = await fetch(`${API_BASE}/queues/${queueId}/skip`, { 
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to skip token");
  }
  return response.json();
};

export const setQueueStatus = async (queueId: string, status: "open" | "close") => {
  const response = await fetch(`${API_BASE}/queues/${queueId}/${status}`, { 
    method: "POST",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to update queue");
  }
  return response.json();
};

// Export axios with configured headers for other services
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to axios requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
