/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type { ResponseDto } from "../dtos/response.dto";
import { clearAuthSession, hasPersistedAuthSession, readAuthToken } from "./authSession.service";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
        const token = readAuthToken({ clearInvalid: true });

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if ((status === 401 || status === 403) && hasPersistedAuthSession()) {
            clearAuthSession();

            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    },
);

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