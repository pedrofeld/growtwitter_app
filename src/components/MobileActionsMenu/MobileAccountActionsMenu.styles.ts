import styled, { css } from "styled-components";
import { mobileBottomNavItemStyles, type ThemeModeProps } from "../MobileBottomNav/MobileBottomNav.styles";

interface ActionButtonProps extends ThemeModeProps {
  $danger?: boolean;
}

const palette = {
  light: {
    panel: "#ffffff",
    border: "#e1e8ed",
    text: "#0f1419",
    textMuted: "#536471",
    buttonBg: "#f7f9fa",
    buttonBorder: "#e1e8ed",
    buttonHoverBg: "#eef3f8",
    buttonHoverBorder: "#cfd9de",
    buttonText: "#0f1419",
    dangerBg: "rgba(244, 33, 46, 0.08)",
    dangerBorder: "rgba(244, 33, 46, 0.18)",
    dangerHoverBg: "rgba(244, 33, 46, 0.14)",
    dangerText: "#b81d24",
    shadow: "rgba(15, 20, 25, 0.16)",
  },
  dark: {
    panel: "#16181c",
    border: "#2f3336",
    text: "#e7e9ea",
    textMuted: "#8b98a5",
    buttonBg: "#1d2126",
    buttonBorder: "#323743",
    buttonHoverBg: "#242831",
    buttonHoverBorder: "#474d5a",
    buttonText: "#e7e9ea",
    dangerBg: "rgba(244, 33, 46, 0.12)",
    dangerBorder: "rgba(244, 33, 46, 0.22)",
    dangerHoverBg: "rgba(244, 33, 46, 0.18)",
    dangerText: "#f87077",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

export const MobileAccountActionsMenuRoot = styled.div<ThemeModeProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MobileAccountActionsMenuButtonStyles = css<ActionButtonProps>`
  ${mobileBottomNavItemStyles}
  flex-direction: column;
  gap: 4px;
  padding: 0 6px;
  background: transparent;
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

export const MobileAccountActionsMenuPanel = styled.div<ThemeModeProps>`
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  z-index: 40;
  width: min(260px, calc(100vw - 20px));
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  border-radius: 20px;
  background: ${({ $themeMode }) => palette[$themeMode].panel};
  box-shadow: 0 18px 48px ${({ $themeMode }) => palette[$themeMode].shadow};
`;

export const MobileAccountActionsMenuSection = styled.div<ThemeModeProps>`
  display: grid;
  gap: 2px;
  padding: 4px 4px 2px;
`;

export const MobileAccountActionsMenuTitle = styled.span<ThemeModeProps>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $themeMode }) => palette[$themeMode].text};
`;

export const MobileAccountActionsMenuText = styled.span<ThemeModeProps>`
  font-size: 12px;
  line-height: 1.35;
  color: ${({ $themeMode }) => palette[$themeMode].textMuted};
`;

export const MobileAccountActionsTriggerButton = styled.button<ActionButtonProps>`
  min-height: 48px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid
    ${({ $themeMode, $danger }) =>
      $danger ? palette[$themeMode].dangerBorder : palette[$themeMode].buttonBorder};
  background: ${({ $themeMode, $danger }) =>
    $danger ? palette[$themeMode].dangerBg : palette[$themeMode].buttonBg};
  color: ${({ $themeMode, $danger }) =>
    $danger ? palette[$themeMode].dangerText : palette[$themeMode].buttonText};
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ $themeMode, $danger }) =>
      $danger ? palette[$themeMode].dangerHoverBg : palette[$themeMode].buttonHoverBg};
    border-color: ${({ $themeMode, $danger }) =>
      $danger ? palette[$themeMode].dangerBorder : palette[$themeMode].buttonHoverBorder};
  }

  &:focus-visible {
    outline: 2px solid var(--app-focus-ring);
    outline-offset: 2px;
  }
`;

export const MobileAccountActionsButton = styled.button<ActionButtonProps>`
  ${MobileAccountActionsMenuButtonStyles}
`;