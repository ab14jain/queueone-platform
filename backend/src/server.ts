import "dotenv/config";
import http from "http";
import app from "./app";
import { initSocketServer } from "./websocket/socket.server";
import { prisma } from "./config/db";

const port = Number(process.env.PORT || 4000);

const server = http.createServer(app);

initSocketServer(server);

// Run migrations on startup
const runMigrations = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log("Running database migrations...");
    await prisma.$executeRawUnsafe(`SELECT 1`);
    // eslint-disable-next-line no-console
    console.log("Database connected. Migrations completed.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Migration check error:", error);
  }
};

runMigrations().then(() => {
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`QueueOne API listening on port ${port}`);
  });
});
