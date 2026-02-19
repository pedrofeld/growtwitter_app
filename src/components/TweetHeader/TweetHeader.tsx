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
}

export const TweetHeader = ({ name, username, timeLabel }: TweetHeaderProps) => {
  return (
    <TweetHeaderStyled>
      <AuthorInlineStyled>
        <AuthorNameStyled>{name}</AuthorNameStyled>
        <AuthorHandleStyled>@{username}</AuthorHandleStyled>
      </AuthorInlineStyled>

      <TweetTimeStyled>{timeLabel}</TweetTimeStyled>
    </TweetHeaderStyled>
  );
};
