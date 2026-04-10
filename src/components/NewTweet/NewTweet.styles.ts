import styled from "styled-components";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

const palette = {
  light: {
    panel: "#ffffff",
    border: "#e1e8ed",
    text: "#0f1419",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
  dark: {
    panel: "#16181c",
    border: "#2f3336",
    text: "#e7e9ea",
    accent: "#1d9bf0",
    accentHover: "#1a8cd8",
  },
};

export const ModalBackdropStyled = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const ModalCardStyled = styled.div<ThemeModeProps>`
  width: 100%;
  max-width: 560px;
  border-radius: 16px;
  border: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  background: ${({ $themeMode }) => palette[$themeMode].panel};
  color: ${({ $themeMode }) => palette[$themeMode].text};
  padding: 16px;
`;

export const ModalHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ModalTitleStyled = styled.h2`
  margin: 0;
  font-size: 18px;
`;

export const ModalCloseButtonStyled = styled.button`
  border: none;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
`;

export const ModalTextareaStyled = styled.textarea<ThemeModeProps>`
  width: 100%;
  min-height: 120px;
  border-radius: 10px;
  border: 1px solid ${({ $themeMode }) => palette[$themeMode].border};
  background: ${({ $themeMode }) => palette[$themeMode].panel};
  color: ${({ $themeMode }) => palette[$themeMode].text};
  padding: 12px;
  resize: vertical;
  font: inherit;

  &:focus {
    outline: none;
    border-color: ${({ $themeMode }) => palette[$themeMode].accent};
  }
`;

export const ModalFooterStyled = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

export const ModalErrorTextStyled = styled.p`
  margin: 10px 0 0;
  color: #d93025;
  font-size: 14px;
`;

export const ModalSubmitButtonStyled = styled.button<ThemeModeProps>`
  border: none;
  background: ${({ $themeMode }) => palette[$themeMode].accent};
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ $themeMode }) => palette[$themeMode].accentHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
