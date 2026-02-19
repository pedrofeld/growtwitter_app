import styled from "styled-components";

interface ThemeModeProps {
  $themeMode: "light" | "dark";
}

export const MenuStyled = styled.nav<ThemeModeProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
