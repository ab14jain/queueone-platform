import { useSettings, getFont, getFontSize } from "../context/SettingsContext";

export default function LanguageSelector() {
  const { fontSize, setFontSize } = useSettings();
  const sizes = getFontSize(fontSize);

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        fontSize: sizes.base,
      }}
    >
      {/* Font Size Selector */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: sizes.h2 }}>📏</span>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value as any)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontFamily: "inherit",
            cursor: "pointer",
            fontSize: sizes.base,
          }}
        >
          <option value="small">छोटा (14px)</option>
          <option value="medium">मध्यम (16px)</option>
          <option value="large">बड़ा (18px)</option>
          <option value="xlarge">बहुत बड़ा (20px) 👴👵</option>
          <option value="xxlarge">XX बड़ा (24px) 👴👵</option>
        </select>
      </div>
    </div>
  );
}
