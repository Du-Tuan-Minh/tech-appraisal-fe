import type { UserRole } from "@/constants/enum/UserRole";
import type { AssignmentStatus } from "@/constants/enum/AssignmentStatus";

export interface ApprovalWorkflowResponseDto {
    id: string;
    stepOrder: number;
    requiredRole: UserRole;
    status: AssignmentStatus;
    isCurrentStep: boolean;
    signedAt?: string | null;
    approverId?: string | null;
    approverName?: string | null;
}

export interface ApprovalWorkflowDetailDto extends ApprovalWorkflowResponseDto {
    deadline?: string | null;
    note?: string | null;
    documentId: string;
    requestVersionId: string;
    appraisalAssignmentId?: string | null;
}

export interface ApprovalActionRequestDto {
    approvalWorkflowId: string;
    isApproved: boolean;
    note?: string | null;
}

export interface CreateWorkflowRequest {
    documentId: string;
    requestVersionId: string;
    appraisalAssignmentId?: string | null;
    steps: WorkflowStepConfigDto[];
}

export interface WorkflowStepConfigDto {
    stepOrder: number;
    requiredRole: UserRole;
    approverId?: string | null;
    deadline?: string | null;
}