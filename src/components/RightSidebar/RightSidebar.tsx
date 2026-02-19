import type { ReactNode } from "react";
import { SidebarStyled, CardStyled, CardTitleStyled } from "./RightSidebar.styles";

interface RightSidebarProps {
  themeMode: "light" | "dark";
  children: ReactNode;
}

export const RightSidebar = ({ themeMode, children }: RightSidebarProps) => {
  return <SidebarStyled $themeMode={themeMode}>{children}</SidebarStyled>;
};

interface TrendCardProps {
  title: string;
  themeMode: "light" | "dark";
  children: ReactNode;
}

export const TrendCard = ({ title, themeMode, children }: TrendCardProps) => {
  return (
    <CardStyled $themeMode={themeMode}>
      <CardTitleStyled $themeMode={themeMode}>{title}</CardTitleStyled>
      {children}
    </CardStyled>
  );
};
