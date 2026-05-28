import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";

import type { ApiResponse } from "@/types/apiResponse";
import type { DashboardSummaryDirectorDto, DashboardSummaryManagerDto, DashboardSummaryStaffDto, DepartmentDocumentStatusSummaryDto, ManagerWorkloadDto } from "@/types/dashboard";
import type { PagedResult } from "@/types/paginationResult";

export const dashboardService = {
    getStaffSummary: async (): Promise<DashboardSummaryStaffDto> => {
        const res = await axiosClient.get<
            ApiResponse<DashboardSummaryStaffDto>
        >(
            API_ENDPOINTS.dashboard.staffSummary
        );

        return res.data.data;
    },

    getManagerSummary: async (): Promise<DashboardSummaryManagerDto> => {
        const res = await axiosClient.get<ApiResponse<DashboardSummaryManagerDto>>(
            API_ENDPOINTS.dashboard.managerSummary
        );

        return res.data.data;
    },

    getDirectorSummary: async (): Promise<DashboardSummaryDirectorDto> => {
        const res = await axiosClient.get<ApiResponse<DashboardSummaryDirectorDto>>(
            API_ENDPOINTS.dashboard.directorSummary
        );

        return res.data.data;
    },

    getManagerWorkloads: async (
        page: number = 1,
        pageSize: number = 10,
        searchTerm: string | null = null
    ): Promise<PagedResult<ManagerWorkloadDto>> => {
        const res =
            await axiosClient.get<ApiResponse<PagedResult<ManagerWorkloadDto>>>(
                API_ENDPOINTS.dashboard.managerWorkloads,
                {
                    params: {
                        page,
                        pageSize,
                        searchTerm: searchTerm || undefined,
                    },
                }
            );

        return res.data.data;
    },

    getDepartmentDocumentStatusSummary: async (): Promise<DepartmentDocumentStatusSummaryDto> => {
        const res = await axiosClient.get<
            ApiResponse<DepartmentDocumentStatusSummaryDto>
        >(
            API_ENDPOINTS.dashboard.departmentDocumentStatusSummary
        );

        return res.data.data;
    },
};