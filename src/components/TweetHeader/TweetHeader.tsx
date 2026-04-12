import {
  AuthorHandleStyled,
  AuthorInlineStyled,
  AuthorNameStyled,
  AuthorProfileLinkStyled,
  TweetHeaderStyled,
  TweetTimeStyled,
} from "./TweetHeader.styles";
import type { KeyboardEventHandler, MouseEventHandler } from "react";

interface TweetHeaderProps {
  name: string;
  username: string;
  timeLabel: string;
  isExpanded?: boolean;
  authorProfilePath?: string;
  onAuthorClick?: MouseEventHandler<HTMLAnchorElement>;
  onAuthorKeyDown?: KeyboardEventHandler<HTMLAnchorElement>;
}

export const TweetHeader = ({
  name,
  username,
  timeLabel,
  isExpanded = false,
  authorProfilePath,
  onAuthorClick,
  onAuthorKeyDown,
}: TweetHeaderProps) => {
  return (
    <TweetHeaderStyled>
      <AuthorInlineStyled>
        {authorProfilePath ? (
          <AuthorProfileLinkStyled
            to={authorProfilePath}
            onClick={onAuthorClick}
            onKeyDown={onAuthorKeyDown}
          >
            <AuthorNameStyled $isExpanded={isExpanded}>{name}</AuthorNameStyled>
            <AuthorHandleStyled $isExpanded={isExpanded}>@{username}</AuthorHandleStyled>
          </AuthorProfileLinkStyled>
        ) : (
          <>
            <AuthorNameStyled $isExpanded={isExpanded}>{name}</AuthorNameStyled>
            <AuthorHandleStyled $isExpanded={isExpanded}>@{username}</AuthorHandleStyled>
          </>
        )}
      </AuthorInlineStyled>

      <TweetTimeStyled $isExpanded={isExpanded}>{timeLabel}</TweetTimeStyled>
    </TweetHeaderStyled>
  );
};
