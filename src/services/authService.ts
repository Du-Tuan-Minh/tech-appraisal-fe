import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type { LoginRequest, LoginResponse } from "../types/user";

export const login = async (data: LoginRequest) => {
    const res = await axiosClient.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        data
    );

    return res.data;
};

export const logout = async () => {
    await axiosClient.post(API_ENDPOINTS.auth.logout);
};