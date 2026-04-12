/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseDto } from "../dtos/response.dto";
import apiService, { api } from "./api.service";

class UserService {
  public async listUsers(): Promise<ResponseDto> {
    try {
      const result = await api.get(`/users`);
      return {
        ok: true,
        data: result.data,
      };
    } catch (error: any) {
      return apiService.handleError(error);
    }
  }

  public async register(
    name: string,
    username: string,
    email: string,
    password: string,
    profileImage?: string,
  ): Promise<ResponseDto> {
    try {
      const result = await api.post(`/user`, {
        name,
        username,
        email,
        password,
        profileImage,
      });
      return {
        ok: true,
        ...result.data,
      };
    } catch (error: any) {
      return apiService.handleError(error);
    }
  }

  public async updateProfile(
    id: string,
    name?: string,
    username?: string,
    email?: string,
    password?: string,
    profileImage?: string,
  ): Promise<ResponseDto> {
    try {
      const result = await api.put(`/user/${id}`, {
        name,
        username,
        email,
        password,
        profileImage,
      });
      return {
        ok: true,
        ...result.data,
      };
    } catch (error: any) {
      return apiService.handleError(error);
    }
  }

  public async login(login: string, password: string): Promise<ResponseDto> {
    try {
      const result = await api.post("/login", {
        login,
        password,
      });

      return {
        ok: true,
        ...result.data,
      };
    } catch (error: any) {
      return apiService.handleError(error);
    }
  }

  public async deleteUser(id: string): Promise<ResponseDto> {
    try {
      const result = await api.delete(`/user/${id}`);
      return {
        ok: true,
        ...result.data,
      };
    } catch (error: any) {
      return apiService.handleError(error);
    }
  }
}

export default new UserService();
