import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";

import type { ApiResponse } from "@/types/apiResponse";
import type { DashboardSummaryStaffDto } from "@/types/dashboard";

export const dashboardService = {
    getStaffSummary: async (): Promise<DashboardSummaryStaffDto> => {
        const res = await axiosClient.get<
            ApiResponse<DashboardSummaryStaffDto>
        >(
            API_ENDPOINTS.dashboard.staffSummary
        );

        return res.data.data;
    },
};