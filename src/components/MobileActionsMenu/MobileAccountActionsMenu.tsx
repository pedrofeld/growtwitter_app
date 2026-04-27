import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import {
  MobileAccountActionsButton,
  MobileAccountActionsMenuPanel,
  MobileAccountActionsMenuRoot,
  MobileAccountActionsMenuSection,
  MobileAccountActionsMenuText,
  MobileAccountActionsMenuTitle,
  MobileAccountActionsTriggerButton,
} from "./MobileAccountActionsMenu.styles";

interface MobileAccountActionsMenuProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileAccountActionsMenu = ({
  themeMode,
  onToggleTheme,
  onLogout,
}: MobileAccountActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((currentState) => !currentState);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleToggleTheme = () => {
    closeMenu();
    onToggleTheme();
  };

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <MobileAccountActionsMenuRoot $themeMode={themeMode}>
      <MobileAccountActionsTriggerButton
        type="button"
        onClick={toggleMenu}
        $themeMode={themeMode}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="mobile-account-actions-menu"
        aria-label="Open account actions"
      >
        <FaEllipsisH />
        More
      </MobileAccountActionsTriggerButton>

      {isOpen ? (
        <MobileAccountActionsMenuPanel
          id="mobile-account-actions-menu"
          role="menu"
          aria-label="Account actions"
          $themeMode={themeMode}
        >
          <MobileAccountActionsMenuSection $themeMode={themeMode}>
            <MobileAccountActionsMenuTitle $themeMode={themeMode}>
              Account
            </MobileAccountActionsMenuTitle>
            <MobileAccountActionsMenuText $themeMode={themeMode}>
              Quick controls for theme and session.
            </MobileAccountActionsMenuText>
          </MobileAccountActionsMenuSection>

          <MobileAccountActionsButton
            type="button"
            role="menuitem"
            onClick={handleToggleTheme}
            $themeMode={themeMode}
          >
            {themeMode === "light" ? <MdDarkMode /> : <MdOutlineDarkMode />}
            {themeMode === "light" ? "Switch to dark" : "Switch to light"}
          </MobileAccountActionsButton>

          <MobileAccountActionsButton
            type="button"
            role="menuitem"
            onClick={handleLogout}
            $themeMode={themeMode}
            $danger
          >
            <CiLogout />
            Logout
          </MobileAccountActionsButton>
        </MobileAccountActionsMenuPanel>
      ) : null}
    </MobileAccountActionsMenuRoot>
  );
};