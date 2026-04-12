import {
  AuthorHandleStyled,
  AuthorInlineStyled,
  AuthorNameStyled,
  TweetHeaderStyled,
  TweetTimeStyled,
} from "./TweetHeader.styles";

interface TweetHeaderProps {
  name: string;
  username: string;
  timeLabel: string;
  isExpanded?: boolean;
}

export const TweetHeader = ({
  name,
  username,
  timeLabel,
  isExpanded = false,
}: TweetHeaderProps) => {
  return (
    <TweetHeaderStyled>
      <AuthorInlineStyled>
        <AuthorNameStyled $isExpanded={isExpanded}>{name}</AuthorNameStyled>
        <AuthorHandleStyled $isExpanded={isExpanded}>@{username}</AuthorHandleStyled>
      </AuthorInlineStyled>

      <TweetTimeStyled $isExpanded={isExpanded}>{timeLabel}</TweetTimeStyled>
    </TweetHeaderStyled>
  );
};
