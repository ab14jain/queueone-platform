import type { AppProps } from "next/app";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AppThemeProvider } from "../context/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </AppThemeProvider>
  );
}
