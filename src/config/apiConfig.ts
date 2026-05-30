import type { KnowledgeBaseFilterDto } from "@/types/knowledge-base";
import type { pagination } from "@/types/pagination";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
    auth: {
        login: `/auth/login`,
        register: `/auth/register`,
        refreshToken: `/auth/refresh-token`,
        logout: `/auth/logout`,
    },

    attachments: {
        upload: `/attachments/upload`,
        delete: (id: string) => `/attachments/${id}`,
        getFile: (id: string) => `/attachments/attachment-file-detail/${id}`,
    },

    users: {
        profile: `/users/my-profile`,
        updateProfile: `/users/update-profile`,
        joinDepartment: `/users/join-department`,
        requestPromotion: `/users/request-promotion`,
        updateAccountStatus: (id: string) => `/users/${id}/account-status`,
        filter: `/users/user-filter`,
        changePassword: `/users/change-password`,
        detail: (id: string) => `/users/detail/${id}`,
        getSeniorCenter: ({ page, pageSize }: pagination, searchTerm?: string) =>
            `/users/senior-center?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`,
        topRejectedDocumentTypes: ({ page, pageSize }: pagination) =>
            `/users/top-rejected-document-types?page=${page}&pageSize=${pageSize}`,
    },

    documents: {
        list: "/documents/list-document",
        create: "/documents/create-document",
        getDetail: (id: string) => `/documents/${id}/document-detail`,
        updateDraft: (id: string) => `/documents/${id}/update-draft`,
        handleFeedback: (id: string) => `/documents/${id}/create-version-appraisal`,
        submitInternal: (id: string) => `/documents/${id}/submit-internal`,
        getVersions: (docId: string) => `/documents/${docId}/versions`,
        myTasks: "/documents/my-tasks",
        createVersionFromIssue: (issueId: string) => `/documents/create-version-issue/${issueId}`,
        getVersionDetail: (versionId: string) => `/documents/versions/${versionId}/detail`,
        myCurrentDocuments: "/documents/my-current-documents",
        managerOverdueDocuments: "/documents/manager-overdue-documents",
        managerDashboardDocuments: "/documents/manager-dashboard-documents",
        departmentCreatedOverdueDocuments: "/documents/department-created-overdue-documents",
        managerRequestedDocumentSummary: "/documents/manager-requested-document-summary",
    },

    appraisal: {
        createParallel: `/appraisal/create-parallel-assignments`,
        assignStaff: `/appraisal/assign-internal-staff`,
        confirmDepartment: (docId: string) => `/appraisal/department-confirm?documentId=${docId}`,
        submitReview: (reviewerId: string) => `/appraisal/staff-submit-review/${reviewerId}`,
        confirmCenter: `/appraisal/center-confirm`,
        getDetail: (id: string) => `/appraisal/assignment-detail/${id}`,
        listDirectorAssignments: `/appraisal/director-assignments`,
        listManagerAssignments: (versionId?: string) => `/appraisal/manager-assignments${versionId ? `/${versionId}` : ""}`,
        listReviewer: (assignmentId?: string) => `/appraisal/list-reviewer${assignmentId ? `/${assignmentId}` : ""}`,
        getReviewerDetail: (reviewerId: string) => `/appraisal/reviewer-detail/${reviewerId}`,
        recallAssignments: `/appraisal/recall-assignments`,
    },

    appraisalHistory: {
        getByDocument: (documentId: string) => `/appraisal-history/document/${documentId}`,
        getRejections: (historyId: string) => `/appraisal-history/${historyId}/rejections`,
    },

    feedback: {
        getByDocument: (documentId: string) => `/feedback/document/${documentId}`,
        getByVersion: (versionId: string) => `/feedback/version/${versionId}`,
        getDetail: (id: string) => `/feedback/detail/${id}`,
        addReviewIssue: `/feedback/add-issues`,
        updateStatus: (id: string) => `/feedback/issues/${id}/status`,
        finalize: (id: string) => `/feedback/issues/${id}/finalize`,
    },

    feedbackComments: {
        create: "/feedback-comments/create",
        getByIssue: (issueId: string, pagination: { page: number; pageSize: number }) =>
            `/feedback-comments/issue/${issueId}?page=${pagination.page}&pageSize=${pagination.pageSize}`
    },

    signing: {
        // getProgress: (docId: string, versionId: string) =>
        //     `/signing/${docId}/progress?versionId=${versionId}`,
        approve: `/signing/approve-sign`,
        reject: `/signing/reject`,
        issue: (docId: string) => `/signing/${docId}/issue`,
        exportPdf: (versionId: string) => `/signing/export-pdf/${versionId}`,
    },

    notifications: {
        getAll: `/notifications/my`,
        markRead: (id: string) => `/notifications/${id}/read`,
        delete: (id: string) => `/notifications/${id}`,
    },

    dashboard: {
        staffSummary: "/dashboard/staff-summary",
        managerSummary: "/dashboard/manager-summary",
        directorSummary: "/dashboard/director-summary",
        managerWorkloads: "/dashboard/manager-workloads",
        managerRequestedDocumentSummary: "/dashboard/manager-requested-document-summary",
    },

    approvalWorkflows: {
        getDocumentWorkflow: (documentId: string, requestVersionId?: string) =>
            `/approval-workflows/document/${documentId}${requestVersionId ? `?requestVersionId=${requestVersionId}` : ""}`,

        getWorkflowDetail: (id: string) => `/approval-workflows/${id}`,
    },

    departments: {
        invite: `/departments/invite`,
        create: `/departments/create-department`,
        update: (id: string) => `/departments/${id}/update-department`,
        delete: (id: string) => `/departments/${id}/delete-department`,
        // getCenters: ({ page, pageSize }: pagination, searchTerm?: string) =>
        //     `/departments/centers?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`,
        getCenters: "/departments/centers",
        getSubDepartments: (parentId: string) => `/departments/${parentId}/sub-departments`,
        // getSubDepartments: (parentId: string, { page, pageSize }: pagination, searchTerm?: string) =>
        //     `/departments/${parentId}/sub-departments?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`,
    },

    knowledgeBase: {
        create: `/knowledgeBase/create`,
        getList: (params: KnowledgeBaseFilterDto) =>
            `/knowledgeBase/getlist?${new URLSearchParams(params as any).toString()}`,
        getDetail: (id: string, searchTerm?: string) => {
            const url = `/knowledgeBase/detail/${id}`;
            return searchTerm
                ? `${url}?searchTerm=${encodeURIComponent(searchTerm)}`
                : url;
        },
        delete: (id: string) => `/knowledgeBase/delete/${id}`,
        smartSuggestions: (query: string) => `/knowledgeBase/smart-suggestions?query=${encodeURIComponent(query)}`,
        download: (id: string) => `/knowledgeBase/download/${id}`,
    }
};

export default API_BASE_URL;