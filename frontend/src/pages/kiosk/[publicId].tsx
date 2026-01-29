import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createToken } from "../../services/api";
import { useQueue } from "../../hooks/useQueue";

export default function KioskPage() {
  const router = useRouter();
  const publicId = typeof router.query.publicId === "string" ? router.query.publicId : undefined;
  const { data, loading, error } = useQueue(publicId);

  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (loading) {
    return <div className="container"><p>Loading kiosk…</p></div>;
  }

  if (error || !data) {
    return <div className="container"><p>Unable to load queue.</p></div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data?.queue.id) return;

    setSubmitting(true);
    try {
      const response = await createToken({
        queueId: data.queue.id,
        patientName: patientName.trim() || undefined,
        mobile: mobile.trim() || undefined,
      });
      setTokenNumber(response.tokenNumber);
      setPatientName("");
      setMobile("");
      setSubmitError(null);
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTokenNumber(null);
    setPatientName("");
    setMobile("");
  };

  if (tokenNumber) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <div className="badge">Your Token</div>
          <div className="highlight" style={{ fontSize: 80, marginTop: 40 }}>{tokenNumber}</div>
          <p className="small" style={{ marginTop: 20 }}>
            Please wait for your token to be called.
          </p>
          <div style={{ marginTop: 40 }}>
            <div className="small">Waiting: {data.waitingCount} people</div>
            <div className="badge" style={{ marginTop: 8 }}>Est. {data.estimatedWaitMinutes} min</div>
          </div>
        </div>
        <button className="button" onClick={handleReset} style={{ marginTop: 24 }}>
          Generate Another Token
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="badge">Registration Kiosk</div>
        <h1 className="h1">{data.queue.name}</h1>
        <p className="small">{data.queue.location.name}</p>
      </div>

      <div className="card">
        <form className="grid" onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 8 }}>
            <div className="small" style={{ marginBottom: 8 }}>Patient Name (Optional)</div>
            <input
              className="input"
              placeholder="Enter name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              disabled={submitting}
              style={{ fontSize: 18 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 8 }}>
            <div className="small" style={{ marginBottom: 8 }}>Mobile Number (Optional)</div>
            <input
              className="input"
              placeholder="Enter mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              disabled={submitting}
              style={{ fontSize: 18 }}
            />
          </label>

          <button className="button" type="submit" disabled={submitting} style={{ fontSize: 18, padding: "20px 16px" }}>
            {submitting ? "Registering..." : "Get Token"}
          </button>
        </form>

        {submitError && <p className="small" style={{ color: "#dc2626", marginTop: 12 }}>{submitError}</p>}
      </div>

      <div className="card">
        <div className="small">Queue Status</div>
        <div style={{ marginTop: 16 }}>
          <div className="badge">Now Serving: {data.nowServing || "—"}</div>
          <div className="badge" style={{ marginTop: 8 }}>Waiting: {data.waitingCount} people</div>
        </div>
      </div>
    </div>
  );
}
