import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
    isTweetLikeChangedDetail,
    TWEET_LIKE_CHANGED_EVENT,
} from "../config/events/tweetLikeChangedEvent";
import followService from "../config/services/follow.service";
import userService from "../config/services/user.service";
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

interface FollowRelation {
    id: string;
    followerId: string;
    followingId: string;
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

interface FeedTweetApiWithReplies extends FeedTweetApi {
    replies?: FeedTweetApiWithReplies[];
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
    likes: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string> | undefined,
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

function dedupeTweetsById(tweets: ProfileTweet[]): ProfileTweet[] {
    const mapById = new Map<string, ProfileTweet>();

    tweets.forEach((tweet) => {
        mapById.set(tweet.id, tweet);
    });

    return Array.from(mapById.values());
}

function flattenTweetsWithReplies(tweets: FeedTweetApiWithReplies[]): FeedTweetApiWithReplies[] {
    const flattenedTweets: FeedTweetApiWithReplies[] = [];

    function walk(nodes: FeedTweetApiWithReplies[]) {
        nodes.forEach((node) => {
            flattenedTweets.push(node);

            if (Array.isArray(node.replies) && node.replies.length > 0) {
                walk(node.replies);
            }
        });
    }

    walk(tweets);

    return flattenedTweets;
}

function normalizeFollowRelations(value: unknown): FollowRelation[] {
    const rawRelations = Array.isArray(value) ? value : (value as { data?: unknown })?.data;

    if (!Array.isArray(rawRelations)) {
        return [];
    }

    return rawRelations.filter((relation): relation is FollowRelation => {
        if (!relation || typeof relation !== "object") {
            return false;
        }

        const candidate = relation as Partial<FollowRelation>;

        return typeof candidate.id === "string"
            && typeof candidate.followerId === "string"
            && typeof candidate.followingId === "string";
    });
}

export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { username } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowActionLoading, setIsFollowActionLoading] = useState(false);
    const [followActionError, setFollowActionError] = useState<string | null>(null);
    const [followRelations, setFollowRelations] = useState<FollowRelation[]>([]);

    const [activeTab, setActiveTab] = useState<ProfileTab>("tweets");
    const [tweets, setTweets] = useState<ProfileTweet[]>([]);
    const [likedTweets, setLikedTweets] = useState<ProfileTweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileRefreshToken, setProfileRefreshToken] = useState(0);

    const authenticatedUser = user as ProfileUser | null;
    const isOwnProfile = profileUser?.id
        ? profileUser.id === authenticatedUser?.id
        : !username;
    const currentUserId = authenticatedUser?.id;

    useEffect(() => {
        async function loadProfileTweets() {
            const profileIdentifier = username?.trim();
            let targetProfileId = authenticatedUser?.id;

            if (!targetProfileId && !profileIdentifier) {
                setProfileUser(null);
                setFollowersCount(0);
                setIsFollowing(false);
                setFollowActionError(null);
                setFollowRelations([]);
                setTweets([]);
                setLikedTweets([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setFollowActionError(null);

            try {
                const followsResponse = await followService.listFollows();
                const allFollowRelations = followsResponse.ok ? normalizeFollowRelations(followsResponse.data) : [];
                setFollowRelations(allFollowRelations);

                if (profileIdentifier) {
                    const usersResponse = await userService.listUsers();

                    if (!usersResponse.ok) {
                        setError("Error loading profile");
                        setProfileUser(null);
                        setTweets([]);
                        setLikedTweets([]);
                        return;
                    }

                    const allUsers = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data?.data ?? [];
                    const normalizedIdentifier = profileIdentifier.toLowerCase();
                    const usersList = allUsers as ProfileUser[];

                    const matchedUser = usersList.find(
                        (candidate) => candidate.username?.toLowerCase() === normalizedIdentifier,
                    ) ?? usersList.find((candidate) => candidate.id === profileIdentifier) ?? null;

                    if (!matchedUser) {
                        setError("Profile not found");
                        setProfileUser(null);
                        setFollowersCount(0);
                        setIsFollowing(false);
                        setFollowActionError(null);
                        setFollowRelations(allFollowRelations);
                        setTweets([]);
                        setLikedTweets([]);
                        return;
                    }

                    // Backward compatibility for legacy links that still point to /profile/:id.
                    if (matchedUser.id === profileIdentifier && matchedUser.username) {
                        navigate(`/profile/${matchedUser.username}`, { replace: true });
                    }

                    targetProfileId = matchedUser.id;

                    setProfileUser(matchedUser);
                    setFollowersCount(
                        allFollowRelations.filter((relation) => relation.followingId === matchedUser.id).length,
                    );
                    setIsFollowing(
                        Boolean(currentUserId && allFollowRelations.some((relation) => relation.followerId === currentUserId && relation.followingId === matchedUser.id)),
                    );
                } else {
                    setProfileUser(authenticatedUser);
                    setFollowersCount(
                        allFollowRelations.filter((relation) => relation.followingId === authenticatedUser?.id).length,
                    );
                    setIsFollowing(false);
                }

                if (!targetProfileId) {
                    setError("Profile not found");
                    setTweets([]);
                    setLikedTweets([]);
                    return;
                }

                const resolvedProfileId = targetProfileId;

                const response = await tweetService.listTweets();

                if (!response.ok) {
                    setError("Error loading tweets");
                    setTweets([]);
                    setLikedTweets([]);
                    return;
                }

                const payload = (response.data ?? []) as FeedTweetApiWithReplies[] | TweetsPayload;
                const allTweets = (Array.isArray(payload) ? payload : payload.data) as FeedTweetApiWithReplies[];
                const flattenedTweets = flattenTweetsWithReplies(allTweets);

                const normalizedTweets = flattenedTweets
                    .map((tweet) => {
                        if (!tweet?.id || !tweet?.user?.id) {
                            return null;
                        }

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
                        } as ProfileTweet;
                    })
                    .filter((tweet): tweet is ProfileTweet => tweet !== null);

                const userTweets = dedupeTweetsById(
                    normalizedTweets.filter((tweet) => tweet.author.id === resolvedProfileId),
                );
                const userLikedTweets = normalizedTweets.filter((tweet) => hasUserLike(tweet.likes, resolvedProfileId));

                userTweets.sort(
                    (firstTweet, secondTweet) =>
                        new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
                );

                const sortedLikedTweets = dedupeTweetsById(userLikedTweets).sort(
                    (firstTweet, secondTweet) =>
                        new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
                );

                setTweets(userTweets);
                setLikedTweets(sortedLikedTweets);
            } catch {
                setError("Error loading tweets");
                setFollowersCount(0);
                setIsFollowing(false);
                setFollowActionError(null);
                setFollowRelations([]);
                setTweets([]);
                setLikedTweets([]);
            } finally {
                setLoading(false);
            }
        }

        void loadProfileTweets();
    }, [authenticatedUser, currentUserId, navigate, profileRefreshToken, username]);

    useEffect(() => {
        function handleTweetLikeChanged(event: Event) {
            const customEvent = event as CustomEvent<unknown>;

            if (!isTweetLikeChangedDetail(customEvent.detail)) {
                return;
            }

            setProfileRefreshToken((currentToken) => currentToken + 1);
        }

        window.addEventListener(TWEET_LIKE_CHANGED_EVENT, handleTweetLikeChanged);

        return () => {
            window.removeEventListener(TWEET_LIKE_CHANGED_EVENT, handleTweetLikeChanged);
        };
    }, []);

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

    const handleFollowToggle = async () => {
        if (!profileUser?.id || !currentUserId || isOwnProfile || isFollowActionLoading) {
            return;
        }

        setIsFollowActionLoading(true);
        setFollowActionError(null);

        try {
            const response = isFollowing
                ? await followService.unfollowUser(currentUserId, profileUser.id)
                : await followService.followUser(currentUserId, profileUser.id);

            if (!response.ok) {
                setFollowActionError(isFollowing ? "Error unfollowing user" : "Error following user");
                return;
            }

            setIsFollowing((current) => !current);
            setFollowersCount((current) => (isFollowing ? Math.max(0, current - 1) : current + 1));
            updateUser((currentUser) => {
                if (!currentUser) {
                    return currentUser;
                }

                const currentFollowing = currentUser.following ?? [];
                const currentFollowers = currentUser.followers ?? [];

                const nextFollowing = isFollowing
                    ? currentFollowing.filter((followedUserId) => followedUserId !== profileUser.id)
                    : currentFollowing.includes(profileUser.id)
                        ? currentFollowing
                        : [...currentFollowing, profileUser.id];

                const nextFollowers = isFollowing
                    ? currentFollowers
                    : currentFollowers;

                return {
                    ...currentUser,
                    following: nextFollowing,
                    followers: nextFollowers,
                };
            });
            if (profileUser?.id) {
                setFollowRelations((currentRelations) => {
                    const nextRelations = isFollowing
                        ? currentRelations.filter((relation) => !(relation.followerId === currentUserId && relation.followingId === profileUser.id))
                        : currentRelations.some((relation) => relation.followerId === currentUserId && relation.followingId === profileUser.id)
                            ? currentRelations
                            : [...currentRelations, {
                                id: `${currentUserId}-${profileUser.id}`,
                                followerId: currentUserId,
                                followingId: profileUser.id,
                            }];

                    return nextRelations;
                });

                setProfileUser((currentProfile) => {
                    if (!currentProfile) {
                        return currentProfile;
                    }

                    const currentFollowers = currentProfile.followers ?? [];
                    const updatedFollowers = isFollowing
                        ? currentFollowers.filter((followerId) => followerId !== currentUserId)
                        : currentFollowers.includes(currentUserId)
                            ? currentFollowers
                            : [...currentFollowers, currentUserId];

                    return {
                        ...currentProfile,
                        followers: updatedFollowers,
                    };
                });
            }
        } catch {
            setFollowActionError(isFollowing ? "Error unfollowing user" : "Error following user");
        } finally {
            setIsFollowActionLoading(false);
        }
    };

    const visibleTweets = useMemo(() => {
        if (!profileUser?.id) return [];

        if (activeTab === "tweets") {
            return tweets.filter((tweet) => !tweet.parentId);
        }

        if (activeTab === "replies") {
            return tweets.filter((tweet) => !!tweet.parentId);
        }

        return likedTweets;
    }, [activeTab, likedTweets, tweets]);

    const joinedDateValue = profileUser?.createdAt ?? tweets[tweets.length - 1]?.createdAt;
    const profileFollowingCount = followRelations.filter((relation) => relation.followerId === profileUser?.id).length;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <ProfileHeader
                name={profileUser?.name ?? "Usuário"}
                username={profileUser?.username ?? "username"}
                profileImage={profileUser?.imgUrl || profileUser?.profileImage || ""}
                joinedAt={formatJoinedDate(joinedDateValue)}
                followingCount={profileFollowingCount}
                followersCount={followersCount}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowActionLoading={isFollowActionLoading}
                onFollowToggle={handleFollowToggle}
                actionMessage={followActionError}
            />

            <ProfileInformations
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tweets={visibleTweets}
            />
        </section>
    );
};