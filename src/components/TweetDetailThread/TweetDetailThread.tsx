import { type FormEvent } from "react";
import { TweetCard, type FeedTweetCardData } from "../TweetCard/TweetCard";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
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
} from "./TweetDetailThread.styles";

export type TweetDetailThreadTweet = FeedTweetCardData & {
  createdAt: string;
};

interface TweetDetailThreadProps {
  tweet: TweetDetailThreadTweet | null;
  replies: TweetDetailThreadTweet[];
  loading: boolean;
  error: string | null;
  replyContent: string;
  replyError: string | null;
  isSubmittingReply: boolean;
  canReply: boolean;
  currentUserAvatar: string;
  onReplyContentChange: (value: string) => void;
  onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
}

export const TweetDetailThread = ({
  tweet,
  replies,
  loading,
  error,
  replyContent,
  replyError,
  isSubmittingReply,
  canReply,
  currentUserAvatar,
  onReplyContentChange,
  onReplySubmit,
  onRetry,
}: TweetDetailThreadProps) => {
  if (loading) return <DetailStateTextStyled>Loading tweet details...</DetailStateTextStyled>;

  if (error) {
    return (
      <div>
        <DetailStateTextStyled>{error}</DetailStateTextStyled>
        <RetryButtonStyled type="button" onClick={onRetry}>
          Try again
        </RetryButtonStyled>
      </div>
    );
  }

  if (!tweet) return <DetailStateTextStyled>Tweet not found.</DetailStateTextStyled>;

  return (
    <TweetDetailPageStyled>
      <FocusedTweetSectionStyled>
        <TweetCard
          tweet={tweet}
          timeLabel={formatTimeAgo(tweet.createdAt)}
          enableDetailNavigation={false}
          sizeVariant="expanded"
        />
      </FocusedTweetSectionStyled>

      <InlineReplyComposerStyled onSubmit={onReplySubmit}>
        <ComposerAvatarStyled src={currentUserAvatar} alt="Your profile" />

        <ComposerInputAreaStyled>
          <ComposerTextareaStyled
            placeholder="Tweet your reply"
            value={replyContent}
            onChange={(event) => onReplyContentChange(event.target.value)}
            disabled={!canReply || isSubmittingReply}
            maxLength={300}
          />
          <ComposerHintStyled>{replyContent.length}/300</ComposerHintStyled>
          {replyError ? <ComposerErrorStyled>{replyError}</ComposerErrorStyled> : null}
        </ComposerInputAreaStyled>

        <ComposerSubmitButtonStyled
          type="submit"
          disabled={!canReply || !replyContent.trim() || isSubmittingReply}
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