import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "../config/apiConfig";
import type {
    UserResponseDto,
    UpdateProfileDto,
    ChangePasswordDto
} from "../types/user";

/**
 * Lấy thông tin hồ sơ cá nhân của người dùng hiện tại
 */
export const getProfile = async () => {
    const res = await axiosClient.get<UserResponseDto>(
        API_ENDPOINTS.users.profile
    );
    return res.data;
};

/**
 * Cập nhật thông tin cơ bản (Họ tên, SĐT, Avatar)
 */
export const updateProfile = async (data: UpdateProfileDto) => {
    const res = await axiosClient.put<UserResponseDto>(
        API_ENDPOINTS.users.updateProfile,
        data
    );
    return res.data;
};

/**
 * Đổi mật khẩu tài khoản
 * Lưu ý: Endpoint này thường nằm trong cụm users hoặc auth tùy thiết kế Backend
 * Ở đây tôi giả định bạn có endpoint đổi mật khẩu tại users
 */
export const changePassword = async (data: ChangePasswordDto) => {
    // Nếu apiConfig chưa có, bạn nên bổ sung vào: users.changePassword
    // Ở đây tôi dùng tạm đường dẫn mẫu dựa trên cấu trúc của bạn
    const res = await axiosClient.post(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        data
    );
    return res.data;
};