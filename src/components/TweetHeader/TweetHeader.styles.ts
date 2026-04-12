import styled from "styled-components";
import { Link } from "react-router-dom";

interface HeaderSizeProps {
  $isExpanded?: boolean;
}

export const TweetHeaderStyled = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AuthorInlineStyled = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const AuthorProfileLinkStyled = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const AuthorNameStyled = styled.strong<HeaderSizeProps>`
  font-size: ${({ $isExpanded }) => ($isExpanded ? "16px" : "14px")};
  font-weight: 700;
`;

export const AuthorHandleStyled = styled.span<HeaderSizeProps>`
  font-size: ${({ $isExpanded }) => ($isExpanded ? "14px" : "13px")};
  opacity: 0.8;
`;

export const TweetTimeStyled = styled.span<HeaderSizeProps>`
  margin-left: auto;
  font-size: ${({ $isExpanded }) => ($isExpanded ? "13px" : "12px")};
  opacity: 0.75;
`;
