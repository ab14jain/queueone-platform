import { useRouter } from "next/router";
import { useMemo, useEffect, useState } from "react";
import { fetchQueue, QueueResponse } from "../../services/api";
import { createQueueSocket } from "../../services/socket";

export default function DisplayScreen() {
  const router = useRouter();
  const publicId = useMemo(
    () => (typeof router.query.publicId === "string" ? router.query.publicId : undefined),
    [router.query.publicId]
  );

  const [data, setData] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!publicId) return;

    const load = async () => {
      try {
        const response = await fetchQueue(publicId);
        setData(response);
        setLastUpdate(new Date());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [publicId]);

  useEffect(() => {
    if (!data?.queue.id) return;

    const socket = createQueueSocket(data.queue.id);

    socket.on(
      "queue:update",
      (payload: { waitingCount?: number; nowServing?: string | null }) => {
        setData((current) => {
          if (!current) return current;
          setLastUpdate(new Date());
          return {
            ...current,
            nowServing: payload.nowServing ?? current.nowServing,
            waitingCount: payload.waitingCount ?? current.waitingCount,
          };
        });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [data?.queue.id]);

  if (loading || !data) {
    return (
      <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1>Loading queue display…</h1>
      </div>
    );
  }

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, marginBottom: 20 }}>{data.queue.name}</h1>
        <p style={{ fontSize: 24, color: "#94a3b8", marginBottom: 60 }}>
          {data.queue.location.name}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 60 }}>
          <div style={{ background: "#1e293b", padding: 40, borderRadius: 16 }}>
            <div style={{ fontSize: 20, color: "#94a3b8", marginBottom: 20 }}>Now Serving</div>
            <div style={{ fontSize: 120, fontWeight: 700, color: "#38bdf8", lineHeight: 1 }}>
              {data.nowServing || "—"}
            </div>
          </div>

          <div style={{ background: "#1e293b", padding: 40, borderRadius: 16 }}>
            <div style={{ fontSize: 20, color: "#94a3b8", marginBottom: 20 }}>Waiting</div>
            <div style={{ fontSize: 120, fontWeight: 700, color: "#22c55e", lineHeight: 1 }}>
              {data.waitingCount}
            </div>
          </div>
        </div>

        <div style={{ background: "#1e293b", padding: 30, borderRadius: 16, marginBottom: 40 }}>
          <div style={{ fontSize: 18, color: "#94a3b8", marginBottom: 10 }}>
            Estimated Wait Time
          </div>
          <div style={{ fontSize: 60, fontWeight: 600, color: "#fbbf24" }}>
            {data.estimatedWaitMinutes} min
          </div>
        </div>

        <div style={{ fontSize: 14, color: "#64748b" }}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
