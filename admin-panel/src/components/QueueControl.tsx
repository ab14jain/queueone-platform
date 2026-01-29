import { useState } from "react";
import DoctorEnrollment from "../components/DoctorEnrollment";
import QueueControl from "../components/QueueControl";

type View = "enroll" | "control";

export default function AdminHome() {
  const [view, setView] = useState<View>("enroll");

  return (
    <>
      {view === "enroll" && (
        <>
          <DoctorEnrollment />
          <div className="container">
            <button
              className="button"
              onClick={() => setView("control")}
              style={{ background: "#64748b" }}
            >
              → Queue Control Room
            </button>
          </div>
        </>
      )}

      {view === "control" && (
        <>
          <QueueControl />
          <div className="container">
            <button
              className="button"
              onClick={() => setView("enroll")}
              style={{ background: "#64748b" }}
            >
              ← Back to Enrollment
            </button>
          </div>
        </>
      )}
    </>
  );
}
