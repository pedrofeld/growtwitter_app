/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { ResponseDto } from "../dtos/response.dto";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

class ApiService {
    public handleError(error: any): ResponseDto {

        const result = {
            ok: false,
        }

        if (error.response?.data) {
            return {
                ...result,
                message: error.response.data.message,
            }
        }

        return {
            ...result,
            message: error.toString(),
        }
    }
}

export default new ApiService();