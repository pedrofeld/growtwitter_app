import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TweetCard, type FeedTweetCardData } from "../components/TweetCard/TweetCard";
import { useAuth } from "../config/context/AuthContext";
import tweetService, { type ThreadTweet } from "../config/services/tweet.service";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import {
  ComposerAvatarStyled,
  ComposerErrorStyled,
  ComposerHintStyled,
  ComposerInputAreaStyled,
  ComposerSubmitButtonStyled,
  ComposerTextareaStyled,
  DetailStateTextStyled,
  FocusedTweetSectionStyled,
  InlineReplyComposerStyled,
  RepliesSectionStyled,
  RepliesTitleStyled,
  ReplyItemStyled,
  RetryButtonStyled,
  TweetDetailPageStyled,
} from "./TweetDetail.styles";

interface TweetThreadPayload {
  tweet?: ThreadTweet;
  replies?: ThreadTweet[];
}

interface DetailTweet extends FeedTweetCardData {
  createdAt: string;
}

function toDetailTweet(tweet: ThreadTweet): DetailTweet {
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

  const [focusedTweet, setFocusedTweet] = useState<DetailTweet | null>(null);
  const [replies, setReplies] = useState<DetailTweet[]>([]);
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

  if (loading) return <DetailStateTextStyled>Loading tweet details...</DetailStateTextStyled>;

  if (error) {
    return (
      <div>
        <DetailStateTextStyled>{error}</DetailStateTextStyled>
        <RetryButtonStyled type="button" onClick={() => void loadTweetThread()}>
          Try again
        </RetryButtonStyled>
      </div>
    );
  }

  if (!focusedTweet) return <DetailStateTextStyled>Tweet not found.</DetailStateTextStyled>;

  const currentUserAvatar = user?.imgUrl || "https://placehold.co/80x80";

  return (
    <TweetDetailPageStyled>
      <FocusedTweetSectionStyled>
        <TweetCard
          tweet={focusedTweet}
          timeLabel={formatTimeAgo(focusedTweet.createdAt)}
          enableDetailNavigation={false}
          sizeVariant="expanded"
        />
      </FocusedTweetSectionStyled>

      <InlineReplyComposerStyled onSubmit={handleReplySubmit}>
        <ComposerAvatarStyled src={currentUserAvatar} alt="Your profile" />

        <ComposerInputAreaStyled>
          <ComposerTextareaStyled
            placeholder="Tweet your reply"
            value={replyContent}
            onChange={(changeEvent) => setReplyContent(changeEvent.target.value)}
            disabled={!user?.id || isSubmittingReply}
            maxLength={300}
          />
          <ComposerHintStyled>{replyContent.length}/300</ComposerHintStyled>
          {replyError ? <ComposerErrorStyled>{replyError}</ComposerErrorStyled> : null}
        </ComposerInputAreaStyled>

        <ComposerSubmitButtonStyled
          type="submit"
          disabled={!user?.id || !replyContent.trim() || isSubmittingReply}
        >
          {isSubmittingReply ? "Replying..." : "Reply"}
        </ComposerSubmitButtonStyled>
      </InlineReplyComposerStyled>

      <RepliesSectionStyled>
        <RepliesTitleStyled>Replies</RepliesTitleStyled>

        {replies.length === 0 ? (
          <DetailStateTextStyled>No replies yet.</DetailStateTextStyled>
        ) : (
          replies.map((reply) => (
            <ReplyItemStyled key={reply.id}>
              <TweetCard tweet={reply} timeLabel={formatTimeAgo(reply.createdAt)} />
            </ReplyItemStyled>
          ))
        )}
      </RepliesSectionStyled>
    </TweetDetailPageStyled>
  );
};
