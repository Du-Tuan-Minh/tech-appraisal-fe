import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { UserResponseDto, UpdateProfileDto, ChangePasswordDto } from "../types/user";

export const getProfile = async () => {
    const res = await axiosClient.get<UserResponseDto>(
        API_ENDPOINTS.users.profile
    );
    return res.data;
};

export const updateProfile = async (data: UpdateProfileDto) => {
    const res = await axiosClient.put<UserResponseDto>(
        API_ENDPOINTS.users.updateProfile,
        data
    );
    return res.data;
};

export const changePassword = async (data: ChangePasswordDto) => {
    const res = await axiosClient.post(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        data
    );
    return res.data;
};