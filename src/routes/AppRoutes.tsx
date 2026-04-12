import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/users/ProfilePage";
import DepartmentListPage from "../pages/departments/DepartmentListPage";
import DocumentListPage from "../pages/documents/DocumentListPage";
import CreateDocumentPage from "../pages/documents/CreateDocumentPage";
import DocumentEditorPage from "../pages/documents/DocumentEditorPage";
import DocumentVersionsPage from "../pages/documents/DocumentVersionsPage";
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
import AppraisalInternalPage from "../pages/appraisals/AppraisalInternalPage";
import MyTasksPage from "../pages/appraisals/MyTasksPage";
import UserListPage from "../pages/users/UserListPage";

const AppRoutes = () => {
    return (
        <Routes>

            {/* AUTH */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                {/* DASHBOARD */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/list-users" element={<UserListPage />} />

                {/* PROFILE */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* DEPARTMENTS */}
                <Route path="/departments" element={<DepartmentListPage />} />

                {/* DOCUMENTS */}
                <Route path="/documents" element={<DocumentListPage />} />
                <Route path="/documents/create" element={<CreateDocumentPage />} />
                <Route path="/documents/:id/editor" element={<DocumentEditorPage />} />
                <Route path="/documents/:id/versions" element={<DocumentVersionsPage />} />
                <Route path="/appraisals/my-tasks" element={<MyTasksPage />} />

                {/* APPRAISALS */}
                <Route path="/appraisals" element={<AppraisalDashboardPage />} />
                <Route path="/appraisals/:id/assign" element={<AppraisalAssignmentPage />} />
                <Route path="/appraisals/:id/review" element={<AppraisalReviewPage />} />
                <Route path="/documents/:id/feedback" element={<ConsolidatedFeedbackPage />} />
                <Route path="/appraisals/internal/:id" element={<AppraisalInternalPage />} />

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
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;