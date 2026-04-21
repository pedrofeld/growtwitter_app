import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../config/context/AuthContext";
import userService from "../config/services/user.service";
import tweetService, { type ThreadTweet } from "../config/services/tweet.service";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "../utils/avatar";
import { TweetDetailThread, type TweetDetailThreadTweet } from "../components/TweetDetailThread/TweetDetailThread";

interface TweetThreadPayload {
  tweet?: ThreadTweet;
  replies?: ThreadTweet[];
}

interface AvatarUser {
  id: string;
  profileImage?: string | null;
  imgUrl?: string | null;
}

function parseUsersList(data: unknown): AvatarUser[] {
  if (Array.isArray(data)) {
    return data as AvatarUser[];
  }

  const payload = data as { data?: unknown } | null | undefined;

  if (Array.isArray(payload?.data)) {
    return payload.data as AvatarUser[];
  }

  return [];
}

function resolveAvatarFromUsers(users: AvatarUser[], userId?: string): string {
  if (!userId) {
    return "";
  }

  const matchedUser = users.find((candidate) => candidate.id === userId);

  return resolveAvatarUrl(matchedUser?.profileImage, matchedUser?.imgUrl);
}

function toDetailTweet(tweet: ThreadTweet, resolvedAvatar?: string): TweetDetailThreadTweet {
  const profileImage = resolveAvatarUrl(resolvedAvatar, tweet.author.profileImage, tweet.author.imgUrl);

  return {
    id: tweet.id,
    author: {
      ...tweet.author,
      profileImage,
      imgUrl: profileImage,
    },
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
  const [currentUserAvatar, setCurrentUserAvatar] = useState(DEFAULT_AVATAR);

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

    const [threadResponse, usersResponse] = await Promise.all([
      tweetService.getTweetThreadDetail(tweetId),
      userService.listUsers(),
    ]);

    const users = usersResponse.ok ? parseUsersList(usersResponse.data) : [];
    const currentAvatarFromUsers = resolveAvatarFromUsers(users, user?.id);

    setCurrentUserAvatar(
      resolveAvatarUrl(
        currentAvatarFromUsers,
        (user as { profileImage?: string | null } | null)?.profileImage,
        user?.imgUrl,
      ),
    );

    const response = threadResponse;

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

    const focusedTweetAvatar = resolveAvatarUrl(
      resolveAvatarFromUsers(users, payload.tweet.author.id),
      payload.tweet.author.profileImage,
      payload.tweet.author.imgUrl,
    );

    setFocusedTweet(toDetailTweet(payload.tweet, focusedTweetAvatar));
    setReplies(
      (payload.replies ?? []).map((reply) =>
        toDetailTweet(
          reply,
          resolveAvatarUrl(
            resolveAvatarFromUsers(users, reply.author.id),
            reply.author.profileImage,
            reply.author.imgUrl,
          ),
        ),
      ),
    );
    setLoading(false);
  }, [tweetId, user]);

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
