import { useMemo } from "react";
import { getRoleFromToken } from "@/utils/auth";
import { UserRole } from "@/constants/enum/UserRole";

export const useAuth = () => {
    const rawRole = getRoleFromToken();

    const role: number = useMemo(() => {
        if (typeof rawRole === 'string' && isNaN(Number(rawRole))) {
            return (UserRole as any)[rawRole] || 0;
        }
        return Number(rawRole) || 0;
    }, [rawRole]);

    return {
        role,
        isAdmin: role === UserRole.Admin,
        isManager: ([UserRole.Admin, UserRole.Manager, UserRole.Manager] as number[]).includes(role),
        isStaff: ([UserRole.Staff, UserRole.Staff, UserRole.Inspector] as number[]).includes(role),
    };
};