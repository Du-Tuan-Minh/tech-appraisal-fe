const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        refreshToken: `${API_BASE_URL}/auth/refresh-token`,
        logout: `${API_BASE_URL}/auth/logout`,
    },

    users: {
        profile: `${API_BASE_URL}/users/my-profile`,
        updateProfile: `${API_BASE_URL}/users/update-profile`,
        joinDepartment: `${API_BASE_URL}/users/join-department`,
        requestPromotion: `${API_BASE_URL}/users/request-promotion`,
        updateAccountStatus: (id: string) => `${API_BASE_URL}/users/${id}/account-status`,
        filter: `${API_BASE_URL}/users/user-filter`,
    },

    documents: {
        create: `${API_BASE_URL}/documents/create-document`,
        submitInternal: (id: string) => `${API_BASE_URL}/documents/${id}/submit-internal`,
        handleFeedback: (id: string) => `${API_BASE_URL}/documents/${id}/feedback-handling`,
        createFromIssue: (issueId: string) => `${API_BASE_URL}/documents/from-issue/${issueId}`,
        getDetail: (id: string) => `${API_BASE_URL}/documents/${id}/document-detail`,
        updateDraft: (id: string) => `${API_BASE_URL}/documents/${id}/update-draft`,
        list: `${API_BASE_URL}/documents/list-document`,
        versions: (documentId: string) => `${API_BASE_URL}/documents/${documentId}/versions`,
        myTasks: `${API_BASE_URL}/documents/my-tasks`,
    },

    ai: {
        suggestions: `${API_BASE_URL}/appraisal/suggestions`,
        aiCheck: (docId: string) => `${API_BASE_URL}/appraisal/${docId}/ai-check`,
    },

    appraisal: {
        createParallel: `${API_BASE_URL}/appraisal/create-parallel-assignments`,
        assignStaff: `${API_BASE_URL}/appraisal/assign-internal-staff`,
        confirmDepartment: `${API_BASE_URL}/appraisal/department-confirm`,
        submitReview: (reviewerId: string) => `${API_BASE_URL}/appraisal/staff-submit-review/${reviewerId}`,
        finalize: (docId: string) => `${API_BASE_URL}/appraisal/${docId}/complete-appraisal`,
    },

    appraisalHistory: {
        getByDocument: (documentId: string) => `${API_BASE_URL}/appraisal-history/document/${documentId}`,
        create: `${API_BASE_URL}/appraisal-history`,
        getRejections: (historyId: string) => `${API_BASE_URL}/appraisal-history/${historyId}/rejections`,
    },

    attachments: {
        upload: `${API_BASE_URL}/attachments/upload`,
        getByEntity: (entityId: string) => `${API_BASE_URL}/attachments/gattachment-detail/${entityId}`,
        delete: (id: string) => `${API_BASE_URL}/attachments/${id}`,
        fileDetail: (id: string) => `${API_BASE_URL}/attachments/attachment-file-detail/${id}`,
    },

    feedback: {
        getByDocument: (documentId: string) => `${API_BASE_URL}/feedback/document/${documentId}`,
        getDetail: (id: string) => `${API_BASE_URL}/feedback/issues/${id}`,
        report: `${API_BASE_URL}/feedback/report`,
        updateStatus: (id: string) => `${API_BASE_URL}/feedback/issues/${id}/status`,
        finalize: (id: string) => `${API_BASE_URL}/feedback/issues/${id}/finalize`,
    },

    signing: {
        approve: `${API_BASE_URL}/signing/approve-sign`,
        reject: `${API_BASE_URL}/signing/reject`,
        bulk: `${API_BASE_URL}/signing/bulk-appraisal`,
        qr: (docId: string) => `${API_BASE_URL}/signing/${docId}/qr-data`,
        issue: (docId: string) => `${API_BASE_URL}/signing/${docId}/issue`,
        exportPdf: (versionId: string) => `${API_BASE_URL}/signing/export-pdf/${versionId}`,
    },

    notifications: {
        getAll: `${API_BASE_URL}/notifications`,
        markRead: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
        delete: (id: string) => `${API_BASE_URL}/notifications/${id}`,
    },

    dashboard: {
        appraisal: `${API_BASE_URL}/dashboard/appraisal-dashboard`,
    },

    departments: {
        invite: `${API_BASE_URL}/departments/invite`,
        join: `${API_BASE_URL}/departments/join`,
        create: `${API_BASE_URL}/departments/create-department`,
        update: (id: string) => `${API_BASE_URL}/departments/${id}/update-department`,
        delete: (id: string) => `${API_BASE_URL}/departments/${id}/delete-department`,
        getAll: `${API_BASE_URL}/departments/get-all-department`,
    },
};

export default API_BASE_URL;