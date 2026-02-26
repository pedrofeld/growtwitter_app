import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LeftSidebar } from "../../components/LeftSidebar/LeftSidebar";
import { MainContent } from "../../components/MainContent/MainContent";
import { RightSidebar, TrendCard } from "../../components/RightSidebar/RightSidebar";
import { TrendItem } from "../../components/TrendItem/TrendItem";
import { NewTweet } from "../../components/NewTweet/NewTweet";
import { LayoutRoot, LayoutContainer } from "./DefaultLayout.styles";

export const DefaultLayout = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isNewTweetModalOpen, setIsNewTweetModalOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.includes("explore")) return "Explore";
    if (location.pathname.includes("profile")) return "Profile";
    return "GrowTwitter";
  }, [location.pathname]);

  const toggleTheme = () => {
    setThemeMode((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  };

  const openNewTweetModal = () => {
    setIsNewTweetModalOpen(true);
  };

  const closeNewTweetModal = () => {
    setIsNewTweetModalOpen(false);
  };

  return (
    <LayoutRoot $themeMode={themeMode}>
      <LayoutContainer $themeMode={themeMode}>
        <LeftSidebar
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onLogout={logout}
          onTweet={openNewTweetModal}
        />

        <MainContent title={pageTitle} themeMode={themeMode}>
          <Outlet />
        </MainContent>

        <RightSidebar themeMode={themeMode}>
          <TrendCard title="What's happening" themeMode={themeMode}>
            <TrendItem
              category="Technology · Trending"
              title="#React"
              themeMode={themeMode}
            />
            <TrendItem
              category="Programming · Trending"
              title="#TypeScript"
              themeMode={themeMode}
            />
            <TrendItem
              category="Web · Trending"
              title="#Frontend"
              themeMode={themeMode}
            />
          </TrendCard>
        </RightSidebar>
      </LayoutContainer>

      <NewTweet
        isOpen={isNewTweetModalOpen}
        onClose={closeNewTweetModal}
        themeMode={themeMode}
      />
    </LayoutRoot>
  );
};