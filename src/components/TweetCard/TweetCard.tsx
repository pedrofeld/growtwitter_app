import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { TweetHeader } from "../TweetHeader/TweetHeader";
import {
  MetaRowStyled,
  MetricStyled,
  ProfileImageStyled,
  ReplyTagStyled,
  TweetBodyLayoutStyled,
  TweetCardStyled,
  TweetContentStyled,
  TweetMainContentStyled,
} from "./TweetCard.styles";

interface TweetAuthor {
  imgUrl: string;
  id: string;
  name: string;
  username: string;
  profileImage: string;
}

export interface FeedTweetCardData {
  id: string;
  author: TweetAuthor;
  content: string;
  likesCount: number;
  repliesCount: number;
  parentId?: string;
}

interface TweetCardProps {
  tweet: FeedTweetCardData;
  timeLabel: string;
}

export const TweetCard = ({ tweet, timeLabel }: TweetCardProps) => {
  return (
    <TweetCardStyled>
      <TweetBodyLayoutStyled>
        <ProfileImageStyled
          src={tweet.author.profileImage}
          alt={`Photo of ${tweet.author.username}`}
        />

        <TweetMainContentStyled>
          <TweetHeader
            name={tweet.author.name}
            username={tweet.author.username}
            timeLabel={timeLabel}
          />

          {tweet.parentId && <ReplyTagStyled>Replying to a tweet</ReplyTagStyled>}

          <TweetContentStyled>{tweet.content}</TweetContentStyled>

          <MetaRowStyled>
            <MetricStyled>
              <FaRegHeart />
              {tweet.likesCount}
            </MetricStyled>
            <MetricStyled>
              <FaRegComment />
              {tweet.repliesCount}
            </MetricStyled>
          </MetaRowStyled>
        </TweetMainContentStyled>
      </TweetBodyLayoutStyled>
    </TweetCardStyled>
  );
};
