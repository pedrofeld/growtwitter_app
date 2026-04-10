import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useAuth } from "../../config/context/AuthContext";
import {
	emitTweetCreatedEvent,
	type CreatedTweet,
} from "../../config/events/tweetCreatedEvent";
import tweetService from "../../config/services/tweet.service";
import {
	ModalBackdropStyled,
	ModalCardStyled,
	ModalCloseButtonStyled,
	ModalErrorTextStyled,
	ModalFooterStyled,
	ModalHeaderStyled,
	ModalSubmitButtonStyled,
	ModalTextareaStyled,
	ModalTitleStyled,
} from "./NewTweet.styles";

interface NewTweetProps {
	isOpen: boolean;
	onClose: () => void;
	themeMode: "light" | "dark";
}

export const NewTweet = ({ isOpen, onClose, themeMode }: NewTweetProps) => {
	const { user } = useAuth();
	const [tweetContent, setTweetContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	function normalizeCreatedTweet(data: unknown): CreatedTweet | null {
		if (!data || typeof data !== "object") {
			return null;
		}

		const rawData = data as {
			id?: string;
			content?: string;
			createdAt?: string;
			likesCount?: number;
			repliesCount?: number;
			parentId?: string | null;
			likes?: Array<{ id?: string; userId?: string } | string>;
			replies?: unknown[];
			user?: {
				id?: string;
				name?: string;
				username?: string;
				profileImage?: string;
				imgUrl?: string;
			};
			data?: unknown;
			tweet?: unknown;
		};

		if (!rawData.id || !rawData.content) {
			return normalizeCreatedTweet(rawData.data ?? rawData.tweet);
		}

		const authorId = rawData.user?.id ?? user?.id;
		const authorName = rawData.user?.name ?? user?.name;
		const authorUsername = rawData.user?.username ?? user?.username;
		const profileImage = rawData.user?.profileImage ?? rawData.user?.imgUrl ?? user?.imgUrl ?? "";

		if (!authorId || !authorName || !authorUsername) {
			return null;
		}

		return {
			id: rawData.id,
			author: {
				id: authorId,
				name: authorName,
				username: authorUsername,
				profileImage,
				imgUrl: profileImage,
			},
			content: rawData.content,
			createdAt: rawData.createdAt ?? new Date().toISOString(),
			likes: rawData.likes,
			likesCount: rawData.likesCount ?? rawData.likes?.length ?? 0,
			repliesCount: rawData.repliesCount ?? rawData.replies?.length ?? 0,
			parentId: rawData.parentId ?? undefined,
		};
	}

	if (!isOpen) {
		return null;
	}

	const handleSubmit = async () => {
		if (!user?.id) {
			setSubmitError("You need to be logged in to tweet.");
			return;
		}

		const content = tweetContent.trim();
		if (!content || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const response = await tweetService.sendTweet(user.id, content);

			if (!response.ok) {
				throw new Error(response.message || "Error creating tweet");
			}

			const createdTweet = normalizeCreatedTweet(response.data ?? response);
			if (!createdTweet) {
				throw new Error("Tweet created but response format is invalid");
			}

			emitTweetCreatedEvent(createdTweet);
			setTweetContent("");
			onClose();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Error creating tweet";
			setSubmitError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ModalBackdropStyled onClick={onClose}>
			<ModalCardStyled $themeMode={themeMode} onClick={(event) => event.stopPropagation()}>
				<ModalHeaderStyled>
					<ModalTitleStyled>New tweet</ModalTitleStyled>
					<ModalCloseButtonStyled type="button" onClick={onClose} aria-label="Close">
						<IoIosClose /> 
					</ModalCloseButtonStyled>
				</ModalHeaderStyled>

				<ModalTextareaStyled
					$themeMode={themeMode}
					placeholder="What's happening?"
					value={tweetContent}
					onChange={(event) => setTweetContent(event.target.value)}
					disabled={isSubmitting}
					maxLength={280}
				/>

				{submitError && <ModalErrorTextStyled>{submitError}</ModalErrorTextStyled>}

				<ModalFooterStyled>
					<ModalSubmitButtonStyled
						type="button"
						$themeMode={themeMode}
						onClick={handleSubmit}
						disabled={!tweetContent.trim() || !user?.id || isSubmitting}
					>
						{isSubmitting ? "Tweeting..." : "Tweetar"}
					</ModalSubmitButtonStyled>
				</ModalFooterStyled>
			</ModalCardStyled>
		</ModalBackdropStyled>
	);
};
