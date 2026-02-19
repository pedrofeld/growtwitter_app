import styled from "styled-components";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    border: "#e1e8ed",
    text: "#0f1419",
    textSecondary: "#536471",
  },
  dark: {
    border: "#2f3336",
    text: "#e7e9ea",
    textSecondary: "#71767b",
  },
};

export const TrendItemStyled = styled.div<ThemeModeProps>`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $themeMode }) =>
      $themeMode === "light" ? "rgba(15, 20, 25, 0.08)" : "rgba(231, 233, 234, 0.1)"};
  }

  strong {
    display: block;
    font-size: 14px;
    margin-bottom: 3px;
    color: ${({ $themeMode }) => palette[$themeMode].text};
  }

  span {
    color: ${({ $themeMode }) => palette[$themeMode].textSecondary};
    font-size: 13px;
  }
`;
