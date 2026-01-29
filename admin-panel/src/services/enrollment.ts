const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type EnrollmentResponse = {
  doctorId: string;
  queueId: string;
  publicId: string;
  qrUrl: string;
};

export const enrollDoctor = async (payload: {
  doctorName: string;
  doctorEmail?: string;
  doctorMobile?: string;
  locationName: string;
  locationAddress: string;
  locationType: string;
  queueName: string;
  tokenPrefix: string;
}): Promise<EnrollmentResponse> => {
  const response = await fetch(`${API_BASE}/doctors/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Enrollment failed");
  }
  return response.json();
};

export const getQrImage = (queueId: string): string => {
  return `${API_BASE}/queues/${queueId}/qr`;
};
