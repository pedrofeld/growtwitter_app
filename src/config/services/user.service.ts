/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, { api } from "./api.service";

class UserService {
    public async login (
        username: string,
        password: string
    ): Promise<ResponseDto> {
        try {
            const result = await api.post('/auth/login', {
                username,
                password,
            });

            return {
                ok: true,
                ...result.data,
            }
        } catch (error: any) {
            return apiService.handleError(error);
        }
    }
}

export default new UserService();