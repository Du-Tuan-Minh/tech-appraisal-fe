import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);
        console.log("Full Token Payload:", decoded);
        return decoded.role ?? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
        return null;
    }
};