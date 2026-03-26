// import { useState, useEffect } from "react";
// import { UserRole } from "@/constants/enum/UserRole";
// import { getProfile } from "@/services/userService";

// const ALLOWED_CREATE_ROLES: UserRole[] = [UserRole.CnlManager, UserRole.S2Manager, UserRole.Executive];
// const ALLOWED_JOIN_ROLES: UserRole[] = [UserRole.CnlStaff, UserRole.S2Staff];
// const ADMIN_MANAGER_ROLES: UserRole[] = [UserRole.Admin, UserRole.CnlManager, UserRole.S2Manager, UserRole.Executive];

// export const usePermission = () => {
//     const [role, setRole] = useState<UserRole | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchRole = async () => {
//             try {
//                 const profile = await getProfile();
//                 // Senior Tip: Ép kiểu Number để tránh lỗi string vs number từ API
//                 const currentRole = profile?.role !== undefined ? Number(profile.role) as UserRole : null;
//                 setRole(currentRole);
//             } catch (err) {
//                 setRole(null);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchRole();
//     }, []);

//     return {
//         role,
//         isLoading,
//         // Dùng Number() để so sánh chính xác trong mảng includes
//         canCreate: role !== null && ALLOWED_CREATE_ROLES.includes(role),
//         canJoin: role !== null && ALLOWED_JOIN_ROLES.includes(role),
//         isAdminOrManager: role !== null && ADMIN_MANAGER_ROLES.includes(role),
//     };
// };