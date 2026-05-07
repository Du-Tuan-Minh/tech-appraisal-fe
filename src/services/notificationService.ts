import axiosClient from "@/services/axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import type { UserNotificationResponseDto } from "@/types/notification";

export const notificationService = {
    getMyNotifications: async (): Promise<UserNotificationResponseDto[]> => {
        const response = await axiosClient.get<
            ApiResponse<UserNotificationResponseDto[]>
        >(API_ENDPOINTS.notifications.getAll);

        return response.data.data;
    },

    markAsRead: async (id: string): Promise<boolean> => {
        const response = await axiosClient.patch<ApiResponse<boolean>>(
            API_ENDPOINTS.notifications.markRead(id)
        );

        return response.data.data;
    },

    deleteNotification: async (id: string): Promise<boolean> => {
        const response = await axiosClient.delete<ApiResponse<boolean>>(
            API_ENDPOINTS.notifications.delete(id)
        );

        return response.data.data;
    },
};