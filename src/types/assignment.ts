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
}

export interface AppraisalAssignmentDetailDto extends AppraisalAssignmentDto {
    assignedById: string;
    assignedByName: string;
    responsibleManagerId: string;
    responsibleManagerName: string;
    deadline?: string | null;
    managerComment?: string | null;
    createdAt: string;
    completedAt?: string | null;
    reviewerCount: number;
    attachmentCount: number;
    issueCount: number;
    reviewers: AppraisalReviewerDto[];
}

export interface AssignStaffRequest {
    assignmentId: string;       // [Required]
    staffIds: string[];         // List<Guid>
    managerNote?: string | null; // string? ManagerNote
}

export interface CompleteAssignmentRequest {
    assignmentId: string;       // [Required]
    finalComment: string;        // [Required] string FinalComment
    validatedIssueIds: string[]; // List<Guid>
    rejectedIssueIds: string[];  // List<Guid>
    attachmentIds: string[];     // List<Guid>
}

export interface ConsolidateAppraisalRequest {
    documentId: string;         // [Required]
    requestVersionId: string;   // [Required]
    validatedIssueIds: string[];
    rejectedIssueIds: string[];
    newEntries: AppraisalEntry[];
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
    departmentId: string;
    deadline?: string | null;
    managerComment?: string | null;
}

export interface SendParallelAssignmentsRequest {
    documentId: string;
    comment: string | null;
}