import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import StaffDashboardPage from "../pages/dashboard/StaffDashboardPage";
import ProfilePage from "../pages/users/ProfilePage";
import DepartmentListPage from "../pages/departments/DepartmentListPage";
import CenterListPage from "../pages/departments/CenterListPage";
import DocumentListPage from "../pages/documents/DocumentListPage";
import CreateDocumentPage from "../pages/documents/CreateDocumentPage";
import DocumentEditorPage from "../pages/documents/DocumentEditorPage";
import DocumentVersionsPage from "../pages/documents/DocumentVersionsPage";
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
import MyTasksPage from "../pages/appraisals/MyTasksPage";
import UserListPage from "../pages/users/UserListPage";
import DocumentVersionDetailPage from "../pages/documents/DocumentVersionDetailPage";
import ManagerAssignmentListPage from "../pages/appraisals/ManagerAssignmentListPage";
import AssignmentDetailPage from "../pages/appraisals/AssignmentDetailPage";
import CreateManagerAssignmentPage from "../pages/appraisals/CreateManagerAssignmentPage";
import DirectorAssignmentListPage from "../pages/appraisals/DirectorAssignmentListPage";
import StaffAssignmentListPage from "../pages/appraisals/StaffAssignmentListPage";
import CreateStaffAssignmentPage from "../pages/appraisals/CreateStaffAssignmentPage";
import FeedbackDetailPage from "../pages/feedback/FeedbackDetailPage";
import UserDocumentListPage from "../pages/documents/UserDocumentListPage";
import ManagerDashboardPage from "../pages/dashboard/ManagerDashboardPage";
import PendingAppraisalResponsesPage from "../pages/appraisals/PendingAppraisalResponsesPage";
import OverdueDocumentsPage from "../pages/appraisals/OverdueDocumentsPage";
import TopUsersPage from "../pages/users/TopUsersPage";
import ManagerDashboardDocumentListPage from "../pages/documents/ManagerDashboardDocumentListPage";
import DirectorDashboardPage from "../pages/dashboard/DirectorDashboardPage";
import CoordinatorDashboardPage from "../pages/dashboard/CoordinatorDashboardPage";
import DepartmentAppraisalWorkloadsPage from "../pages/users/DepartmentAppraisalWorkloadsPage";
import IncomingAppraisalDocumentPage from "../pages/documents/IncomingAppraisalDocumentPage";

const AppRoutes = () => {
    return (
        <Routes>

            {/* AUTH */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                {/* DASHBOARD */}
                <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
                <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
                <Route path="/manager/dashboard/documents" element={<ManagerDashboardDocumentListPage />} />
                <Route path="/director/dashboard" element={<DirectorDashboardPage />} />
                <Route path="/coordinator/dashboard" element={<CoordinatorDashboardPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/top" element={<TopUsersPage />} />
                <Route path="/users/department-workloads" element={<DepartmentAppraisalWorkloadsPage />} />

                {/* PROFILE */}
                <Route path="/profile" element={<ProfilePage />} />

                {/* DEPARTMENTS */}
                <Route path="/centers" element={<CenterListPage />} />
                <Route path="/centers/:parentId/departments" element={<DepartmentListPage />} />

                {/* DOCUMENTS */}
                <Route path="/documents" element={<DocumentListPage />} />
                <Route path="/documents/create" element={<CreateDocumentPage />} />
                <Route path="/documents/:id/editor" element={<DocumentEditorPage />} />
                <Route path="/documents/:id/versions" element={<DocumentVersionsPage />} />
                <Route path="/appraisals/my-tasks" element={<MyTasksPage />} />
                <Route path="/documents/:id/version/:versionId" element={<DocumentVersionDetailPage />} />
                <Route path="/user/documents" element={<UserDocumentListPage />} />
                <Route path="/incoming-appraisal-documents" element={<IncomingAppraisalDocumentPage />} />

                {/* APPRAISALS */}
                <Route path="/manager/pending-appraisals" element={<PendingAppraisalResponsesPage />} />
                <Route path="/manager/overdue-documents" element={<OverdueDocumentsPage />} />
                <Route path="/appraisals/:documentId/review/:versionId" element={<AppraisalReviewPage />} />
                <Route path="/documents/:id/feedback" element={<ConsolidatedFeedbackPage />} />
                <Route path="/appraisals/listAssignments/:versionId?" element={<ManagerAssignmentListPage />} />
                <Route path="/appraisals/assignments/:assignmentId" element={<AssignmentDetailPage />} />
                <Route path="/appraisals/assignment/create/:versionId?" element={<CreateManagerAssignmentPage />} />
                <Route path="/appraisals/assignments/director" element={<DirectorAssignmentListPage />} />
                <Route path="/appraisals/reviewer-assignments/:assignmentId/staff" element={<StaffAssignmentListPage />} />
                <Route path="/appraisals/department/:departmentId/assignment/:assignmentId/staff" element={<CreateStaffAssignmentPage />} />
                <Route path="/appraisals/feedback/:issueId" element={<FeedbackDetailPage />} />

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