import { useCallback, useEffect, useMemo, useState } from "react";
import { createQueueSocket } from "../services/socket";
import { fetchQueue, QueueResponse } from "../services/api";

export const useQueue = (publicId?: string) => {
  const [data, setData] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!publicId) return;
    try {
      setLoading(true);
      const response = await fetchQueue(publicId);
      setData(response);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [publicId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!data?.queue.id) return;

    const socket = createQueueSocket(data.queue.id);

    socket.on(
      "queue:update",
      (payload: Partial<QueueResponse> & { waitingCount?: number; nowServing?: string | null; status?: "OPEN" | "CLOSED" }) => {
      setData((current) => {
        if (!current) return current;
        return {
          ...current,
          nowServing: payload.nowServing ?? current.nowServing,
          waitingCount: payload.waitingCount ?? current.waitingCount,
          queue: {
            ...current.queue,
            status: payload.status ?? current.queue.status,
          },
        };
      });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [data?.queue.id]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
    }),
    [data, error, loading, refresh]
  );
};
