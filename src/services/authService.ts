import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type { LoginRequest, LoginResponse, UserCreateDto } from "../types/user";

export const login = async (data: LoginRequest) => {
    const res = await axiosClient.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        data
    );

    return res.data;
};

export const register = async (data: UserCreateDto) => {
    const res = await axiosClient.post(
        API_ENDPOINTS.auth.register,
        data
    );
    return res.data;
};

export const logout = async () => {
    await axiosClient.post(API_ENDPOINTS.auth.logout);
};