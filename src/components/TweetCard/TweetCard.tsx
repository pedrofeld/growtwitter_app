import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/context/AuthContext";
import likeService from "../../config/services/like.service";
import { TweetHeader } from "../TweetHeader/TweetHeader";
import {
  AuthorAvatarLinkStyled,
  LikeButtonStyled,
  MetaRowStyled,
  MetricStyled,
  ProfileImageStyled,
  ReplyTagStyled,
  TweetBodyLayoutStyled,
  TweetCardStyled,
  TweetContentStyled,
  TweetMainContentStyled,
} from "./TweetCard.styles";

interface TweetLike {
  id?: string;
  userId?: string;
  likeId?: string;
  _id?: string;
  user?: {
    id?: string;
  };
}

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
  likes?: Array<TweetLike | string>;
  repliesCount: number;
  parentId?: string;
}

interface TweetCardProps {
  tweet: FeedTweetCardData;
  timeLabel: string;
  enableDetailNavigation?: boolean;
  sizeVariant?: "default" | "expanded";
}

export const TweetCard = ({
  tweet,
  timeLabel,
  enableDetailNavigation = true,
  sizeVariant = "default",
}: TweetCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  function getUserIdFromToken(): string | undefined {
    const rawToken = localStorage.getItem("authToken");
    if (!rawToken) return undefined;

    const normalizedToken = rawToken.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "").trim();
    const payloadPart = normalizedToken.split(".")[1];
    if (!payloadPart) return undefined;

    try {
      const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64)) as {
        id?: string;
        userId?: string;
        sub?: string;
      };

      return payload.id || payload.userId || payload.sub;
    } catch {
      return undefined;
    }
  }

  function getLikeUserId(like: TweetLike | string): string | undefined {
    if (typeof like === "string") return like;
    return like.userId || like.user?.id || undefined;
  }

  function getLikeId(like: TweetLike | string): string | undefined {
    if (typeof like === "string") return undefined;

    return like.likeId || like._id || like.id || undefined;
  }

  function getLikeIdFromResponse(data: unknown): string | undefined {
    const payload = data as
      | {
          id?: string;
          _id?: string;
          likeId?: string;
          data?: {
            id?: string;
            _id?: string;
            likeId?: string;
            like?: { id?: string; _id?: string; likeId?: string };
          };
          like?: { id?: string; _id?: string; likeId?: string };
        }
      | undefined;

    return (
      payload?.likeId ||
      payload?.id ||
      payload?._id ||
      payload?.data?.likeId ||
      payload?.data?.id ||
      payload?.data?._id ||
      payload?.like?.likeId ||
      payload?.like?.id ||
      payload?.like?._id ||
      payload?.data?.like?.likeId ||
      payload?.data?.like?.id ||
      payload?.data?.like?._id
    );
  }

  const findUserLike = useMemo(() => {
    if (!user?.id || !tweet.likes?.length) return null;

    return tweet.likes.find((like) => {
      return getLikeUserId(like) === user.id;
    });
  }, [tweet.likes, user?.id]);

  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [isLiked, setIsLiked] = useState(Boolean(findUserLike));
  const [currentLikeId, setCurrentLikeId] = useState(() => {
    if (!findUserLike) return undefined;
    return getLikeId(findUserLike);
  });
  const [isLiking, setIsLiking] = useState(false);

  const authorProfilePath = tweet.author.username
    ? tweet.author.id === user?.id
      ? "/profile"
      : `/profile/${tweet.author.username}`
    : undefined;

  function handleAuthorNavigationClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  function handleAuthorNavigationKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    event.stopPropagation();

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  async function handleLikeClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (!user?.id || isLiking) return;

    const requestUserId = getUserIdFromToken() || user.id;

    setIsLiking(true);

    try {
      if (isLiked) {
        if (!currentLikeId) {
          throw new Error("Like id not found for unlike");
        }

        const response = await likeService.unlikeTweet(currentLikeId);

        if (!response.ok) {
          throw new Error(response.message || "Error unliking tweet");
        }

        setIsLiked(false);
        setCurrentLikeId(undefined);
        setLikesCount((previousCount) => Math.max(previousCount - 1, 0));
        return;
      }

      const response = await likeService.likeTweet(requestUserId, tweet.id);

      if (!response.ok) {
        throw new Error(response.message || "Error liking tweet");
      }

      const responseLikeId = getLikeIdFromResponse(response.data);

      setIsLiked(true);
      setCurrentLikeId(responseLikeId);
      setLikesCount((previousCount) => previousCount + 1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error processing like";
      console.error("Like action failed", {
        error,
        userId: user?.id,
        tweetId: tweet.id,
        isLiked,
        currentLikeId,
      });
      window.alert(errorMessage);
    } finally {
      setIsLiking(false);
    }
  }

  function handleOpenTweetDetail() {
    if (!enableDetailNavigation) return;

    navigate(`/tweet/${tweet.id}`);
  }

  return (
    <TweetCardStyled
      $isClickable={enableDetailNavigation}
      $sizeVariant={sizeVariant}
      onClick={handleOpenTweetDetail}
      aria-label={`Open tweet from @${tweet.author.username}`}
    >
      <TweetBodyLayoutStyled>
        {authorProfilePath ? (
          <AuthorAvatarLinkStyled
            to={authorProfilePath}
            onClick={handleAuthorNavigationClick}
            onKeyDown={handleAuthorNavigationKeyDown}
          >
            <ProfileImageStyled
              $sizeVariant={sizeVariant}
              src={tweet.author.profileImage}
              alt={`Photo of ${tweet.author.username}`}
            />
          </AuthorAvatarLinkStyled>
        ) : (
          <ProfileImageStyled
            $sizeVariant={sizeVariant}
            src={tweet.author.profileImage}
            alt={`Photo of ${tweet.author.username}`}
          />
        )}

        <TweetMainContentStyled>
          <TweetHeader
            name={tweet.author.name}
            username={tweet.author.username}
            timeLabel={timeLabel}
            isExpanded={sizeVariant === "expanded"}
            authorProfilePath={authorProfilePath}
            onAuthorClick={handleAuthorNavigationClick}
            onAuthorKeyDown={handleAuthorNavigationKeyDown}
          />

          {tweet.parentId && <ReplyTagStyled>Replying to a tweet</ReplyTagStyled>}

          <TweetContentStyled $sizeVariant={sizeVariant}>{tweet.content}</TweetContentStyled>

          <MetaRowStyled>
            <LikeButtonStyled type="button" onClick={handleLikeClick} disabled={isLiking}>
              {isLiked ? <FaHeart color="#e0245e" /> : <FaRegHeart />}
              {likesCount}
            </LikeButtonStyled>
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
