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
    },

    appraisal: {
        createParallel: `/appraisal/create-parallel-assignments`,
        assignStaff: `/appraisal/assign-internal-staff`,
        confirmDepartment: (docId: string) => `/appraisal/department-confirm?documentId=${docId}`,
        submitReview: (reviewerId: string) => `/appraisal/staff-submit-review/${reviewerId}`,
        finalize: `/appraisal/complete-appraisal`,
        getDetail: (id: string) => `/appraisal/assignment-detail/${id}`,
        listDirectorAssignments: `/appraisal/director-assignments`,
        listManagerAssignments: (versionId?: string) => `/appraisal/manager-assignments${versionId ? `/${versionId}` : ""}`,
        listReviewer: (assignmentId?: string) => `/appraisal/list-reviewer${assignmentId ? `/${assignmentId}` : ""}`,
        getReviewerDetail: (reviewerId: string) => `/appraisal/reviewer-detail/${reviewerId}`,
    },

    appraisalHistory: {
        getByDocument: (documentId: string) => `/appraisal-history/document/${documentId}`,
        getRejections: (historyId: string) => `/appraisal-history/${historyId}/rejections`,
    },

    feedback: {
        getByDocument: (documentId: string) => `/feedback/document/${documentId}`,
        getByVersion: (versionId: string) => `/feedback/version/${versionId}`,
        getDetail: (id: string) => `/feedback/detail/${id}`,
        addReviewIssue: `/feedback/add-issue`,
        updateStatus: (id: string) => `/feedback/issues/${id}/status`,
        finalize: (id: string) => `/feedback/issues/${id}/finalize`,
    },

    feedbackComments: {
        create: "/api/feedback-comments/create",
        getByIssue: (issueId: string, pagination: { page: number; pageSize: number }) =>
            `/api/feedback-comments/issue/${issueId}?page=${pagination.page}&pageSize=${pagination.pageSize}`
    },

    signing: {
        approve: `/signing/approve-sign`,
        reject: `/signing/reject`,
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
        create: `/departments/create-department`,
        update: (id: string) => `/departments/${id}/update-department`,
        delete: (id: string) => `/departments/${id}/delete-department`,
        getCenters: ({ page, pageSize }: pagination, searchTerm?: string) =>
            `/departments/centers?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`,
        getSubDepartments: (parentId: string, { page, pageSize }: pagination, searchTerm?: string) =>
            `/departments/${parentId}/sub-departments?page=${page}&pageSize=${pageSize}${searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""}`,
    },
};

export default API_BASE_URL;