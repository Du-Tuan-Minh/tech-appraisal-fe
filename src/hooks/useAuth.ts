import { getRoleFromToken } from "@/utils/auth";
import { UserRole } from "@/constants/enum/UserRole";

export const useAuth = () => {
    const rawRole = getRoleFromToken();
    let role: number;

    if (typeof rawRole === 'string' && isNaN(Number(rawRole))) {
        role = (UserRole as any)[rawRole] || 0;
    } else {
        role = Number(rawRole);
    }

    console.log("🔍 [useAuth Debug] Raw:", rawRole, "-> Parsed Role:", role);

    return {
        role,
        isAdmin: role === UserRole.Admin,
        isManager: ([UserRole.Admin, UserRole.Manager, UserRole.Manager] as number[]).includes(role),
        isStaff: ([UserRole.Staff, UserRole.Staff, UserRole.Inspector] as number[]).includes(role),
    };
};