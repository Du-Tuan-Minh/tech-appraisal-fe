import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/auth/ProfilePage";

import UserManagementPage from "../pages/admin/UserManagementPage";
import DepartmentManagementPage from "../pages/admin/DepartmentManagementPage";

import InvitationsPage from "../pages/invitations/InvitationsPage";

import DocumentListPage from "../pages/documents/DocumentListPage";
import CreateDocumentPage from "../pages/documents/CreateDocumentPage";
import DocumentEditorPage from "../pages/documents/DocumentEditorPage";
import DocumentVersionsPage from "../pages/documents/DocumentVersionsPage";
import SubmitForAppraisalPage from "../pages/documents/SubmitForAppraisalPage";

import AppraisalDashboardPage from "../pages/appraisals/AppraisalDashboardPage";
import AppraisalAssignmentPage from "../pages/appraisals/AppraisalAssignmentPage";
import AppraisalReviewPage from "../pages/appraisals/AppraisalReviewPage";
import ConsolidatedFeedbackPage from "../pages/appraisals/ConsolidatedFeedbackPage";

import SigningDashboardPage from "../pages/signatures/SigningDashboardPage";
import DocumentSigningPage from "../pages/signatures/DocumentSigningPage";

import IssuedDocumentsLibraryPage from "../pages/library/IssuedDocumentsLibraryPage";

import IssueListPage from "../pages/issues/IssueListPage";
import CreateIssuePage from "../pages/issues/CreateIssuePage";
import IssueDetailPage from "../pages/issues/IssueDetailPage";
import CreateImprovementVersionPage from "../pages/issues/CreateImprovementVersionPage";

import KnowledgeBasePage from "../pages/knowledge/KnowledgeBasePage";

import NotificationsPage from "../pages/notifications/NotificationsPage";

const AppRoutes = () => {
    return (
        <Routes>

            {/* AUTH */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* DASHBOARD */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* PROFILE */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* ADMIN */}
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/departments" element={<DepartmentManagementPage />} />

            {/* INVITATIONS */}
            <Route path="/invitations" element={<InvitationsPage />} />

            {/* DOCUMENTS */}
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/create" element={<CreateDocumentPage />} />
            <Route path="/documents/:id/editor" element={<DocumentEditorPage />} />
            <Route path="/documents/:id/versions" element={<DocumentVersionsPage />} />
            <Route path="/documents/:id/submit" element={<SubmitForAppraisalPage />} />

            {/* APPRAISALS */}
            <Route path="/appraisals" element={<AppraisalDashboardPage />} />
            <Route path="/appraisals/:id/assign" element={<AppraisalAssignmentPage />} />
            <Route path="/appraisals/:id/review" element={<AppraisalReviewPage />} />
            <Route path="/documents/:id/feedback" element={<ConsolidatedFeedbackPage />} />

            {/* SIGNATURES */}
            <Route path="/signatures" element={<SigningDashboardPage />} />
            <Route path="/signatures/:id" element={<DocumentSigningPage />} />

            {/* LIBRARY */}
            <Route path="/library" element={<IssuedDocumentsLibraryPage />} />

            {/* ISSUES */}
            <Route path="/issues" element={<IssueListPage />} />
            <Route path="/issues/create" element={<CreateIssuePage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
            <Route path="/issues/:id/improve" element={<CreateImprovementVersionPage />} />

            {/* KNOWLEDGE */}
            <Route path="/knowledge" element={<KnowledgeBasePage />} />

            {/* NOTIFICATIONS */}
            <Route path="/notifications" element={<NotificationsPage />} />

        </Routes>
    );
};

export default AppRoutes;