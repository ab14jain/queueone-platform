import { useState } from "react";

type RegisterFormProps = {
  disabled?: boolean;
  onSubmit: (payload: { patientName?: string; mobile?: string }) => Promise<void>;
  tokenNumber?: string | null;
  error?: string | null;
};

export default function RegisterForm({ disabled, onSubmit, tokenNumber, error }: RegisterFormProps) {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mobile.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        patientName: patientName.trim() || undefined,
        mobile: mobile.trim(),
      });
      setPatientName("");
      setMobile("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="h2">अपना टोकन प्राप्त करें</h2>
      <form className="grid" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="रोगी का नाम (वैकल्पिक)"
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          disabled={disabled || submitting}
        />
        <input
          className="input"
          placeholder="मोबाइल नंबर (आवश्यक)"
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          disabled={disabled || submitting}
          required
          pattern="[0-9]{10}"
          maxLength={10}
        />
        <button className="button" type="submit" disabled={disabled || submitting || !mobile.trim()}>
          {submitting ? "पंजीकरण हो रहा है..." : "टोकन प्राप्त करें"}
        </button>
      </form>
      {tokenNumber ? (
        <div style={{ marginTop: 16 }}>
          <div className="small">Your token</div>
          <div className="highlight">{tokenNumber}</div>
        </div>
      ) : null}
      {error ? <p className="small">{error}</p> : null}
    </div>
  );
}
