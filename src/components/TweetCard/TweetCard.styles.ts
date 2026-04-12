import styled from "styled-components";
import { Link } from "react-router-dom";

interface TweetCardStyledProps {
  $isClickable: boolean;
  $sizeVariant: "default" | "expanded";
}

export const TweetCardStyled = styled.article<TweetCardStyledProps>`
  border: 1px solid #e1e8ed;
  border-radius: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "16px" : "12px")};
  padding: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "18px" : "12px")};
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};

  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

export const TweetBodyLayoutStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

interface ProfileImageStyledProps {
  $sizeVariant: "default" | "expanded";
}

export const ProfileImageStyled = styled.img<ProfileImageStyledProps>`
  width: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "48px" : "40px")};
  height: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "48px" : "40px")};
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const AuthorAvatarLinkStyled = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 999px;
  }
`;

export const TweetMainContentStyled = styled.div`
  width: 100%;
  min-width: 0;
`;

interface TweetContentStyledProps {
  $sizeVariant: "default" | "expanded";
}

export const TweetContentStyled = styled.p<TweetContentStyledProps>`
  margin: 8px 0 12px;
  white-space: pre-wrap;
  line-height: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "1.55" : "1.4")};
  font-size: ${({ $sizeVariant }) => ($sizeVariant === "expanded" ? "22px" : "15px")};
`;

export const MetaRowStyled = styled.footer`
  display: flex;
  gap: 16px;
`;

export const MetricStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.9;
  cursor: pointer;
`;

export const LikeButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: inherit;
  opacity: 0.9;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;
`;

export const ReplyTagStyled = styled.small`
  display: inline-block;
  margin-top: 6px;
  margin-bottom: 6px;
  opacity: 0.75;
`;
