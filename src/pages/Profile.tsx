import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
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
    type TweetLikeChangedDetail,
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

interface ProfileEditFormState {
    name: string;
    username: string;
    profileImage: string;
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

function applyLikeChangeToTweet(tweet: ProfileTweet, detail: TweetLikeChangedDetail): ProfileTweet {
    if (tweet.id !== detail.tweetId) {
        return tweet;
    }

    const currentCount = typeof tweet.likesCount === "number"
        ? tweet.likesCount
        : tweet.likes?.length ?? 0;
    const nextCount = detail.isLiked
        ? currentCount + 1
        : Math.max(currentCount - 1, 0);

    return {
        ...tweet,
        likesCount: nextCount,
    };
}

function applyLikeChangeToList(tweets: ProfileTweet[], detail: TweetLikeChangedDetail): ProfileTweet[] {
    return tweets.map((tweet) => applyLikeChangeToTweet(tweet, detail));
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

function isValidHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function normalizeProfileImageValue(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function resolveProfileAvatar(user: Partial<ProfileUser> | null | undefined): string {
    if (!user) return "";

    return normalizeProfileImageValue(user.profileImage) || normalizeProfileImageValue(user.imgUrl);
}

function syncAuthorAvatarForUser(tweets: ProfileTweet[], userId: string, avatarUrl: string): ProfileTweet[] {
    if (!avatarUrl) {
        return tweets;
    }

    let hasChanges = false;

    const nextTweets = tweets.map((tweet) => {
        if (tweet.author.id !== userId) {
            return tweet;
        }

        if (tweet.author.profileImage === avatarUrl && tweet.author.imgUrl === avatarUrl) {
            return tweet;
        }

        hasChanges = true;

        return {
            ...tweet,
            author: {
                ...tweet.author,
                profileImage: avatarUrl,
                imgUrl: avatarUrl,
            },
        };
    });

    return hasChanges ? nextTweets : tweets;
}

function getFriendlyProfileUpdateError(rawMessage: string | undefined): string {
    const normalizedMessage = rawMessage?.toLowerCase() ?? "";

    if (normalizedMessage.includes("username") && (normalizedMessage.includes("already") || normalizedMessage.includes("exist") || normalizedMessage.includes("taken"))) {
        return "This username is already in use. Please choose another one.";
    }

    if (normalizedMessage.includes("profileimage") || normalizedMessage.includes("url") || normalizedMessage.includes("invalid")) {
        return "Please provide a valid image URL (http or https).";
    }

    return rawMessage?.trim() || "Could not update profile. Please try again.";
}

function getUpdatedUserPayload(responseData: unknown): Partial<ProfileUser> | null {
    if (!responseData || typeof responseData !== "object") {
        return null;
    }

    const container = responseData as { data?: unknown; user?: unknown };

    const candidateSources = [container.data, container.user, responseData];

    for (const source of candidateSources) {
        if (!source || typeof source !== "object") {
            continue;
        }

        const candidate = source as Partial<ProfileUser>;

        if (typeof candidate.id === "string" || typeof candidate.username === "string" || typeof candidate.name === "string") {
            return candidate;
        }
    }

    return null;
}

const ProfileEditFormContainer = styled.form`
    margin: 16px;
    padding: 16px;
    border: 1px solid var(--app-border);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--app-surface);
    color: var(--app-text);
`;

const ProfileEditField = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--app-text);
`;

const ProfileEditInput = styled.input`
    border: 1px solid var(--app-input-border);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    background: var(--app-input-bg);
    color: var(--app-input-text);

    &::placeholder {
        color: var(--app-input-placeholder);
    }

    &:focus {
        outline: 2px solid var(--app-focus-ring);
        outline-offset: 0;
        border-color: var(--app-accent);
    }
`;

const ProfileEditActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const ProfileEditButton = styled.button<{ $variant: "primary" | "secondary" }>`
    border-radius: 999px;
    border: 1px solid ${({ $variant }) => ($variant === "primary" ? "var(--app-accent)" : "var(--app-button-secondary-border)")};
    background: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent)" : "var(--app-button-secondary-bg)")};
    color: ${({ $variant }) => ($variant === "primary" ? "var(--app-button-primary-text)" : "var(--app-button-secondary-text)")};
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
        background: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent-hover)" : "var(--app-button-secondary-hover-bg)")};
        border-color: ${({ $variant }) => ($variant === "primary" ? "var(--app-accent-hover)" : "var(--app-button-secondary-hover-border)")};
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }
`;

const ProfileEditMessage = styled.p<{ $type: "error" | "success" }>`
    margin: 0;
    font-size: 13px;
    line-height: 1.35;
    color: ${({ $type }) => ($type === "error" ? "var(--app-danger)" : "var(--app-success)")};
`;

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
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileEditError, setProfileEditError] = useState<string | null>(null);
    const [profileEditSuccess, setProfileEditSuccess] = useState<string | null>(null);
    const [profileEditForm, setProfileEditForm] = useState<ProfileEditFormState>({
        name: "",
        username: "",
        profileImage: "",
    });

    const authenticatedUser = user as ProfileUser | null;
    const isOwnProfile = profileUser?.id
        ? profileUser.id === authenticatedUser?.id
        : !username;
    const currentUserId = authenticatedUser?.id;

    useEffect(() => {
        async function loadProfileTweets() {
            const profileIdentifier = username?.trim();
            let targetProfileId = authenticatedUser?.id;
            let resolvedProfileAvatar = resolveProfileAvatar(authenticatedUser);

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
                    resolvedProfileAvatar = resolveProfileAvatar(matchedUser);

                    setProfileUser(matchedUser);
                    setFollowersCount(
                        allFollowRelations.filter((relation) => relation.followingId === matchedUser.id).length,
                    );
                    setIsFollowing(
                        Boolean(currentUserId && allFollowRelations.some((relation) => relation.followerId === currentUserId && relation.followingId === matchedUser.id)),
                    );
                } else {
                    const usersResponse = await userService.listUsers();
                    const allUsers = usersResponse.ok
                        ? (Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data?.data ?? [])
                        : [];
                    const usersList = allUsers as ProfileUser[];
                    const matchedAuthenticatedUser = usersList.find((candidate) => candidate.id === authenticatedUser?.id) ?? authenticatedUser;
                    resolvedProfileAvatar = resolveProfileAvatar(matchedAuthenticatedUser);

                    setProfileUser(matchedAuthenticatedUser ?? null);
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

                const fallbackAvatarFromTweets = normalizedTweets.find((tweet) => {
                    if (tweet.author.id !== resolvedProfileId) {
                        return false;
                    }

                    return Boolean(normalizeProfileImageValue(tweet.author.profileImage) || normalizeProfileImageValue(tweet.author.imgUrl));
                });

                const effectiveProfileAvatar = resolvedProfileAvatar
                    || normalizeProfileImageValue(fallbackAvatarFromTweets?.author.profileImage)
                    || normalizeProfileImageValue(fallbackAvatarFromTweets?.author.imgUrl);

                if (effectiveProfileAvatar) {
                    setProfileUser((currentProfileUser) => {
                        if (!currentProfileUser || currentProfileUser.id !== resolvedProfileId) {
                            return currentProfileUser;
                        }

                        const currentAvatar = resolveProfileAvatar(currentProfileUser);

                        if (currentAvatar) {
                            return currentProfileUser;
                        }

                        return {
                            ...currentProfileUser,
                            profileImage: effectiveProfileAvatar,
                            imgUrl: effectiveProfileAvatar,
                        };
                    });
                }

                const syncedNormalizedTweets = syncAuthorAvatarForUser(
                    normalizedTweets,
                    resolvedProfileId,
                    effectiveProfileAvatar,
                );

                const userTweets = dedupeTweetsById(
                    syncedNormalizedTweets.filter((tweet) => tweet.author.id === resolvedProfileId),
                );
                const userLikedTweets = syncedNormalizedTweets.filter((tweet) => hasUserLike(tweet.likes, resolvedProfileId));

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
    }, [authenticatedUser, currentUserId, navigate, username]);

    useEffect(() => {
        function handleTweetLikeChanged(event: Event) {
            const customEvent = event as CustomEvent<unknown>;

            if (!isTweetLikeChangedDetail(customEvent.detail)) {
                return;
            }

            const detail = customEvent.detail;

            setTweets((currentTweets) => applyLikeChangeToList(currentTweets, detail));

            setLikedTweets((currentLikedTweets) => {
                const nextLikedTweets = applyLikeChangeToList(currentLikedTweets, detail);

                if (!profileUser?.id || detail.userId !== profileUser.id) {
                    return nextLikedTweets;
                }

                if (!detail.isLiked) {
                    return nextLikedTweets.filter((tweet) => tweet.id !== detail.tweetId);
                }

                if (nextLikedTweets.some((tweet) => tweet.id === detail.tweetId)) {
                    return nextLikedTweets;
                }

                const sourceTweet = tweets.find((tweet) => tweet.id === detail.tweetId);

                if (!sourceTweet) {
                    return nextLikedTweets;
                }

                const sourceWithUpdatedLike = applyLikeChangeToTweet(sourceTweet, detail);

                return dedupeTweetsById([sourceWithUpdatedLike, ...nextLikedTweets]).sort(
                    (firstTweet, secondTweet) =>
                        new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
                );
            });
        }

        window.addEventListener(TWEET_LIKE_CHANGED_EVENT, handleTweetLikeChanged);

        return () => {
            window.removeEventListener(TWEET_LIKE_CHANGED_EVENT, handleTweetLikeChanged);
        };
    }, [profileUser?.id, tweets]);

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

    useEffect(() => {
        if (!profileUser || !isOwnProfile) {
            setProfileEditForm({ name: "", username: "", profileImage: "" });
            setIsEditingProfile(false);
            setProfileEditError(null);
            setProfileEditSuccess(null);
            return;
        }

        setProfileEditForm({
            name: profileUser.name ?? "",
            username: profileUser.username ?? "",
            profileImage: profileUser.profileImage ?? profileUser.imgUrl ?? "",
        });
    }, [isOwnProfile, profileUser]);

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

    const handleProfileFormFieldChange = (field: keyof ProfileEditFormState, value: string) => {
        setProfileEditForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));

        if (profileEditError) {
            setProfileEditError(null);
        }
        if (profileEditSuccess) {
            setProfileEditSuccess(null);
        }
    };

    const handleProfileEditToggle = () => {
        if (isUpdatingProfile || !isOwnProfile || !profileUser) {
            return;
        }

        setIsEditingProfile((currentState) => !currentState);
        setProfileEditError(null);
        setProfileEditSuccess(null);
        setProfileEditForm({
            name: profileUser.name ?? "",
            username: profileUser.username ?? "",
            profileImage: profileUser.profileImage ?? profileUser.imgUrl ?? "",
        });
    };

    const handleProfileEditCancel = () => {
        if (!profileUser) {
            return;
        }

        setIsEditingProfile(false);
        setProfileEditError(null);
        setProfileEditSuccess(null);
        setProfileEditForm({
            name: profileUser.name ?? "",
            username: profileUser.username ?? "",
            profileImage: profileUser.profileImage ?? profileUser.imgUrl ?? "",
        });
    };

    const handleProfileEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!profileUser || !isOwnProfile || isUpdatingProfile) {
            return;
        }

        const normalizedName = profileEditForm.name.trim();
        const normalizedUsername = profileEditForm.username.trim();
        const normalizedProfileImage = profileEditForm.profileImage.trim();

        if (!normalizedName || !normalizedUsername) {
            setProfileEditError("Name and username are required.");
            setProfileEditSuccess(null);
            return;
        }

        if (normalizedProfileImage && !isValidHttpUrl(normalizedProfileImage)) {
            setProfileEditError("Please provide a valid image URL (http or https).");
            setProfileEditSuccess(null);
            return;
        }

        setIsUpdatingProfile(true);
        setProfileEditError(null);
        setProfileEditSuccess(null);

        try {
            const response = await userService.updateProfile(
                profileUser.id,
                normalizedName,
                normalizedUsername,
                undefined,
                undefined,
                normalizedProfileImage,
            );

            if (!response.ok) {
                setProfileEditError(getFriendlyProfileUpdateError(response.message));
                return;
            }

            const updatedPayload = getUpdatedUserPayload(response.data);
            const nextProfileImage = normalizeProfileImageValue(updatedPayload?.profileImage)
                || normalizeProfileImageValue(updatedPayload?.imgUrl)
                || normalizedProfileImage;

            const nextProfileUser: ProfileUser = {
                ...profileUser,
                ...updatedPayload,
                name: updatedPayload?.name ?? normalizedName,
                username: updatedPayload?.username ?? normalizedUsername,
                profileImage: nextProfileImage,
                imgUrl: nextProfileImage,
            };

            setProfileUser(nextProfileUser);
            setTweets((currentTweets) => syncAuthorAvatarForUser(currentTweets, profileUser.id, nextProfileImage));
            setLikedTweets((currentTweets) => syncAuthorAvatarForUser(currentTweets, profileUser.id, nextProfileImage));
            setProfileEditSuccess("Profile updated successfully.");
            setIsEditingProfile(false);

            updateUser((currentUser) => {
                if (!currentUser || currentUser.id !== profileUser.id) {
                    return currentUser;
                }

                return {
                    ...currentUser,
                    name: nextProfileUser.name,
                    username: nextProfileUser.username,
                    imgUrl: nextProfileUser.imgUrl || nextProfileUser.profileImage || "",
                };
            });

            if (username && nextProfileUser.username && username.toLowerCase() !== nextProfileUser.username.toLowerCase()) {
                navigate(`/profile/${nextProfileUser.username}`, { replace: true });
            }
        } catch {
            setProfileEditError("Could not update profile. Please try again.");
        } finally {
            setIsUpdatingProfile(false);
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
    }, [activeTab, likedTweets, profileUser?.id, tweets]);

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
                onEditProfileToggle={handleProfileEditToggle}
                isEditingProfile={isEditingProfile}
                actionMessage={followActionError}
            />

            {isOwnProfile && isEditingProfile ? (
                <ProfileEditFormContainer onSubmit={handleProfileEditSubmit}>
                    <ProfileEditField>
                        Name
                        <ProfileEditInput
                            type="text"
                            value={profileEditForm.name}
                            onChange={(event) => handleProfileFormFieldChange("name", event.target.value)}
                            placeholder="Your name"
                            maxLength={80}
                            required
                        />
                    </ProfileEditField>

                    <ProfileEditField>
                        Username
                        <ProfileEditInput
                            type="text"
                            value={profileEditForm.username}
                            onChange={(event) => handleProfileFormFieldChange("username", event.target.value)}
                            placeholder="yourusername"
                            maxLength={30}
                            required
                        />
                    </ProfileEditField>

                    <ProfileEditField>
                        Profile image URL
                        <ProfileEditInput
                            type="url"
                            value={profileEditForm.profileImage}
                            onChange={(event) => handleProfileFormFieldChange("profileImage", event.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </ProfileEditField>

                    {profileEditError ? <ProfileEditMessage $type="error">{profileEditError}</ProfileEditMessage> : null}
                    {profileEditSuccess ? <ProfileEditMessage $type="success">{profileEditSuccess}</ProfileEditMessage> : null}

                    <ProfileEditActions>
                        <ProfileEditButton type="button" $variant="secondary" onClick={handleProfileEditCancel} disabled={isUpdatingProfile}>
                            Cancel
                        </ProfileEditButton>
                        <ProfileEditButton type="submit" $variant="primary" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? "Saving..." : "Save changes"}
                        </ProfileEditButton>
                    </ProfileEditActions>
                </ProfileEditFormContainer>
            ) : null}

            {isOwnProfile && !isEditingProfile && profileEditSuccess ? (
                <ProfileEditFormContainer as="div">
                    <ProfileEditMessage $type="success">{profileEditSuccess}</ProfileEditMessage>
                </ProfileEditFormContainer>
            ) : null}

            <ProfileInformations
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tweets={visibleTweets}
            />
        </section>
    );
};