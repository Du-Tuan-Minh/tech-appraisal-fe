export const UserRole = {
    Admin: 1,
    Staff: 2,
    Manager: 3,
    Director: 4,
    Inspector: 5
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.Admin]: "Quản trị hệ thống",
    [UserRole.Staff]: "Chuyên viên",
    [UserRole.Manager]: "Lãnh đạo cấp phòng",
    [UserRole.Director]: "Ban Giám đốc",
    [UserRole.Inspector]: "Người kiểm soát/Tra cứu"
};