import type { pagination } from "@/types/pagination";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
    auth: {
        login: `/auth/login`,
        register: `/auth/register`,
        refreshToken: `/auth/refresh-token`,
        logout: `/auth/logout`,
    },

    users: {
        profile: `/users/my-profile`,
        updateProfile: `/users/update-profile`,
        joinDepartment: `/users/join-department`,
        requestPromotion: `/users/request-promotion`,
        updateAccountStatus: (id: string) => `/users/${id}/account-status`,
        filter: `/users/user-filter`,
    },

    documents: {
        create: `/documents/create-document`,
        submitInternal: (id: string) => `/documents/${id}/submit-internal`,
        handleFeedback: (id: string) => `/documents/${id}/feedback-handling`,
        createFromIssue: (issueId: string) => `/documents/from-issue/${issueId}`,
        getDetail: (id: string) => `/documents/${id}/document-detail`,
        updateDraft: (id: string) => `/documents/${id}/update-draft`,
        list: `/documents/list-document`,
        versions: (documentId: string) => `/documents/${documentId}/versions`,
        myTasks: `/documents/my-tasks`,
    },

    ai: {
        suggestions: `/appraisal/suggestions`,
        aiCheck: (docId: string) => `/appraisal/${docId}/ai-check`,
    },

    appraisal: {
        createParallel: `/appraisal/create-parallel-assignments`,
        assignStaff: `/appraisal/assign-internal-staff`,
        confirmDepartment: `/appraisal/department-confirm`,
        submitReview: (reviewerId: string) => `/appraisal/staff-submit-review/${reviewerId}`,
        finalize: (docId: string) => `/appraisal/${docId}/complete-appraisal`,
    },

    appraisalHistory: {
        getByDocument: (documentId: string) => `/appraisal-history/document/${documentId}`,
        create: `/appraisal-history`,
        getRejections: (historyId: string) => `/appraisal-history/${historyId}/rejections`,
    },

    attachments: {
        upload: `/attachments/upload`,
        getByEntity: (entityId: string) => `/attachments/gattachment-detail/${entityId}`,
        delete: (id: string) => `/attachments/${id}`,
        fileDetail: (id: string) => `/attachments/attachment-file-detail/${id}`,
    },

    feedback: {
        getByDocument: (documentId: string) => `/feedback/document/${documentId}`,
        getDetail: (id: string) => `/feedback/issues/${id}`,
        report: `/feedback/report`,
        updateStatus: (id: string) => `/feedback/issues/${id}/status`,
        finalize: (id: string) => `/feedback/issues/${id}/finalize`,
    },

    signing: {
        approve: `/signing/approve-sign`,
        reject: `/signing/reject`,
        bulk: `/signing/bulk-appraisal`,
        qr: (docId: string) => `/signing/${docId}/qr-data`,
        issue: (docId: string) => `/signing/${docId}/issue`,
        exportPdf: (versionId: string) => `/signing/export-pdf/${versionId}`,
    },

    notifications: {
        getAll: `/notifications`,
        markRead: (id: string) => `/notifications/${id}/read`,
        delete: (id: string) => `/notifications/${id}`,
    },

    dashboard: {
        appraisal: `/dashboard/appraisal-dashboard`,
    },

    departments: {
        invite: `/departments/invite`,
        join: `/departments/join`,
        create: `/departments/create-department`,
        update: (id: string) => `/departments/${id}/update-department`,
        delete: (id: string) => `/departments/${id}/delete-department`,
        getAll: ({ page, pageSize }: pagination, searchTerm?: string) =>
            `/departments/get-all-department?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${searchTerm}` : ""}`,
    },
};

export default API_BASE_URL;