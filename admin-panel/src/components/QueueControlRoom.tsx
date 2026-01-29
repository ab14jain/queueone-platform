import { useEffect, useMemo, useState } from "react";
import { callNext, fetchQueue, QueueResponse, setQueueStatus, skipCurrent } from "../services/api";
import { createQueueSocket } from "../services/socket";

export default function QueueControlComponent() {
  const [publicId, setPublicId] = useState("");
  const [queue, setQueue] = useState<QueueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const queueId = useMemo(() => queue?.queue.id ?? null, [queue]);

  const loadQueue = async () => {
    if (!publicId.trim()) return;
    try {
      setLoading(true);
      const response = await fetchQueue(publicId.trim());
      setQueue(response);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!queueId) return;
    const socket = createQueueSocket(queueId);
    socket.on(
      "queue:update",
      (payload: { waitingCount?: number; nowServing?: string | null; status?: "OPEN" | "CLOSED" }) => {
        setQueue((current) => {
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
  }, [queueId]);

  const handleNext = async () => {
    if (!queueId) return;
    await callNext(queueId);
  };

  const handleSkip = async () => {
    if (!queueId) return;
    await skipCurrent(queueId);
  };

  const handleToggleStatus = async () => {
    if (!queueId || !queue) return;
    const nextStatus = queue.queue.status === "OPEN" ? "close" : "open";
    const response = await setQueueStatus(queueId, nextStatus);
    setQueue((current) =>
      current
        ? {
            ...current,
            queue: {
              ...current.queue,
              status: response.status,
            },
          }
        : current
    );
  };

  return (
    <div className="container">
      <div className="card">
        <div className="badge">QueueOne Admin</div>
        <h1>Queue Control Room</h1>
        <div className="grid">
          <input
            className="input"
            placeholder="Enter queue public ID"
            value={publicId}
            onChange={(event) => setPublicId(event.target.value)}
          />
          <button className="button" onClick={loadQueue} disabled={loading}>
            {loading ? "Loading..." : "Load Queue"}
          </button>
        </div>
        {error ? <p className="small">{error}</p> : null}
      </div>

      {queue ? (
        <>
          <div className="card">
            <h2>{queue.queue.name}</h2>
            <p className="small">{queue.queue.location.name}</p>
            <div className="grid">
              <div>
                <div className="small">Now Serving</div>
                <div className="highlight">{queue.nowServing || "—"}</div>
              </div>
              <div>
                <div className="small">Waiting</div>
                <div className="badge">{queue.waitingCount} people</div>
              </div>
              <div>
                <div className="small">Status</div>
                <div className="badge">{queue.queue.status}</div>
              </div>
            </div>
          </div>
          <div className="card grid">
            <button className="button" onClick={handleNext}>
              Call Next Token
            </button>
            <button className="button" onClick={handleSkip}>
              Skip Current Token
            </button>
            <button className="button" onClick={handleToggleStatus}>
              {queue.queue.status === "OPEN" ? "Close Queue" : "Open Queue"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
