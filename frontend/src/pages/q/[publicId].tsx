import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import QueueStatus from "../../components/QueueStatus";
import RegisterForm from "../../components/RegisterForm";
import LanguageSelector from "../../components/LanguageSelector";
import { createToken } from "../../services/api";
import { useQueue } from "../../hooks/useQueue";
import { getTranslation } from "../../services/i18n";
import { useSettings, getFont, getFontSize } from "../../context/SettingsContext";
export default function QueuePage() {
  const router = useRouter();
  const { font, fontSize } = useSettings();
  const sizes = getFontSize(fontSize);
  const language = "hi"; // Hindi only
  const publicId = useMemo(() => {
    const value = router.query.publicId;
    return typeof value === "string" ? value : undefined;
  }, [router.query.publicId]);

  const { data, loading, error } = useQueue(publicId);
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [myTokenStatus, setMyTokenStatus] = useState<"waiting" | "serving" | "served" | null>(null);

  // Check if my token is being called
  useEffect(() => {
    if (!tokenNumber || !data) return;

    if (data.nowServing === tokenNumber) {
      setMyTokenStatus("serving");
    } else if (myTokenStatus !== "served") {
      setMyTokenStatus("waiting");
    }
  }, [data?.nowServing, tokenNumber, myTokenStatus]);

  const handleSubmit = async ({ patientName: pName, mobile }: { patientName?: string; mobile?: string }) => {
    if (!data?.queue.id) return;
    try {
      const response = await createToken({ queueId: data.queue.id, patientName: pName, mobile });
      setTokenNumber(response.tokenNumber);
      setPatientName(pName || null);
      setMyTokenStatus("waiting");
      setSubmitError(null);
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading queue…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container">
        <p>Unable to load queue.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ fontFamily: getFont(font), fontSize: sizes.base }}>
      <LanguageSelector />

      {/* My Token Status - Shows if user has registered */}
      {tokenNumber && myTokenStatus && (
        <div
          className="card"
          style={{
            backgroundColor: myTokenStatus === "serving" ? "#dcfce7" : "#fef3c7",
            border: myTokenStatus === "serving" ? "3px solid #16a34a" : "2px solid #f59e0b",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {myTokenStatus === "serving" ? "🔔" : "⏳"}
            </div>
            {patientName && (
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12, opacity: 0.8 }}>
                👤 {patientName}
              </div>
            )}
            <div className="highlight" style={{ fontSize: 56, margin: "8px 0" }}>
              {tokenNumber}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: myTokenStatus === "serving" ? "#16a34a" : "#f59e0b",
              }}
            >
              {myTokenStatus === "serving" ? "✓ YOUR TURN!" : "🕐 Your Position"}
            </div>
          </div>
          {myTokenStatus === "serving" ? (
            <div
              style={{
                color: "#16a34a",
                fontSize: 18,
                fontWeight: 600,
                textAlign: "center",
                padding: 12,
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                borderRadius: 8,
              }}
            >
              📍 Please proceed to the counter
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 6 }}>
                <div className="small" style={{ opacity: 0.7 }}>People ahead</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>👥 {data.waitingCount}</div>
              </div>
              <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 6 }}>
                <div className="small" style={{ opacity: 0.7 }}>Est. wait</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  ⏱️ {data.estimatedWaitMinutes !== null ? `${data.estimatedWaitMinutes}m` : "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <QueueStatus
        nowServing={data.nowServing}
        waitingCount={data.waitingCount}
        estimatedWaitMinutes={data.estimatedWaitMinutes}
        status={data.queue.status}
      />
      <RegisterForm
        disabled={data.queue.status === "CLOSED"}
        onSubmit={handleSubmit}
        tokenNumber={tokenNumber}
        error={submitError}
      />
    </div>
  );
}
