import { prisma } from "../../config/db";
import { redis } from "../../config/redis";

export const getQueueRedisKeys = (queueId: string) => ({
  waiting: `queue:${queueId}:waiting`,
  current: `queue:${queueId}:current`,
});

export const ensureQueueCache = async (queueId: string): Promise<void> => {
  const keys = getQueueRedisKeys(queueId);
  const [waitingLen, currentTokenId] = await Promise.all([
    redis.llen(keys.waiting),
    redis.get(keys.current),
  ]);

  if (waitingLen > 0 || currentTokenId) {
    return;
  }

  const waitingTokens = await prisma.token.findMany({
    where: { queueId, status: "WAITING" },
    orderBy: { sequence: "asc" },
    select: { id: true },
  });

  if (waitingTokens.length > 0) {
    const tokenIds = waitingTokens.map((token: { id: string }) => token.id);
    await redis.rpush(keys.waiting, ...tokenIds);
  }

  const currentToken = await prisma.token.findFirst({
    where: { queueId, status: "SERVING" },
    orderBy: { sequence: "asc" },
    select: { id: true },
  });

  if (currentToken) {
    await redis.set(keys.current, currentToken.id);
  }
};

export const computeEstimatedWaitMinutes = async (queueId: string, waitingCount: number): Promise<number> => {
  if (waitingCount === 0) {
    return 0;
  }

  const recentServed = await prisma.token.findMany({
    where: { queueId, status: "SERVED", servedAt: { not: null } },
    orderBy: { servedAt: "desc" },
    take: 20,
    select: { createdAt: true, servedAt: true },
  });

  if (recentServed.length === 0) {
    return waitingCount * 5;
  }

  const avgMinutes =
    recentServed.reduce((sum: number, token: { createdAt: Date; servedAt: Date | null }) => {
      const diffMs = token.servedAt!.getTime() - token.createdAt.getTime();
      return sum + diffMs / 60000;
    }, 0) / recentServed.length;

  return Math.max(1, Math.round(avgMinutes)) * waitingCount;
};
