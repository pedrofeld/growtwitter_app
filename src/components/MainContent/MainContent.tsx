import type { ReactNode } from "react";
import {
  MainContentStyled,
  ContentHeaderStyled,
  ContentBodyStyled,
} from "./MainContent.styles";

interface MainContentProps {
  title: string;
  children: ReactNode;
  themeMode: "light" | "dark";
}

export const MainContent = ({
  title,
  children,
  themeMode,
}: MainContentProps) => {
  return (
    <MainContentStyled $themeMode={themeMode}>
      <ContentHeaderStyled $themeMode={themeMode}>
        {title}
      </ContentHeaderStyled>
      <ContentBodyStyled>{children}</ContentBodyStyled>
    </MainContentStyled>
  );
};
