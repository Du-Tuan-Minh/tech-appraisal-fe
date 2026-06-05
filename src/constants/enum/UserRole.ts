export const UserRole = {
    Admin: 1,
    Staff: 2,
    Manager: 3,
    Director: 4,
    Inspector: 5,
    DeputyInstituteDirector: 6,
    InstituteDirector: 7,
    Coordinator: 8
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_MAP: Record<UserRole, { label: string; color: string }> = {
    [UserRole.Admin]: {
        label: "Quản trị hệ thống",
        color: "text-red-400 bg-red-900/20 border border-red-500/20"
    },
    [UserRole.Staff]: {
        label: "Chuyên viên",
        color: "text-blue-400 bg-blue-900/20"
    },
    [UserRole.Manager]: {
        label: "Lãnh đạo cấp phòng",
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [UserRole.Director]: {
        label: "Ban Giám đốc",
        color: "text-amber-400 bg-amber-900/20"
    },
    [UserRole.Inspector]: {
        label: "Người kiểm soát",
        color: "text-purple-400 bg-purple-900/20"
    },
    [UserRole.DeputyInstituteDirector]: {
        label: "Phó viện trưởng",
        color: "text-emerald-400 bg-emerald-900/20"
    },
    [UserRole.InstituteDirector]: {
        label: "Viện trưởng",
        color: "text-green-400 bg-green-900/30 border border-green-500/30"
    },
    [UserRole.Coordinator]: {
        label: "Điều phối viên",
        color: "text-cyan-400 bg-cyan-900/20"
    }
};