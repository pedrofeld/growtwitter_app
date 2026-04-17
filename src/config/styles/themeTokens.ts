export type AppThemeMode = "light" | "dark";

export interface AppThemeTokens {
  pageBg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  hoverSurface: string;
  focusRing: string;
  accent: string;
  accentHover: string;
  selectedSurface: string;
  selectedText: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  danger: string;
  success: string;
  avatarBorder: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  buttonSecondaryBorder: string;
  buttonSecondaryHoverBg: string;
  buttonSecondaryHoverBorder: string;
  buttonPrimaryText: string;
}

export const themeTokens: Record<AppThemeMode, AppThemeTokens> = {
  light: {
    pageBg: "#f5f8fa",
    surface: "#ffffff",
    surfaceAlt: "#f7f9fa",
    border: "#e1e8ed",
    text: "#0f1419",
    textMuted: "#536471",
    hoverSurface: "#f7f9fa",
    focusRing: "rgba(29, 155, 240, 0.24)",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
    selectedSurface: "rgba(29, 155, 240, 0.12)",
    selectedText: "#0f1419",
    inputBg: "#f7f9fa",
    inputBorder: "#cfd9de",
    inputText: "#0f1419",
    inputPlaceholder: "#536471",
    danger: "#e0245e",
    success: "#177a3f",
    avatarBorder: "#ffffff",
    buttonSecondaryBg: "#ffffff",
    buttonSecondaryText: "#0f1419",
    buttonSecondaryBorder: "#cfd9de",
    buttonSecondaryHoverBg: "#f7f9f9",
    buttonSecondaryHoverBorder: "#bfc8cf",
    buttonPrimaryText: "#ffffff",
  },
  dark: {
    pageBg: "#000000",
    surface: "#16181c",
    surfaceAlt: "#202327",
    border: "#2f3336",
    text: "#e7e9ea",
    textMuted: "#71767b",
    hoverSurface: "rgba(231, 233, 234, 0.08)",
    focusRing: "rgba(29, 155, 240, 0.32)",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
    selectedSurface: "rgba(29, 155, 240, 0.16)",
    selectedText: "#e7e9ea",
    inputBg: "#202327",
    inputBorder: "#2f3336",
    inputText: "#e7e9ea",
    inputPlaceholder: "#71767b",
    danger: "#f4212e",
    success: "#00ba7c",
    avatarBorder: "#16181c",
    buttonSecondaryBg: "#16181c",
    buttonSecondaryText: "#e7e9ea",
    buttonSecondaryBorder: "#2f3336",
    buttonSecondaryHoverBg: "#1d1f23",
    buttonSecondaryHoverBorder: "#3d4246",
    buttonPrimaryText: "#ffffff",
  },
};
