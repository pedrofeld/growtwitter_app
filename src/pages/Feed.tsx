import { useEffect, useState } from "react";
import tweetService from "../config/services/tweet.service";
import { useAuth } from "../config/context/AuthContext";
import {
  isCreatedTweet,
  prependUniqueTweet,
  TWEET_CREATED_EVENT,
} from "../config/events/tweetCreatedEvent";
import { TweetCard, type FeedTweetCardData } from "../components/TweetCard/TweetCard";

interface FeedUser {
  id: string;
}

interface FeedTweetApi {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    imgUrl?: string;
  };
  content: string;
  createdAt: string;
  likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
  likesCount?: number;
  replies?: unknown[];
  repliesCount?: number;
  parentId?: string;
}

interface FeedTweet extends FeedTweetCardData {
  createdAt: string;
}

interface TweetsPayload {
  data: FeedTweetApi[];
}

// Converts ISO date string to relative time ("5m", "2h", "3d")
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = (Date.now() - date.getTime()) / 1000;

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

  return `${Math.floor(seconds / 86400)}d`;
}

export const FeedPage = () => {
  const { user } = useAuth();

  // Local UI state for data, loading state, and request errors
  const [tweets, setTweets] = useState<FeedTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      if (!user) {
        setTweets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const currentUser = user as FeedUser;
        const response = await tweetService.getFeed(currentUser.id);

        if (!response.ok) {
          setError("Error loading feed");
          setTweets([]);
          return;
        }

        const payload = (response.data ?? []) as FeedTweetApi[] | TweetsPayload;
        const allTweets = Array.isArray(payload)
          ? payload
          : payload.data

        const visibleTweets: FeedTweet[] = allTweets
          .filter((tweet) => tweet?.user?.id)
          .map((tweet) => {
            const profileImage = tweet.user.profileImage || tweet.user.imgUrl || "";

            return {
              id: tweet.id,
              author: {
                id: tweet.user.id,
                name: tweet.user.name,
                username: tweet.user.username,
                profileImage,
                imgUrl: profileImage,
              },
              content: tweet.content,
              createdAt: tweet.createdAt,
              likes: tweet.likes,
              likesCount: tweet.likesCount ?? (tweet.likes?.length ?? 0),
              repliesCount: tweet.repliesCount ?? (tweet.replies?.length ?? 0),
              parentId: tweet.parentId,
            };
          });

        // Show newest tweets first
        visibleTweets.sort(
          (firstTweet, secondTweet) =>
            new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
        );

        setTweets(visibleTweets);
      } catch {
        setError("Error loading feed");
        setTweets([]);
      } finally {
        setLoading(false);
      }
    }

    void loadFeed();
  }, [user]);

  useEffect(() => {
    function handleTweetCreated(event: Event) {
      const customEvent = event as CustomEvent<unknown>;
      if (!isCreatedTweet(customEvent.detail)) return;

      const createdTweet: FeedTweet = customEvent.detail;

      setTweets((previousTweets) => prependUniqueTweet(previousTweets, createdTweet));
    }

    window.addEventListener(TWEET_CREATED_EVENT, handleTweetCreated);

    return () => {
      window.removeEventListener(TWEET_CREATED_EVENT, handleTweetCreated);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} timeLabel={formatTimeAgo(tweet.createdAt)} />
      ))}
    </div>
  );
};
