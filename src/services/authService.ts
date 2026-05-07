import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { LoginRequest, LoginResponse, UserCreateDto, UserResponseDto } from "../types/user";
import type { ApiResponse } from "@/types/apiResponse";

export const login = async (data: LoginRequest) => {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.auth.login,
        data
    );

    return res.data.data;
};

export const register = async (data: UserCreateDto) => {
    const res = await axiosClient.post<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.auth.register,
        data
    );
    return res.data.data;
};

export const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    await axiosClient.post(API_ENDPOINTS.auth.logout, refreshToken ? { refreshToken } : {});
};