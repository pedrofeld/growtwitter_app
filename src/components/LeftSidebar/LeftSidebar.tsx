import logoGrowtweet from "../../assets/logo_growtweet.svg";
import { Menu } from "../Menu/Menu";
import { MenuLink } from "../MenuLink/MenuLink";
import {
  SidebarStyled,
  BrandStyled,
  ActionButtonsRowStyled,
  ThemeToggleButtonStyled,
  LogoutButtonStyled,
  TweetButtonStyled,
} from "./LeftSidebar.styles";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

interface LeftSidebarProps {
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
  onTweet?: () => void;
}

export const LeftSidebar = ({
  themeMode,
  onToggleTheme,
  onLogout,
  onTweet = () => undefined,
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

      <TweetButtonStyled onClick={onTweet} $themeMode={themeMode}>
        Tweetar
      </TweetButtonStyled>

      <ActionButtonsRowStyled>
        <ThemeToggleButtonStyled
          onClick={onToggleTheme}
          $themeMode={themeMode}
          aria-label="Toggle Theme"
        >
          {themeMode === "light" ? <MdDarkMode /> : <MdOutlineDarkMode />}
        </ThemeToggleButtonStyled>

        <LogoutButtonStyled
          onClick={onLogout}
          $themeMode={themeMode}
          aria-label="Logout"
        >
          <CiLogout />
        </LogoutButtonStyled>
      </ActionButtonsRowStyled>
    </SidebarStyled>
  );
};
