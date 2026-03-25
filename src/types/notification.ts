import type { NotificationType } from "@/constants/enum/NotificationType";

export interface UserNotificationResponseDto {
    id: string;
    notificationId: string;
    title: string;
    content: string;
    type: NotificationType;
    dataJson?: string | null;
    senderName?: string | null;
    isRead: boolean;
    readAt?: string | null;
    createdAt: string;
}

export interface NotificationCreateDto {
    title: string;
    content: string;
    type: NotificationType;
    dataJson?: string | null;
    senderId?: string | null;
    targetUserIds: string[];
}