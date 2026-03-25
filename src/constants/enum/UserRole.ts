export const UserRole = {
    Admin: 1,
    CnlStaff: 2,
    CnlManager: 3,
    S2Staff: 4,
    S2Manager: 5,
    Inspector: 6,
    Executive: 7
} as const;

export type UserRole =
    (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.Admin]: "Quản trị viên",
    [UserRole.CnlStaff]: "Nhân viên CNL",
    [UserRole.CnlManager]: "Quản lý CNL",
    [UserRole.S2Staff]: "Nhân viên S2",
    [UserRole.S2Manager]: "Quản lý S2",
    [UserRole.Inspector]: "Thẩm định viên",
    [UserRole.Executive]: "Ban giám đốc"
};