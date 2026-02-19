import styled from "styled-components";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    text: "#0f1419",
    textSecondary: "#536471",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
  dark: {
    text: "#e7e9ea",
    textSecondary: "#71767b",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
};

export const MenuLinkStyled = styled.a<ThemeModeProps>`
  text-decoration: none;
  color: ${({ $themeMode }) => palette[$themeMode].text};
  font-size: 20px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ $themeMode }) =>
      $themeMode === "light" ? "rgba(15, 20, 25, 0.08)" : "rgba(231, 233, 234, 0.1)"};
  }

  &.active {
    font-weight: 700;
  }

  @media (max-width: 1100px) {
    span {
      display: none;
    }
    font-size: 22px;
    padding: 12px;
  }
`;
