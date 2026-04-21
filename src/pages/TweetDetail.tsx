import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../config/context/AuthContext";
import tweetService, { type ThreadTweet } from "../config/services/tweet.service";
import { TweetDetailThread, type TweetDetailThreadTweet } from "../components/TweetDetailThread/TweetDetailThread";

interface TweetThreadPayload {
  tweet?: ThreadTweet;
  replies?: ThreadTweet[];
}

function toDetailTweet(tweet: ThreadTweet): TweetDetailThreadTweet {
  return {
    id: tweet.id,
    author: tweet.author,
    content: tweet.content,
    createdAt: tweet.createdAt,
    likes: tweet.likes,
    likesCount: tweet.likesCount,
    repliesCount: tweet.repliesCount,
    parentId: tweet.parentId,
  };
}

export const TweetDetailPage = () => {
  const { tweetId } = useParams();
  const { user } = useAuth();

  const [focusedTweet, setFocusedTweet] = useState<TweetDetailThreadTweet | null>(null);
  const [replies, setReplies] = useState<TweetDetailThreadTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const loadTweetThread = useCallback(async () => {
    if (!tweetId) {
      setLoading(false);
      setError("Tweet not found.");
      setFocusedTweet(null);
      setReplies([]);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await tweetService.getTweetThreadDetail(tweetId);

    if (!response.ok) {
      setFocusedTweet(null);
      setReplies([]);
      setError(response.message || "Error loading tweet details.");
      setLoading(false);
      return;
    }

    const payload = (response.data ?? {}) as TweetThreadPayload;

    if (!payload.tweet) {
      setFocusedTweet(null);
      setReplies([]);
      setError("Tweet not found.");
      setLoading(false);
      return;
    }

    setFocusedTweet(toDetailTweet(payload.tweet));
    setReplies((payload.replies ?? []).map((reply) => toDetailTweet(reply)));
    setLoading(false);
  }, [tweetId]);

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!focusedTweet?.id || !user?.id || isSubmittingReply) return;

    const normalizedContent = replyContent.trim();

    if (!normalizedContent) {
      setReplyError("Write a reply before sending.");
      return;
    }

    setIsSubmittingReply(true);
    setReplyError(null);

    try {
      const response = await tweetService.sendTweet(user.id, normalizedContent, focusedTweet.id);

      if (!response.ok) {
        throw new Error(response.message || "Error creating reply.");
      }

      setReplyContent("");
      await loadTweetThread();
    } catch (submitError) {
      setReplyError(submitError instanceof Error ? submitError.message : "Error creating reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadTweetThread);
  }, [loadTweetThread]);

  const currentUserAvatar = user?.imgUrl || "https://placehold.co/80x80";

  return (
    <TweetDetailThread
      tweet={focusedTweet}
      replies={replies}
      loading={loading}
      error={error}
      replyContent={replyContent}
      replyError={replyError}
      isSubmittingReply={isSubmittingReply}
      canReply={Boolean(user?.id)}
      currentUserAvatar={currentUserAvatar}
      onReplyContentChange={setReplyContent}
      onReplySubmit={handleReplySubmit}
      onRetry={() => void loadTweetThread()}
    />
  );
};
