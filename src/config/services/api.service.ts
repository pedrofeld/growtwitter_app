/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { ResponseDto } from "../dtos/response.dto";

function normalizeToken(rawToken: string | null): string | null {
    if (!rawToken) return null;
    const trimmedValue = rawToken.trim().replace(/^"|"$/g, "");
    const normalizedToken = trimmedValue.replace(/^Bearer\s+/i, "").trim();

    return normalizedToken || null;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = normalizeToken(localStorage.getItem("authToken"));

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

class ApiService {
    public handleError(error: any): ResponseDto {

        const result = {
            ok: false,
        }

        if (error.response?.data) {
            const responseData = error.response.data;
            const responseMessage =
                responseData.message ||
                responseData.error ||
                (Array.isArray(responseData.errors) ? responseData.errors.join(", ") : undefined);

            return {
                ...result,
                message:
                    responseMessage ||
                    `Request failed with status ${error.response.status}`,
            }
        }

        return {
            ...result,
            message: error.toString(),
        }
    }
}

export default new ApiService();