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

export const MainContentStyled = styled.main<ThemeModeProps>`
  min-height: 100vh;
  min-width: 0;
  width: 100%;
  border-left: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  border-right: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  background: ${({ $themeMode }) => palette[$themeMode].panel};

  ${media.mobile} {
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

  ${media.mobile} {
    padding: 14px 16px;
    font-size: 18px;
  }
`;

export const ContentHeaderRowStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButtonStyled = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  min-width: 36px;
  min-height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 16px;
  }
`;

export const ContentBodyStyled = styled.section`
  padding: 16px;

  ${media.mobile} {
    padding: 12px 12px calc(82px + env(safe-area-inset-bottom));
  }
`;
