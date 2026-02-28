/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, { api } from "./api.service";

class TweetService {
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
}

export default new TweetService();