/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, {api} from "./api.service";

class FollowService {
    public async followUser(
        followerId: string, 
        followingId: string
    ): Promise<ResponseDto> {
        try {
            const result = await api.post("/follow", { followerId, followingId });
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }

    public async unfollowUser(
        followerId: string,
        followingId: string
    ): Promise<ResponseDto> {
        try {
            const result = await api.delete("/follow", { data: { followerId, followingId } });
            return {
                ok: true,
                data: result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }
}

export default new FollowService();