import styled from "styled-components";
import { media } from "../../config/styles/breakpoints";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    panel: "#ffffff",
    border: "#e1e8ed",
    text: "#0f1419",
  },
  dark: {
    panel: "#16181c",
    border: "#2f3336",
    text: "#e7e9ea",
  },
};

export const SidebarStyled = styled.aside<ThemeModeProps>`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ $themeMode }) => palette[$themeMode].text};

  ${media.tablet} {
    display: none;
  }
`;

export const CardStyled = styled.div<ThemeModeProps>`
  border: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  background: ${({ $themeMode }) => palette[$themeMode].panel};
  border-radius: 16px;
  overflow: hidden;
`;

export const CardTitleStyled = styled.h2<ThemeModeProps>`
  margin: 0;
  padding: 16px;
  font-size: 20px;
  font-weight: 800;
  border-bottom: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  color: ${({ $themeMode }) => palette[$themeMode].text};
`;
