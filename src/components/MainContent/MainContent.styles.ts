import styled from "styled-components";

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

export const MainContentStyled = styled.main<ThemeModeProps>`
  min-height: 100vh;
  border-left: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  border-right: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  background: ${({ $themeMode }) => palette[$themeMode].panel};

  @media (max-width: 760px) {
    border: none;
    border-top: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  }
`;

export const ContentHeaderStyled = styled.header<ThemeModeProps>`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ $themeMode }) => palette[$themeMode].panel};
  border-bottom: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  padding: 16px;
  font-size: 20px;
  font-weight: 800;
  color: ${({ $themeMode }) => palette[$themeMode].text};
`;

export const ContentBodyStyled = styled.section`
  padding: 16px;
`;
