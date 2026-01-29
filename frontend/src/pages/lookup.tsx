import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { useSettings, getFont, getFontSize } from "../context/SettingsContext";

export default function TokenLookup() {
  const { font, fontSize } = useSettings();
  const sizes = getFontSize(fontSize);
  const [mobile, setMobile] = useState("");
  const [publicId, setPublicId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(
        `${apiUrl}/api/tokens/lookup?publicId=${publicId}&mobile=${mobile}`
      );

      if (!response.ok) {
        throw new Error("Token not found");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    if (status === "SERVING")
      return { bg: "#dcfce7", border: "#16a34a", icon: "🔔", text: "YOUR TURN!", color: "#16a34a" };
    if (status === "SERVED")
      return { bg: "#f3f4f6", border: "#6b7280", icon: "✓", text: "Completed", color: "#6b7280" };
    return { bg: "#fef3c7", border: "#f59e0b", icon: "⏳", text: "Waiting", color: "#f59e0b" };
  };

  return (
    <div className="container" style={{ fontFamily: getFont(font), fontSize: sizes.base }}>
      <LanguageSelector />
      <div className="card">
        <div className="badge" style={{ fontSize: sizes.badge }}>🎫 QueueOne</div>
        <h1 className="h1" style={{ fontSize: sizes.h1 }}>📱 Check Your Token</h1>
        <p className="small" style={{ fontSize: sizes.small }}>Enter your mobile number to find your token status</p>
      </div>

      <div className="card">
        <form className="grid" onSubmit={handleLookup}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🆔</span>
            <input
              className="input"
              placeholder="Queue ID (e.g., q_abc12345)"
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              required
              disabled={loading}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>📞</span>
            <input
              className="input"
              type="tel"
              placeholder="Mobile number (e.g., 8965879654)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              disabled={loading}
              style={{ flex: 1 }}
            />
          </div>
          <button className="button" type="submit" disabled={loading} style={{ fontSize: 16 }}>
            {loading ? "🔍 Searching..." : "🔍 Find My Token"}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: "#fee2e2", borderRadius: 8 }}>
            <p className="small" style={{ color: "#dc2626" }}>❌ {error}</p>
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 24,
              padding: 20,
              backgroundColor: getStatusConfig(result.token.status).bg,
              border: `3px solid ${getStatusConfig(result.token.status).border}`,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 12,
                textAlign: "center",
                color: getStatusConfig(result.token.status).color,
              }}
            >
              {getStatusConfig(result.token.status).icon}
            </div>
            <div className="highlight" style={{ fontSize: 56, margin: "12px 0", textAlign: "center" }}>
              {result.token.tokenNumber}
            </div>
            {result.token.patientName && (
              <div style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 12, opacity: 0.8 }}>
                👤 {result.token.patientName}
              </div>
            )}
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
                color: getStatusConfig(result.token.status).color,
                marginBottom: 16,
              }}
            >
              {getStatusConfig(result.token.status).text}
            </div>

            <div style={{ borderTop: `2px solid ${getStatusConfig(result.token.status).border}`, paddingTop: 16 }}>
              <div className="small" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 16, marginRight: 8 }}>🏥</span>
                {result.queue.name} • {result.queue.location}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}
              >
                <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 6 }}>
                  <div className="small" style={{ opacity: 0.7 }}>Now Serving</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {result.nowServing ? `🔊 ${result.nowServing}` : "—"}
                  </div>
                </div>
                <div style={{ padding: 12, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 6 }}>
                  <div className="small" style={{ opacity: 0.7 }}>Waiting</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>👥 {result.waitingCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
