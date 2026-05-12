import type { NotificationType } from "@/constants/enum/NotificationType";
import type { pagination } from "./pagination";

export interface UserNotificationResponseDto {
    id: string;
    notificationId: string;
    title: string;
    content: string;
    type: NotificationType;
    metadata?: Record<string, any> | null;
    senderId?: string | null;
    senderName?: string | null;
    senderAvatar?: string | null;
    isRead: boolean;
    readAt?: string | null;
    createdAt: string;
}

export interface NotificationCreateDto {
    title: string;
    content: string;
    type: NotificationType;
    metadata?: Record<string, any> | null;
    senderId?: string | null;
    targetUserIds: string[];
}

export interface NotificationQueryDto extends pagination {
    search?: string;
    type?: NotificationType;
    isRead?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}