/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, { api } from "./api.service";

interface TweetApiUser {
    id?: string;
    name?: string;
    username?: string;
    profileImage?: string;
    imgUrl?: string;
}

interface TweetApiItem {
    id?: string;
    user?: TweetApiUser;
    content?: string;
    createdAt?: string;
    likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
    likesCount?: number;
    replies?: unknown[];
    repliesCount?: number;
    parentId?: string;
}

interface TweetsPayload {
    data?: TweetApiItem[];
}

export interface ThreadTweet {
    id: string;
    author: {
        id: string;
        name: string;
        username: string;
        profileImage: string;
        imgUrl: string;
    };
    content: string;
    createdAt: string;
    likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
    likesCount: number;
    repliesCount: number;
    parentId?: string;
}

class TweetService {
    private parseTweetsList(data: unknown): TweetApiItem[] {
        if (Array.isArray(data)) return data as TweetApiItem[];

        const payload = data as TweetsPayload;
        if (Array.isArray(payload?.data)) return payload.data;

        return [];
    }

    private normalizeTweetItem(tweet: TweetApiItem): ThreadTweet | null {
        if (!tweet?.id || !tweet?.user?.id) return null;

        const profileImage = tweet.user.profileImage || tweet.user.imgUrl || "";

        return {
            id: tweet.id,
            author: {
                id: tweet.user.id,
                name: tweet.user.name || "Unknown",
                username: tweet.user.username || "unknown",
                profileImage,
                imgUrl: profileImage,
            },
            content: tweet.content || "",
            createdAt: tweet.createdAt || new Date().toISOString(),
            likes: tweet.likes,
            likesCount: tweet.likesCount ?? (tweet.likes?.length ?? 0),
            repliesCount: tweet.repliesCount ?? (tweet.replies?.length ?? 0),
            parentId: tweet.parentId,
        };
    }

    private sortNewestFirst(tweets: ThreadTweet[]): ThreadTweet[] {
        return [...tweets].sort(
            (firstTweet, secondTweet) =>
                new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
        );
    }

    private uniqueById(tweets: ThreadTweet[]): ThreadTweet[] {
        const mapById = new Map<string, ThreadTweet>();

        tweets.forEach((tweet) => {
            mapById.set(tweet.id, tweet);
        });

        return Array.from(mapById.values());
    }

    private normalizeNestedReplies(replies: unknown[] | undefined): ThreadTweet[] {
        if (!Array.isArray(replies)) return [];

        return replies
            .map((reply) => this.normalizeTweetItem(reply as TweetApiItem))
            .filter((reply): reply is ThreadTweet => reply !== null);
    }

    private flattenRawTweets(tweets: TweetApiItem[]): TweetApiItem[] {
        const flattened: TweetApiItem[] = [];

        function walk(nodes: TweetApiItem[]) {
            nodes.forEach((node) => {
                flattened.push(node);

                if (Array.isArray(node.replies) && node.replies.length > 0) {
                    walk(node.replies as TweetApiItem[]);
                }
            });
        }

        walk(tweets);

        return flattened;
    }

    private findRawTweetById(tweets: TweetApiItem[], tweetId: string): TweetApiItem | undefined {
        for (const tweet of tweets) {
            if (tweet.id === tweetId) return tweet;

            if (Array.isArray(tweet.replies) && tweet.replies.length > 0) {
                const foundInReplies = this.findRawTweetById(tweet.replies as TweetApiItem[], tweetId);
                if (foundInReplies) return foundInReplies;
            }
        }

        return undefined;
    }

    public async listTweets(): Promise<ResponseDto> {
        try {
            const result = await api.get(`/tweets`);
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async sendTweet(
        userId: string,
        content: string,
        parentId?: string,
    ): Promise<ResponseDto> {
        try {
            const result = await api.post(`/tweet`, {
                userId,
                content,
                parentId,
            });
            return {
                ok: true,
                ...result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async updateTweet(
        tweetId: string,
        content: string,
    ): Promise<ResponseDto> {
        try {
            const result = await api.put(`/tweet/${tweetId}`, {
                content,
            });
            return {
                ok: true,
                ...result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async deleteTweet(tweetId: string): Promise<ResponseDto> {
        try {
            const result = await api.delete(`/tweet/${tweetId}`);
            return {
                ok: true,
                ...result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async getFeed(userId: string): Promise<ResponseDto> {
        try {
            const result = await api.get(`/feed`, {
                params: {
                    userId,
                },
            });
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async getTweetThreadDetail(tweetId: string): Promise<ResponseDto> {
        try {
            const listResponse = await this.listTweets();

            if (!listResponse.ok) {
                return listResponse;
            }

            const rawTweetList = this.parseTweetsList(listResponse.data);
            const flattenedRawTweetList = this.flattenRawTweets(rawTweetList);

            const tweetList = flattenedRawTweetList
                .map((tweet) => this.normalizeTweetItem(tweet))
                .filter((tweet): tweet is ThreadTweet => tweet !== null);

            const focusedTweet = tweetList.find((tweet) => tweet.id === tweetId);
            const focusedRawTweet = this.findRawTweetById(rawTweetList, tweetId);

            if (!focusedTweet) {
                return {
                    ok: false,
                    message: "Tweet not found",
                };
            }

            const repliesFromFlatList = tweetList.filter((tweet) => tweet.parentId === focusedTweet.id);
            const repliesFromNested = this.normalizeNestedReplies(focusedRawTweet?.replies);

            const replies = this.sortNewestFirst(
                this.uniqueById([...repliesFromFlatList, ...repliesFromNested]),
            );

            return {
                ok: true,
                data: {
                    tweet: focusedTweet,
                    replies,
                },
            };
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }
}

export default new TweetService();