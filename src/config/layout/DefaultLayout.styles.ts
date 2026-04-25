import styled, { css } from "styled-components";
import { breakpoints, media } from "../styles/breakpoints";
import { themeTokens } from "../styles/themeTokens";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    bg: "#f5f8fa",
    text: "#0f1419",
  },
  dark: {
    bg: "#000000",
    text: "#e7e9ea",
  },
};

export const LayoutRoot = styled.div<ThemeModeProps>`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: ${({ $themeMode }) => palette[$themeMode].bg};
  color: ${({ $themeMode }) => palette[$themeMode].text};

  ${({ $themeMode }) => css`
    --app-page-bg: ${themeTokens[$themeMode].pageBg};
    --app-surface: ${themeTokens[$themeMode].surface};
    --app-surface-alt: ${themeTokens[$themeMode].surfaceAlt};
    --app-border: ${themeTokens[$themeMode].border};
    --app-text: ${themeTokens[$themeMode].text};
    --app-text-muted: ${themeTokens[$themeMode].textMuted};
    --app-hover-surface: ${themeTokens[$themeMode].hoverSurface};
    --app-focus-ring: ${themeTokens[$themeMode].focusRing};
    --app-accent: ${themeTokens[$themeMode].accent};
    --app-accent-hover: ${themeTokens[$themeMode].accentHover};
    --app-selected-surface: ${themeTokens[$themeMode].selectedSurface};
    --app-selected-text: ${themeTokens[$themeMode].selectedText};
    --app-input-bg: ${themeTokens[$themeMode].inputBg};
    --app-input-border: ${themeTokens[$themeMode].inputBorder};
    --app-input-text: ${themeTokens[$themeMode].inputText};
    --app-input-placeholder: ${themeTokens[$themeMode].inputPlaceholder};
    --app-danger: ${themeTokens[$themeMode].danger};
    --app-success: ${themeTokens[$themeMode].success};
    --app-avatar-border: ${themeTokens[$themeMode].avatarBorder};
    --app-button-secondary-bg: ${themeTokens[$themeMode].buttonSecondaryBg};
    --app-button-secondary-text: ${themeTokens[$themeMode].buttonSecondaryText};
    --app-button-secondary-border: ${themeTokens[$themeMode].buttonSecondaryBorder};
    --app-button-secondary-hover-bg: ${themeTokens[$themeMode].buttonSecondaryHoverBg};
    --app-button-secondary-hover-border: ${themeTokens[$themeMode].buttonSecondaryHoverBorder};
    --app-button-primary-text: ${themeTokens[$themeMode].buttonPrimaryText};
  `}
`;

export const LayoutContainer = styled.div<ThemeModeProps>`
  max-width: ${breakpoints.desktop}px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 320px;
  gap: 24px;

  ${media.tablet} {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 16px;
  }

  ${media.mobile} {
    grid-template-columns: minmax(0, 1fr);
    padding: 0;
    gap: 0;
  }
`;
