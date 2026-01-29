type QueueStatusProps = {
  nowServing: string | null;
  waitingCount: number;
  estimatedWaitMinutes: number;
  status: "OPEN" | "CLOSED";
};

export default function QueueStatus({
  nowServing,
  waitingCount,
  estimatedWaitMinutes,
  status,
}: QueueStatusProps) {
  return (
    <div className="card">
      <h2 className="h2">Live Queue</h2>
      <div className="grid">
        <div>
          <div className="small">Now Serving</div>
          <div className="highlight">{nowServing || "—"}</div>
        </div>
        <div>
          <div className="small">Waiting</div>
          <div className="badge">{waitingCount} people</div>
        </div>
        <div>
          <div className="small">Estimated Wait</div>
          <div className="badge">{estimatedWaitMinutes} min</div>
        </div>
        <div>
          <div className="small">Queue Status</div>
          <div className="badge">{status}</div>
        </div>
      </div>
    </div>
  );
}
