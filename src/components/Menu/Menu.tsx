import type { ReactNode } from "react";
import { MenuStyled } from "./Menu.styles";

interface MenuProps {
  children: ReactNode;
  $themeMode?: "light" | "dark";
}

export const Menu = ({ children, $themeMode = "light" }: MenuProps) => {
  return <MenuStyled $themeMode={$themeMode}>{children}</MenuStyled>;
};
