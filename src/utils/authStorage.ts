import axiosClient from "@/services/axiosClient";

export const setAuth = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};