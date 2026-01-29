import { Server } from "socket.io";
import http from "http";

let io: Server | null = null;

export const initSocketServer = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const queueId = socket.handshake.query.queueId;
    if (typeof queueId === "string") {
      socket.join(`queue:${queueId}`);
    }
  });

  return io;
};

export const getSocketServer = (): Server => {
  if (!io) {
    throw new Error("Socket.IO server not initialized");
  }
  return io;
};

export const emitQueueUpdate = (queueId: string, payload: unknown): void => {
  if (!io) {
    return;
  }
  io.to(`queue:${queueId}`).emit("queue:update", payload);
};
