const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type QueueResponse = {
  queue: {
    id: string;
    name: string;
    publicId: string;
    tokenPrefix: string;
    status: "OPEN" | "CLOSED";
    location: {
      id: string;
      name: string;
      address: string;
      type: string;
    };
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

export const createToken = async (payload: {
  queueId: string;
  patientName?: string;
  mobile?: string;
}): Promise<{ tokenNumber: string; tokenId: string; waitingCount: number }> => {
  const response = await fetch(`${API_BASE}/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to create token");
  }
  return response.json();
};
