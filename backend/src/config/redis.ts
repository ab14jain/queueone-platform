import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error("Redis error", error);
});
