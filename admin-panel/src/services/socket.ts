import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const createQueueSocket = (queueId: string): Socket => {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    query: { queueId },
  });
};
