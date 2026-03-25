import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserResponseDto, UpdateProfileDto, ChangePasswordDto } from "../types/user";

export const getProfile = async (): Promise<UserResponseDto> => {
    const res = await axiosClient.get<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.users.profile
    );
    return res.data.data;
};

export const updateProfile = async (data: UpdateProfileDto): Promise<UserResponseDto> => {
    const res = await axiosClient.put<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.users.updateProfile,
        data
    );
    return res.data.data;
};

export const changePassword = async (data: ChangePasswordDto): Promise<any> => {
    const res = await axiosClient.post<ApiResponse<any>>(
        "/users/change-password",
        data
    );
    return res.data.data;
};