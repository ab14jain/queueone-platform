const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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
  const response = await fetch(`${API_BASE}/queues/${queueId}/next`, { method: "POST" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to call next token");
  }
  return response.json();
};

export const skipCurrent = async (queueId: string) => {
  const response = await fetch(`${API_BASE}/queues/${queueId}/skip`, { method: "POST" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to skip token");
  }
  return response.json();
};

export const setQueueStatus = async (queueId: string, status: "open" | "close") => {
  const response = await fetch(`${API_BASE}/queues/${queueId}/${status}`, { method: "POST" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to update queue");
  }
  return response.json();
};
