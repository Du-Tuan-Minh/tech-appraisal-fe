import { UserRole } from "@/constants/enum/UserRole";

export interface UserResponseDto {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phoneNumber?: string;
}

export interface UserCreateDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserUpdateAccountDto {
    isActive?: boolean;
    role?: UserRole;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}