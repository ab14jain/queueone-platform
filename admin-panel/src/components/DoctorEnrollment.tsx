import { useState } from "react";
import { enrollDoctor, EnrollmentResponse, getQrImage } from "../services/enrollment";

export default function DoctorEnrollment() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnrollmentResponse | null>(null);

  const [formData, setFormData] = useState({
    doctorName: "",
    doctorEmail: "",
    doctorMobile: "",
    locationName: "",
    locationAddress: "",
    locationType: "Hospital",
    queueName: "",
    tokenPrefix: "A",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await enrollDoctor({
        doctorName: formData.doctorName.trim(),
        doctorEmail: formData.doctorEmail.trim() || undefined,
        doctorMobile: formData.doctorMobile.trim() || undefined,
        locationName: formData.locationName.trim(),
        locationAddress: formData.locationAddress.trim(),
        locationType: formData.locationType.trim(),
        queueName: formData.queueName.trim(),
        tokenPrefix: formData.tokenPrefix.trim(),
      });
      setResult(response);
      setStep("result");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setResult(null);
    setFormData({
      doctorName: "",
      doctorEmail: "",
      doctorMobile: "",
      locationName: "",
      locationAddress: "",
      locationType: "Hospital",
      queueName: "",
      tokenPrefix: "A",
    });
  };

  if (step === "result" && result) {
    return (
      <div className="container">
        <div className="card">
          <div className="badge">✓ Enrollment Successful</div>
          <h1 className="h1">Queue Created</h1>
          <div className="grid" style={{ marginTop: 24 }}>
            <div>
              <div className="small">Doctor</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{formData.doctorName}</div>
            </div>
            <div>
              <div className="small">Location</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{formData.locationName}</div>
            </div>
            <div>
              <div className="small">Queue Name</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{formData.queueName}</div>
            </div>
            <div>
              <div className="small">Public ID</div>
              <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "monospace" }}>
                {result.publicId}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Queue QR Code</h2>
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <img
              src={getQrImage(result.queueId)}
              alt="Queue QR Code"
              style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
            />
          </div>
          <a
            href={getQrImage(result.queueId)}
            download={`qr-${result.publicId}.png`}
            className="button"
            style={{ display: "block", textAlign: "center" }}
          >
            Download QR Code
          </a>
          <p className="small" style={{ marginTop: 16, textAlign: "center" }}>
            Share this QR or public ID with patients. Direct them to scan for live queue status.
          </p>
        </div>

        <div className="card grid">
          <div>
            <div className="small">Queue URL</div>
            <div style={{ fontSize: 14, fontFamily: "monospace", wordBreak: "break-all" }}>
              {result.qrUrl}
            </div>
          </div>
        </div>

        <button className="button" onClick={handleReset} style={{ marginTop: 16 }}>
          Enroll Another Doctor
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="badge">QueueOne Admin</div>
        <h1 className="h1">Doctor Enrollment</h1>
        <p className="small">Register a doctor and create their queue for today.</p>
      </div>

      <div className="card">
        <form className="grid" style={{ gap: 24 }} onSubmit={handleSubmit}>
          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            <legend style={{ fontWeight: 600, marginBottom: 12 }}>Doctor Details</legend>
            <input
              className="input"
              placeholder="Doctor Name *"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              className="input"
              placeholder="Email (optional)"
              name="doctorEmail"
              type="email"
              value={formData.doctorEmail}
              onChange={handleChange}
              disabled={loading}
            />
            <input
              className="input"
              placeholder="Mobile (optional)"
              name="doctorMobile"
              value={formData.doctorMobile}
              onChange={handleChange}
              disabled={loading}
            />
          </fieldset>

          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            <legend style={{ fontWeight: 600, marginBottom: 0 }}>Location Details</legend>
            <input
              className="input"
              placeholder="Location Name *"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              className="input"
              placeholder="Address *"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <select
              className="input"
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Hospital</option>
              <option>Clinic</option>
              <option>Government Office</option>
              <option>Retail</option>
              <option>Bank</option>
              <option>Other</option>
            </select>
          </fieldset>

          <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            <legend style={{ fontWeight: 600, marginBottom: 0 }}>Queue Settings</legend>
            <input
              className="input"
              placeholder="Queue Name (e.g., General Consultation) *"
              name="queueName"
              value={formData.queueName}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              className="input"
              placeholder="Token Prefix (e.g., A, B) *"
              name="tokenPrefix"
              value={formData.tokenPrefix}
              onChange={handleChange}
              maxLength={2}
              required
              disabled={loading}
            />
          </fieldset>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating Queue..." : "Create Queue & Generate QR"}
          </button>
        </form>

        {error ? <p className="small" style={{ color: "#dc2626", marginTop: 12 }}>{error}</p> : null}
      </div>
    </div>
  );
}
