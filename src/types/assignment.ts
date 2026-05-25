import type { IssueSeverity } from "@/constants/enum/IssueSeverity";
import type { AssignmentStatus } from "@/constants/enum/AssignmentStatus";
import type { AppraisalReviewerDto } from "@/types/reviewer";

export interface AppraisalAssignmentDto {
    id: string;
    documentId: string;
    documentTitle: string;
    versionNumber: number;
    departmentName: string;
    departmentId: string;
    requestVersionId: string;
    status: AssignmentStatus;
    documentCode: string;
    deadline?: string | null;
}

export interface AppraisalAssignmentDetailDto extends AppraisalAssignmentDto {
    assignedById: string;
    assignedByName: string;
    responsibleManagerId: string;
    responsibleManagerName: string;
    managerComment?: string | null;
    createdAt: string;
    completedAt?: string | null;
    reviewerCount: number;
    attachmentCount: number;
    issueCount: number;
    reviewers: AppraisalReviewerDto[];
}

export interface AssignStaffRequest {
    assignmentId: string;
    staffIds: string[];
    managerNote?: string | null;
    deadline?: string | null;
}

export interface CompleteAssignmentRequest {
    assignmentId: string;
    finalComment: string;
    validatedIssueIds: string[];
    rejectedIssueIds: string[];
    attachmentIds: string[];
}

export interface ConsolidateAppraisalRequest {
    documentId: string;
    requestVersionId: string;
    validatedIssueIds: string[];
    rejectedIssueIds: string[];
    finalComment?: string | null;
    isPass: boolean;
    attachmentIds: string[];
}

export interface AppraisalEntry {
    indicatorPath: string;
    comment: string;
    severity: IssueSeverity;
}

export interface CreateParallelAssignmentsRequest {
    documentId: string;
    requestVersionId: string;
    departmentAssignments: DepartmentAssignmentInfo[];
    globalDeadline?: string | null;
    globalComment?: string | null;
}

export interface DepartmentAssignmentInfo {
    targetId: string;
    deadline?: string | null;
    managerComment?: string | null;
}

export interface SendParallelAssignmentsRequest {
    documentId: string;
    comment?: string | null;
}