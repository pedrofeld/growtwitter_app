import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import {
  MobileBottomNavItem,
  MobileBottomNavRoot,
} from "./MobileBottomNav.styles";
import { MobileAccountActionsMenu } from "../MobileActionsMenu/MobileAccountActionsMenu";

interface MobileBottomNavProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileBottomNav = ({
  themeMode,
  onToggleTheme,
  onLogout,
}: MobileBottomNavProps) => {
  return (
    <MobileBottomNavRoot
      $themeMode={themeMode}
      aria-label="Primary mobile navigation"
    >
      <MobileBottomNavItem to="/" end $themeMode={themeMode}>
        <FaHome />
        Home
      </MobileBottomNavItem>
      <MobileBottomNavItem to="/explore" $themeMode={themeMode}>
        <FaSearch />
        Explore
      </MobileBottomNavItem>
      <MobileBottomNavItem to="/profile" $themeMode={themeMode}>
        <FaUser />
        Profile
      </MobileBottomNavItem>
      <MobileAccountActionsMenu
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
      />
    </MobileBottomNavRoot>
  );
};
