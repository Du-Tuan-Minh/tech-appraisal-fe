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