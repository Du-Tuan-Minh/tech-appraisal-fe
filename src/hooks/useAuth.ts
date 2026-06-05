import { useMemo } from "react";
import { getRoleFromToken } from "@/utils/auth";
import { UserRole } from "@/constants/enum/UserRole";

const MANAGER_GROUP: UserRole[] = [
    UserRole.Admin,
    UserRole.Manager,
    UserRole.Director,
    UserRole.DeputyInstituteDirector,
    UserRole.InstituteDirector,
    UserRole.Coordinator
];

const STAFF_GROUP: UserRole[] = [
    UserRole.Staff,
    UserRole.Inspector
];

const VALID_ROLES = Object.values(UserRole).filter((v): v is UserRole => typeof v === "number");

export const useAuth = () => {
    const rawRole = getRoleFromToken();

    const role = useMemo((): UserRole | null => {
        if (rawRole === null || rawRole === undefined || rawRole === "") return null;

        if (typeof rawRole === "string" && isNaN(Number(rawRole))) {
            return (UserRole as any)[rawRole] ?? null;
        }

        const numRole = Number(rawRole);
        return VALID_ROLES.includes(numRole as UserRole)
            ? (numRole as UserRole)
            : null;
    }, [rawRole]);

    return useMemo(() => ({
        role,
        isAdmin: role === UserRole.Admin,
        isCoordinator: role === UserRole.Coordinator,
        isManager: role !== null && MANAGER_GROUP.includes(role),
        isStaff: role !== null && STAFF_GROUP.includes(role),
        isOnlyManager: role === UserRole.Manager,
        isAuthenticated: role !== null,
    }), [role]);
};