import { NavLink } from "react-router-dom";
import { MenuLinkStyled } from "./MenuLink.styles";
import type { ReactNode } from "react";

interface MenuLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  themeMode: "light" | "dark";
  end?: boolean;
}

export const MenuLink = ({
  to,
  icon,
  label,
  themeMode,
  end = false,
}: MenuLinkProps) => {
  return (
    <MenuLinkStyled
      as={NavLink}
      to={to}
      end={end}
      $themeMode={themeMode}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </MenuLinkStyled>
  );
};
