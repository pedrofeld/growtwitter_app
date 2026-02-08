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
        } catch (error) {
            return apiService.handleError(error);
        }
    }

    public async sendTweet(
        idUser: string,
        content: string
    ): Promise<ResponseDto> {
        try {
            const result = await api.post(`/tweets`, {
                idUser,
                content,
            });
            return {
                ok: true,
                ...result.data,
            }
        } catch (error) {
            return apiService.handleError(error);
        }
    }
}

export default new TweetService();