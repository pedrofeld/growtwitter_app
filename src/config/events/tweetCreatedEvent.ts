import type { FeedTweetCardData } from "../../components/TweetCard/TweetCard";

export const TWEET_CREATED_EVENT = "tweet:created";

export interface CreatedTweet extends FeedTweetCardData {
  createdAt: string;
}

export function emitTweetCreatedEvent(tweet: CreatedTweet): void {
  window.dispatchEvent(new CustomEvent<CreatedTweet>(TWEET_CREATED_EVENT, { detail: tweet }));
}

export function isCreatedTweet(value: unknown): value is CreatedTweet {
  if (!value || typeof value !== "object") return false;

  const tweet = value as Partial<CreatedTweet>;

  return (
    typeof tweet.id === "string"
    && typeof tweet.content === "string"
    && typeof tweet.createdAt === "string"
    && typeof tweet.likesCount === "number"
    && typeof tweet.repliesCount === "number"
    && !!tweet.author
    && typeof tweet.author.id === "string"
    && typeof tweet.author.name === "string"
    && typeof tweet.author.username === "string"
    && typeof tweet.author.profileImage === "string"
    && typeof tweet.author.imgUrl === "string"
  );
}

export function prependUniqueTweet<T extends { id: string }>(tweets: T[], createdTweet: T): T[] {
  const remainingTweets = tweets.filter((tweet) => tweet.id !== createdTweet.id);
  return [createdTweet, ...remainingTweets];
}
