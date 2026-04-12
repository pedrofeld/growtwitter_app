export const TWEET_LIKE_CHANGED_EVENT = "tweet:like-changed";

export interface TweetLikeChangedDetail {
  tweetId: string;
  userId: string;
  isLiked: boolean;
  likeId?: string;
}

export function emitTweetLikeChangedEvent(detail: TweetLikeChangedDetail): void {
  window.dispatchEvent(new CustomEvent<TweetLikeChangedDetail>(TWEET_LIKE_CHANGED_EVENT, { detail }));
}

export function isTweetLikeChangedDetail(value: unknown): value is TweetLikeChangedDetail {
  if (!value || typeof value !== "object") return false;

  const detail = value as Partial<TweetLikeChangedDetail>;

  return (
    typeof detail.tweetId === "string"
    && typeof detail.userId === "string"
    && typeof detail.isLiked === "boolean"
  );
}