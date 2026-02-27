import type { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BackButtonStyled,
  MainContentStyled,
  ContentHeaderStyled,
  ContentHeaderRowStyled,
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
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";

  return (
    <MainContentStyled $themeMode={themeMode}>
      <ContentHeaderStyled $themeMode={themeMode}>
        <ContentHeaderRowStyled>
          {showBackButton && (
            <BackButtonStyled
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </BackButtonStyled>
          )}
          {title}
        </ContentHeaderRowStyled>
      </ContentHeaderStyled>
      <ContentBodyStyled>{children}</ContentBodyStyled>
    </MainContentStyled>
  );
};
