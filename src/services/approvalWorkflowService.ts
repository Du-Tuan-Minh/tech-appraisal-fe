import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";

import type {
    ApprovalWorkflowResponseDto,
    ApprovalWorkflowDetailDto,
} from "@/types/approvalWorkflow";

export const approvalWorkflowService = {

    getDocumentWorkflow: async (
        documentId: string,
        requestVersionId?: string
    ): Promise<ApprovalWorkflowResponseDto[]> => {
        const res = await axiosClient.get<
            ApiResponse<ApprovalWorkflowResponseDto[]>
        >(
            API_ENDPOINTS.approvalWorkflows.getDocumentWorkflow(
                documentId,
                requestVersionId
            )
        );

        return res.data.data;
    },

    getWorkflowDetail: async (
        id: string
    ): Promise<ApprovalWorkflowDetailDto> => {
        const res = await axiosClient.get<
            ApiResponse<ApprovalWorkflowDetailDto>
        >(
            API_ENDPOINTS.approvalWorkflows.getWorkflowDetail(id)
        );

        return res.data.data;
    },
};