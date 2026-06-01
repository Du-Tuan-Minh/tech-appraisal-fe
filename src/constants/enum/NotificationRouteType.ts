export const NotificationRouteType = {
    DocumentDetail: 0,
    RejectedDocument: 1,
    StaffReview: 2,
    AssignmentDetail: 3,
    FeedbackDetail: 4,
    ManagerAssignment: 5,
    DirectorAssignment: 6,
    PendingAppraisal: 7,
    IssuedDocument: 8,
    FinalApproval: 9
} as const

export type NotificationRouteType =
    (typeof NotificationRouteType)[keyof typeof NotificationRouteType];


export const NOTIFICATION_ROUTE_MAP: Record<NotificationRouteType, { label: string }> = {
    [NotificationRouteType.DocumentDetail]: {
        label: "Phê duyệt nội bộ"
    },
    [NotificationRouteType.RejectedDocument]: {
        label: "Tài liệu bị từ chối"
    },
    [NotificationRouteType.StaffReview]: {
        label: "Thẩm định chuyên viên"
    },
    [NotificationRouteType.AssignmentDetail]: {
        label: "Chi tiết nhiệm vụ"
    },
    [NotificationRouteType.FeedbackDetail]: {
        label: "Chi tiết phản hồi"
    },
    [NotificationRouteType.ManagerAssignment]: {
        label: "Phân công trưởng đơn vị"
    },
    [NotificationRouteType.DirectorAssignment]: {
        label: "Phân công giám đốc"
    },
    [NotificationRouteType.PendingAppraisal]: {
        label: "Chờ thẩm định"
    },
    [NotificationRouteType.IssuedDocument]: {
        label: "Tài liệu đã ban hành"
    },
    [NotificationRouteType.FinalApproval]: {
        label: "Phê duyệt cuối cùng"
    }
};