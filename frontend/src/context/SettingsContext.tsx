import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Language } from "../services/i18n";

type FontOption = "sans" | "serif" | "mono";
type FontSize = "small" | "medium" | "large" | "xlarge" | "xxlarge";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("hi");
  const [font, setFont] = useState<FontOption>("sans");
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const savedFont = localStorage.getItem("font") as FontOption | null;
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedFont) setFont(savedFont);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("font", font);
  }, [font]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  return (
    <SettingsContext.Provider value={{ language, setLanguage, font, setFont, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

export function getFont(fontOption: FontOption) {
  const fonts: Record<FontOption, string> = {
    sans: "system-ui, -apple-system, sans-serif",
    serif: "Georgia, serif",
    mono: "Courier New, monospace",
  };
  return fonts[fontOption];
}

export function getFontSize(sizeOption: FontSize) {
  const sizes: Record<FontSize, { base: number; h1: number; h2: number; badge: number; small: number }> = {
    small: { base: 14, h1: 28, h2: 20, badge: 12, small: 12 },
    medium: { base: 16, h1: 32, h2: 24, badge: 14, small: 14 },
    large: { base: 18, h1: 36, h2: 28, badge: 16, small: 16 },
    xlarge: { base: 20, h1: 40, h2: 32, badge: 18, small: 18 },
    xxlarge: { base: 24, h1: 48, h2: 40, badge: 22, small: 20 },
  };
  return sizes[sizeOption];
}

