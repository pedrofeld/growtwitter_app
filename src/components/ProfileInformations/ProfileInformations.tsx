import { TweetCard, type FeedTweetCardData } from "../TweetCard/TweetCard";
import {
	EmptyStateStyled,
	TabButtonStyled,
	TabListStyled,
	TweetsContainerStyled,
} from "./ProfileInformations.styles";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

export type ProfileTab = "tweets" | "replies" | "likes";

export interface ProfileTweet extends FeedTweetCardData {
	createdAt: string;
	likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
}

interface ProfileInformationsProps {
	activeTab: ProfileTab;
	onTabChange: (tab: ProfileTab) => void;
	tweets: ProfileTweet[];
}

export const ProfileInformations = ({ activeTab, onTabChange, tweets }: ProfileInformationsProps) => {
	return (
		<>
			<TabListStyled>
				<TabButtonStyled type="button" $isActive={activeTab === "tweets"} onClick={() => onTabChange("tweets")}>
					Tweets
				</TabButtonStyled>
				<TabButtonStyled type="button" $isActive={activeTab === "replies"} onClick={() => onTabChange("replies")}>
					Replies
				</TabButtonStyled>
				<TabButtonStyled type="button" $isActive={activeTab === "likes"} onClick={() => onTabChange("likes")}>
					Likes
				</TabButtonStyled>
			</TabListStyled>

			<TweetsContainerStyled>
				{tweets.length === 0 ? (
					<EmptyStateStyled>No content in this tab.</EmptyStateStyled>
				) : (
					tweets.map((tweet) => (
						<TweetCard key={tweet.id} tweet={tweet} timeLabel={formatTimeAgo(tweet.createdAt)} />
					))
				)}
			</TweetsContainerStyled>
		</>
	);
};
