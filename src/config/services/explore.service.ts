/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import type { ExploreTweetResult, ExploreUserResult } from "../../models/explore";
import apiService, { api } from "./api.service";

interface ExploreUserApiItem {
  id?: string;
  name?: string;
  username?: string;
  profileImage?: string;
  imgUrl?: string;
}

interface ExploreTweetApiItem {
  id?: string;
  user?: ExploreUserApiItem;
  content?: string;
  createdAt?: string;
  likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
  likesCount?: number;
  replies?: unknown[];
  repliesCount?: number;
  parentId?: string;
}

interface Payload<T> {
  data?: T[];
}

class ExploreService {
  private parseList<T>(rawData: unknown): T[] {
    if (Array.isArray(rawData)) return rawData as T[];

    const payload = rawData as Payload<T>;
    if (Array.isArray(payload?.data)) return payload.data;

    return [];
  }

  private normalizeText(value: string | undefined): string {
    return (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  private includesTerm(value: string | undefined, normalizedTerm: string): boolean {
    return this.normalizeText(value).includes(normalizedTerm);
  }

  private normalizeUser(user: ExploreUserApiItem): ExploreUserResult | null {
    if (!user?.id) return null;

    const profileImage = user.profileImage || user.imgUrl || "";

    return {
      id: user.id,
      name: user.name || "Unknown",
      username: user.username || "unknown",
      profileImage,
    };
  }

  private flattenTweets(tweets: ExploreTweetApiItem[]): ExploreTweetApiItem[] {
    const flattened: ExploreTweetApiItem[] = [];

    function walk(nodes: ExploreTweetApiItem[]) {
      nodes.forEach((node) => {
        flattened.push(node);

        if (Array.isArray(node.replies) && node.replies.length > 0) {
          walk(node.replies as ExploreTweetApiItem[]);
        }
      });
    }

    walk(tweets);

    return flattened;
  }

  private normalizeTweet(tweet: ExploreTweetApiItem): ExploreTweetResult | null {
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

  public async searchPeople(query: string, signal?: AbortSignal): Promise<ResponseDto> {
    try {
      const result = await api.get(`/users`, { signal });
      const allUsers = this.parseList<ExploreUserApiItem>(result.data);
      const normalizedQuery = this.normalizeText(query.trim());

      const matchedUsers = allUsers
        .map((user) => this.normalizeUser(user))
        .filter((user): user is ExploreUserResult => user !== null)
        .filter(
          (user) =>
            this.includesTerm(user.name, normalizedQuery) || this.includesTerm(user.username, normalizedQuery),
        );

      return {
        ok: true,
        data: matchedUsers,
      };
    } catch (error: any) {
      if (error?.name === "CanceledError") {
        return {
          ok: false,
          message: "Request canceled",
        };
      }

      return apiService.handleError(error);
    }
  }

  public async searchMostRecent(query: string, signal?: AbortSignal): Promise<ResponseDto> {
    try {
      const result = await api.get(`/tweets`, { signal });
      const allTweets = this.parseList<ExploreTweetApiItem>(result.data);
      const normalizedQuery = this.normalizeText(query.trim());

      const matchedTweets = this.flattenTweets(allTweets)
        .map((tweet) => this.normalizeTweet(tweet))
        .filter((tweet): tweet is ExploreTweetResult => tweet !== null)
        .filter((tweet) => this.includesTerm(tweet.content, normalizedQuery))
        .sort(
          (firstTweet, secondTweet) =>
            new Date(secondTweet.createdAt).getTime() - new Date(firstTweet.createdAt).getTime(),
        );

      return {
        ok: true,
        data: matchedTweets,
      };
    } catch (error: any) {
      if (error?.name === "CanceledError") {
        return {
          ok: false,
          message: "Request canceled",
        };
      }

      return apiService.handleError(error);
    }
  }
}

export default new ExploreService();
