import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { media } from "../../config/styles/breakpoints";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    panel: "#ffffff",
    border: "#e1e8ed",
    text: "#536471",
    textActive: "#0f1419",
    activeBg: "rgba(29, 155, 240, 0.12)",
  },
  dark: {
    panel: "#16181c",
    border: "#2f3336",
    text: "#8b98a5",
    textActive: "#e7e9ea",
    activeBg: "rgba(29, 155, 240, 0.2)",
  },
};

export const MobileBottomNavRoot = styled.nav<ThemeModeProps>`
  display: none;

  ${media.mobile} {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
    gap: 8px;
    border-top: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
    background: ${({ $themeMode }) => palette[$themeMode].panel};
    backdrop-filter: blur(8px);
  }
`;

export const MobileBottomNavItem = styled(NavLink)<ThemeModeProps>`
  min-height: 44px;
  border-radius: 999px;
  color: ${({ $themeMode }) => palette[$themeMode].text};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }

  &.active {
    color: ${({ $themeMode }) => palette[$themeMode].textActive};
    background: ${({ $themeMode }) => palette[$themeMode].activeBg};
    font-weight: 700;
  }
`;
