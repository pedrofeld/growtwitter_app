import styled from "styled-components";

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
  background: ${({ $themeMode }) => palette[$themeMode].bg};
  color: ${({ $themeMode }) => palette[$themeMode].text};
`;

export const LayoutContainer = styled.div<ThemeModeProps>`
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 320px;
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 88px minmax(0, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 0;
  }
`;
