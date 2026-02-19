import logoGrowtweet from "../../assets/logo_growtweet.svg";
import { Menu } from "../Menu/Menu";
import { MenuLink } from "../MenuLink/MenuLink";
import {
  SidebarStyled,
  BrandStyled,
  ThemeToggleButtonStyled,
  LogoutButtonStyled,
} from "./LeftSidebar.styles";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";

interface LeftSidebarProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const LeftSidebar = ({
  themeMode,
  onToggleTheme,
  onLogout,
}: LeftSidebarProps) => {
  return (
    <SidebarStyled $themeMode={themeMode}>
      <BrandStyled>
        <img src={logoGrowtweet} alt="GrowTwitter Logo" />
      </BrandStyled>

      <Menu $themeMode={themeMode}>
        <MenuLink
          to="/"
          icon={<FaHome />}
          label="Home"
          themeMode={themeMode}
          end
        />
        <MenuLink
          to="/explore"
          icon={<FaSearch />}
          label="Explore"
          themeMode={themeMode}
        />
        <MenuLink
          to="/profile"
          icon={<FaUser />}
          label="Profile"
          themeMode={themeMode}
        />
      </Menu>

      <ThemeToggleButtonStyled onClick={onToggleTheme} $themeMode={themeMode}>
        {themeMode === "light" ? "Dark Mode" : "Light Mode"}
      </ThemeToggleButtonStyled>

      <LogoutButtonStyled onClick={onLogout} $themeMode={themeMode}>
        Logout
      </LogoutButtonStyled>
    </SidebarStyled>
  );
};
