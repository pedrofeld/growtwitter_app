/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, {api} from "./api.service";

class LikeService {
    public async likeTweet(
        userId: string, 
        tweetId: string
    ): Promise<ResponseDto> {
        try {
            const result = await api.post(`/like/${userId}/${tweetId}`);
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async unlikeTweet(likeId: string): Promise<ResponseDto> {
        try {
            const result = await api.delete(`/like/${likeId}`);
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }
}

export default new LikeService();