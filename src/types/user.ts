import { UserRole } from "@/constants/enum/UserRole";
import type { pagination } from "@/types/pagination";

export interface UserResponseDto {
    id: string;
    employeeCode: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    firstName?: string;
    lastName?: string;
    departmentName?: string;
}

export interface UserDetailResponseDto {
    id: string;
    employeeCode: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    departmentId?: string;
    departmentName?: string;
}

export interface UserCreateDto {
    employeeCode: string;
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
    employeeCode: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface UserFilterDto extends pagination {
    departmentId?: string | null;
    role?: UserRole | null;
    isActive?: boolean | null;
    searchTerm?: string | null;
}