import { useEffect, useMemo, useState } from "react";
import { ProfileHeader } from "../components/ProfileHeader/ProfileHeader";
import {
    ProfileInformations,
    type ProfileTab,
    type ProfileTweet,
} from "../components/ProfileInformations/ProfileInformations";
import { useAuth } from "../config/context/AuthContext";
import {
    isCreatedTweet,
    prependUniqueTweet,
    TWEET_CREATED_EVENT,
} from "../config/events/tweetCreatedEvent";
import tweetService from "../config/services/tweet.service";

interface ProfileUser {
    id: string;
    name: string;
    username: string;
    imgUrl?: string;
    profileImage?: string;
    followers?: string[];
    following?: string[];
    createdAt?: string;
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
    likes?: Array<{ id?: string; userId?: string } | string>;
    likesCount?: number;
    replies?: unknown[];
    repliesCount?: number;
    parentId?: string;
}

interface TweetsPayload {
    data: FeedTweetApi[];
}

function parseDate(value: unknown): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const parsedDate = new Date(String(value));
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatJoinedDate(value: unknown): string {
    const date = parseDate(value);
    if (!date) return "Not informed";

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function hasUserLike(
    likes: Array<{ id?: string; userId?: string } | string> | undefined,
    currentUserId: string,
): boolean {
    if (!likes?.length) return false;

    return likes.some((like) => {
        if (typeof like === "string") {
            return like === currentUserId;
        }

        return like.id === currentUserId || like.userId === currentUserId;
    });
}

export const ProfilePage = () => {
    const { user } = useAuth();
    const profileUser = user as ProfileUser | null;

    const [activeTab, setActiveTab] = useState<ProfileTab>("tweets");
    const [tweets, setTweets] = useState<ProfileTweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfileTweets() {
            if (!profileUser?.id) {
                setTweets([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await tweetService.listTweets();

                if (!response.ok) {
                    setError("Error loading tweets");
                    setTweets([]);
                    return;
                }

                const payload = (response.data ?? []) as FeedTweetApi[] | TweetsPayload;
                const allTweets = Array.isArray(payload) ? payload : payload.data;

                const userTweets: ProfileTweet[] = allTweets
                    .filter((tweet) => tweet?.user?.id === profileUser.id)
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

                userTweets.sort(
                    (firstTweet, secondTweet) =>
                        new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
                );

                setTweets(userTweets);
            } catch {
                setError("Error loading tweets");
                setTweets([]);
            } finally {
                setLoading(false);
            }
        }

        void loadProfileTweets();
    }, [profileUser?.id]);

    useEffect(() => {
        function handleTweetCreated(event: Event) {
            const customEvent = event as CustomEvent<unknown>;
            if (!isCreatedTweet(customEvent.detail) || !profileUser?.id) {
                return;
            }

            const createdTweet: ProfileTweet = customEvent.detail;

            if (createdTweet.author.id !== profileUser.id) {
                return;
            }

            setTweets((previousTweets) => prependUniqueTweet(previousTweets, createdTweet));
        }

        window.addEventListener(TWEET_CREATED_EVENT, handleTweetCreated);

        return () => {
            window.removeEventListener(TWEET_CREATED_EVENT, handleTweetCreated);
        };
    }, [profileUser?.id]);

    const visibleTweets = useMemo(() => {
        if (!profileUser?.id) return [];

        if (activeTab === "tweets") {
            return tweets.filter((tweet) => !tweet.parentId);
        }

        if (activeTab === "replies") {
            return tweets.filter((tweet) => !!tweet.parentId);
        }

        return tweets.filter((tweet) => hasUserLike(tweet.likes, profileUser.id));
    }, [activeTab, tweets, profileUser?.id]);

    const joinedDateValue = profileUser?.createdAt ?? tweets[tweets.length - 1]?.createdAt;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <ProfileHeader
                name={profileUser?.name ?? "Usuário"}
                username={profileUser?.username ?? "username"}
                profileImage={profileUser?.imgUrl || profileUser?.profileImage || ""}
                joinedAt={formatJoinedDate(joinedDateValue)}
                followingCount={profileUser?.following?.length ?? 0}
                followersCount={profileUser?.followers?.length ?? 0}
            />

            <ProfileInformations
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tweets={visibleTweets}
            />
        </section>
    );
};