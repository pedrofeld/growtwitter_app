import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LeftSidebar } from "../../components/LeftSidebar/LeftSidebar";
import { MainContent } from "../../components/MainContent/MainContent";
import { RightSidebar, TrendCard } from "../../components/RightSidebar/RightSidebar";
import { TrendItem } from "../../components/TrendItem/TrendItem";
import { NewTweet } from "../../components/NewTweet/NewTweet";
import { MobileBottomNav } from "../../components/MobileBottomNav/MobileBottomNav";
import { LayoutRoot, LayoutContainer } from "./DefaultLayout.styles";

const THEME_STORAGE_KEY = "growtwitter:theme-mode";

const getInitialThemeMode = (): "light" | "dark" => {
  try {
    const savedThemeMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeMode === "light" || savedThemeMode === "dark") {
      return savedThemeMode;
    }
  } catch {
    return "light";
  }

  return "light";
};

export const DefaultLayout = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    getInitialThemeMode,
  );
  const [isNewTweetModalOpen, setIsNewTweetModalOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.includes("explore")) return "Explore";
    if (location.pathname.includes("profile")) return "Profile";
    if (location.pathname.includes("/tweet/")) return "Tweet";
    return "GrowTwitter";
  }, [location.pathname]);

  const toggleTheme = () => {
    setThemeMode((currentTheme) => {
      const nextThemeMode = currentTheme === "light" ? "dark" : "light";

      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
      } catch {
        return nextThemeMode;
      }

      return nextThemeMode;
    });
  };

  const openNewTweetModal = () => {
    setIsNewTweetModalOpen(true);
  };

  const closeNewTweetModal = () => {
    setIsNewTweetModalOpen(false);
  };

  const shouldShowMobileNav =
    location.pathname === "/"
    || location.pathname.startsWith("/explore")
    || location.pathname.startsWith("/profile");

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

      {shouldShowMobileNav ? (
        <MobileBottomNav
          key={location.pathname}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />
      ) : null}
    </LayoutRoot>
  );
};