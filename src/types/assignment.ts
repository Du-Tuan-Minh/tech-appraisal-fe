import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { AssignmentStatus } from "@/constants/enum/AssignmentStatus";
import type { AppraisalReviewerDto } from "@/types/reviewer";

export interface AppraisalAssignmentDto {
    id: string;
    documentId: string;
    documentCode: string;
    documentTitle: string;
    requestVersionId: string;
    versionNumber: number;
    departmentId: string;
    departmentName: string;
    assignedById: string;
    assignedByName: string;
    responsibleManagerId: string;
    responsibleManagerName: string;
    status: AssignmentStatus;
    deadline: string | null;
    managerComment: string | null;
    createdAt: string;
    completedAt: string | null;
    attachmentCount: number;
    issueCount: number;
    reviewers: AppraisalReviewerDto[];
}

export interface AssignStaffRequest {
    assignmentId: string;
    staffIds: string[];
    managerNote: string | null;
}

export interface CompleteAssignmentRequest {
    assignmentId: string | null;
    finalComment: string | null;
    decision: AssignmentStatus;
    validatedIssueIds: string[];
    rejectedIssueIds: string[];
    attachmentIds: string[];
}

export interface ConsolidateAppraisalRequest {
    documentId: string;
    requestVersionId: string;
    validatedIssueIds: string[];
    rejectedIssueIds: string[];
    newEntries: AppraisalEntry[];
    finalComment: string | null;
    isPass: boolean;
    attachmentIds: string[];
}

export interface AppraisalEntry {
    indicatorPath: string | null;
    comment: string;
    severity: IssueSeverity;
}

export interface CreateParallelAssignmentsRequest {
    documentId: string;
    requestVersionId: string;
    assignments: DepartmentAssignmentInfo[];
    s2StaffIds: string[];
    globalDeadline: string | null;
    globalComment: string | null;
}

export interface DepartmentAssignmentInfo {
    departmentId: string;
    individualDeadline: string | null;
    individualComment: string | null;
}