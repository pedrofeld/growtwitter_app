import styled from "styled-components";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    text: "#0f1419",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
  dark: {
    text: "#e7e9ea",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
};

export const ThemeToggleButtonStyled = styled.button<ThemeModeProps>`
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? "#ccc" : "#555")};
  background: ${({ $themeMode }) =>
    $themeMode === "light" ? "#fff" : "#16181c"};
  color: ${({ $themeMode }) => palette[$themeMode].text};
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ $themeMode }) => palette[$themeMode].accent};
  }
`;

export const LogoutButtonStyled = styled.button<ThemeModeProps>`
  border: none;
  background: ${({ $themeMode }) => palette[$themeMode].accent};
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ $themeMode }) => palette[$themeMode].accentHover};
  }
`;

export const SidebarStyled = styled.aside<ThemeModeProps>`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ $themeMode }) => palette[$themeMode].text};

  @media (max-width: 760px) {
    display: none;
  }
`;

export const BrandStyled = styled.h1`
  margin: 0;
  padding: 10px 12px;
  display: flex;
  justify-content: flex-start;

  img {
    width: 50%;
    height: auto;
  }
`;
