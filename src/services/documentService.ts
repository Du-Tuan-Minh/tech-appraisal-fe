import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/apiResponse";
import qs from "qs";

import type {
    TechnicalDocumentCreateDto,
    TechnicalDocumentUpdateDto,
    DocumentFilterDto,
    TechnicalDocumentResponseDto,
    TechnicalDocumentDetailDto,
    UserCurrentDocumentDto,
    UserCurrentDocumentFilterDto,
    OverdueDocumentDto,
    OverdueFilterDto,
    ManagerDashboardDocumentDto,
    ManagerDashboardDocumentFilterDto,
    DepartmentDocumentStatusFilterDto,
    IncomingAppraisalDocumentDto,
} from "@/types/document";

import type { PagedResult } from "@/types/paginationResult";
import type { pagination } from "@/types/pagination";

import type { DocumentVersionDto, DocumentVersionDetailDto } from "@/types/version";
import type { FeedbackActionRequestDto } from "@/types/feedback";
import type { DocumentVersionCreateDto } from "@/types/version";

export const documentService = {

    getDocuments: async (
        filters: DocumentFilterDto
    ): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.list,
            { params: filters }
        );
        return res.data.data;
    },

    getDocumentById: async (id: string): Promise<TechnicalDocumentDetailDto> => {
        const res = await axiosClient.get<ApiResponse<TechnicalDocumentDetailDto>>(
            API_ENDPOINTS.documents.getDetail(id)
        );
        return res.data.data;
    },

    createDocument: async (
        data: TechnicalDocumentCreateDto
    ): Promise<TechnicalDocumentResponseDto> => {
        const res = await axiosClient.post<ApiResponse<TechnicalDocumentResponseDto>>(
            API_ENDPOINTS.documents.create,
            data
        );
        return res.data.data;
    },

    updateDocument: async (
        id: string,
        data: TechnicalDocumentUpdateDto
    ): Promise<boolean> => {
        const res = await axiosClient.put<ApiResponse<boolean>>(
            API_ENDPOINTS.documents.updateDraft(id),
            data
        );

        return res.data.data;
    },

    submitForAppraisal: async (id: string): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.submitInternal(id)
        );
    },

    handleFeedback: async (
        id: string,
        data: FeedbackActionRequestDto
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.handleFeedback(id),
            data
        );
    },

    getMyTasks: async (
        pagination: pagination
    ): Promise<PagedResult<TechnicalDocumentResponseDto>> => {
        const res = await axiosClient.get<ApiResponse<PagedResult<TechnicalDocumentResponseDto>>>(
            API_ENDPOINTS.documents.myTasks,
            { params: pagination }
        );
        return res.data.data;
    },

    getDocumentVersions: async (
        documentId: string
    ): Promise<DocumentVersionDto[]> => {
        const res = await axiosClient.get<ApiResponse<DocumentVersionDto[]>>(
            API_ENDPOINTS.documents.getVersions(documentId)
        );
        return res.data.data;
    },

    getVersionDetail: async (
        versionId: string
    ): Promise<DocumentVersionDetailDto> => {
        const res = await axiosClient.get<ApiResponse<DocumentVersionDetailDto>>(
            API_ENDPOINTS.documents.getVersionDetail(versionId)
        );
        return res.data.data;
    },

    createFromImprovement: async (
        issueId: string,
        data: DocumentVersionCreateDto
    ): Promise<void> => {
        await axiosClient.post<ApiResponse<any>>(
            API_ENDPOINTS.documents.createVersionFromIssue(issueId),
            data
        );
    },

    // getMyCurrentDocuments: async (
    //     filters: UserCurrentDocumentFilterDto
    // ): Promise<PagedResult<UserCurrentDocumentDto>> => {
    //     const res = await axiosClient.get<
    //         ApiResponse<PagedResult<UserCurrentDocumentDto>>
    //     >(
    //         API_ENDPOINTS.documents.myCurrentDocuments,
    //         {
    //             params: filters,
    //             paramsSerializer: (params) =>
    //                 qs.stringify(params, {
    //                     arrayFormat: "repeat"
    //                 })
    //         }
    //     );

    //     return res.data.data;
    // },

    getMyCurrentDocuments: async (
        filters: UserCurrentDocumentFilterDto
    ): Promise<PagedResult<UserCurrentDocumentDto>> => {
        const res = await axiosClient.get<
            ApiResponse<PagedResult<UserCurrentDocumentDto>>
        >(
            API_ENDPOINTS.documents.myCurrentDocuments,
            {
                params: filters,
                paramsSerializer: (params) =>
                    qs.stringify(params, {
                        arrayFormat: "repeat"
                    })
            }
        );

        return res.data.data;
    },

    // getPendingAppraisalResponses: async (
    //     filters: PendingAppraisalFilterDto
    // ): Promise<PagedResult<PendingAppraisalResponseDto>> => {
    //     const res = await axiosClient.get<
    //         ApiResponse<PagedResult<PendingAppraisalResponseDto>>
    //     >(
    //         API_ENDPOINTS.documents.pendingAppraisalResponses(filters)
    //     );

    //     return res.data.data;
    // },

    getOverdueDocuments: async (
        filters: OverdueFilterDto
    ): Promise<PagedResult<OverdueDocumentDto>> => {

        const res = await axiosClient.get<
            ApiResponse<PagedResult<OverdueDocumentDto>>
        >(
            API_ENDPOINTS.documents.managerOverdueDocuments,
            {
                params: filters
            }
        );

        return res.data.data;
    },

    getManagerStatusDocuments: async (
        filters: ManagerDashboardDocumentFilterDto
    ): Promise<PagedResult<ManagerDashboardDocumentDto>> => {

        const res = await axiosClient.get<
            ApiResponse<PagedResult<ManagerDashboardDocumentDto>>
        >(
            API_ENDPOINTS.documents.managerStatusDocuments,
            {
                params: filters
            }
        );

        return res.data.data;
    },

    getManagerRequestedOverdueDocuments: async (
        filters: OverdueFilterDto
    ): Promise<PagedResult<OverdueDocumentDto>> => {

        const res = await axiosClient.get<
            ApiResponse<PagedResult<OverdueDocumentDto>>
        >(
            API_ENDPOINTS.documents.managerRequestedOverdueDocuments,
            {
                params: filters
            }
        );

        return res.data.data;
    },

    getManagerRequestStatusDocuments: async (
        filters: DepartmentDocumentStatusFilterDto
    ): Promise<PagedResult<ManagerDashboardDocumentDto>> => {

        const res = await axiosClient.get<
            ApiResponse<PagedResult<ManagerDashboardDocumentDto>>
        >(
            API_ENDPOINTS.documents.managerRequestStatusDocuments,
            {
                params: filters
            }
        );

        return res.data.data;
    },

    getIncomingAppraisalDocuments: async (
        params: pagination & { searchTerm?: string }
    ): Promise<PagedResult<IncomingAppraisalDocumentDto>> => {

        const res = await axiosClient.get<
            ApiResponse<PagedResult<IncomingAppraisalDocumentDto>>
        >(
            API_ENDPOINTS.documents.incomingAppraisalDocuments,
            {
                params
            }
        );

        return res.data.data;
    },
};