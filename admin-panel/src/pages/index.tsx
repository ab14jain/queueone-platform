import { useState } from "react";
import DoctorEnrollment from "../components/DoctorEnrollment";
import QueueControlRoom from "../components/QueueControlRoom";

type Tab = "enroll" | "control";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("enroll");

  return (
    <>
      <div className="container" style={{ paddingBottom: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <div className="badge">👨‍⚕️ Admin Dashboard</div>
            <h1 className="h1" style={{ margin: "8px 0 0 0" }}>
              🏥 QueueOne Management
            </h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              onClick={() => setActiveTab("enroll")}
              style={{
                padding: "16px",
                border: activeTab === "enroll" ? "2px solid #3b82f6" : "1px solid #d1d5db",
                backgroundColor: activeTab === "enroll" ? "#eff6ff" : "#f9fafb",
                color: activeTab === "enroll" ? "#1e40af" : "#374151",
                borderRadius: 8,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              📝 Enroll Doctor
            </button>
            <button
              onClick={() => setActiveTab("control")}
              style={{
                padding: "16px",
                border: activeTab === "control" ? "2px solid #3b82f6" : "1px solid #d1d5db",
                backgroundColor: activeTab === "control" ? "#eff6ff" : "#f9fafb",
                color: activeTab === "control" ? "#1e40af" : "#374151",
                borderRadius: 8,
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              🎮 Queue Control
            </button>
          </div>
        </div>
      </div>

      {activeTab === "enroll" && <DoctorEnrollment />}
      {activeTab === "control" && <QueueControlRoom />}
    </>
  );
}
