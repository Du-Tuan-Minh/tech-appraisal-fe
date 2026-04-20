import { AssignmentStatus, ASSIGNMENT_STATUS_LABELS } from "../enum/AssignmentStatus";
import { DOCUMENT_STATUS_LABELS, DocumentStatus } from "../enum/DocumentStatus";
import { ISSUE_SEVERITY_LABELS, IssueSeverity } from "../enum/IssueSeverity";
import { ReviewerStatus, REVIEWER_STATUS_LABELS } from "../enum/ReviewerStatus";

export const ASSIGNMENT_STATUS_MAP: Record<AssignmentStatus, { label: string; color: string }> = {
    [AssignmentStatus.Pending]: {
        label: ASSIGNMENT_STATUS_LABELS[AssignmentStatus.Pending],
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [AssignmentStatus.InReview]: {
        label: ASSIGNMENT_STATUS_LABELS[AssignmentStatus.InReview],
        color: "text-blue-400 bg-blue-900/20"
    },
    [AssignmentStatus.Completed]: {
        label: ASSIGNMENT_STATUS_LABELS[AssignmentStatus.Completed],
        color: "text-green-400 bg-green-900/20"
    },
    [AssignmentStatus.AwaitingClarification]: {
        label: ASSIGNMENT_STATUS_LABELS[AssignmentStatus.AwaitingClarification],
        color: "text-purple-400 bg-purple-900/20"
    },
    [AssignmentStatus.Overdue]: {
        label: ASSIGNMENT_STATUS_LABELS[AssignmentStatus.Overdue],
        color: "text-red-400 bg-red-900/20"
    },
};

export const REVIEWER_STATUS_MAP: Record<ReviewerStatus, { label: string; color: string }> = {
    [ReviewerStatus.Pending]: {
        label: REVIEWER_STATUS_LABELS[ReviewerStatus.Pending],
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [ReviewerStatus.Reviewing]: {
        label: REVIEWER_STATUS_LABELS[ReviewerStatus.Reviewing],
        color: "text-blue-400 bg-blue-900/20"
    },
    [ReviewerStatus.Completed]: {
        label: REVIEWER_STATUS_LABELS[ReviewerStatus.Completed],
        color: "text-green-400 bg-green-900/20"
    },
};

export const ISSUE_SEVERITY_MAP: Record<IssueSeverity, { label: string; color: string }> = {
    [IssueSeverity.Minor]: {
        label: ISSUE_SEVERITY_LABELS[IssueSeverity.Minor],
        color: "text-green-400 bg-green-900/20"
    },
    [IssueSeverity.Moderate]: {
        label: ISSUE_SEVERITY_LABELS[IssueSeverity.Moderate],
        color: "text-yellow-400 bg-yellow-900/20"
    },
    [IssueSeverity.Serious]: {
        label: ISSUE_SEVERITY_LABELS[IssueSeverity.Serious],
        color: "text-orange-400 bg-orange-900/20"
    },
    [IssueSeverity.Critical]: {
        label: ISSUE_SEVERITY_LABELS[IssueSeverity.Critical],
        color: "text-red-500 bg-red-900/30 border border-red-500/20"
    }
};

export const DOCUMENT_STATUS_MAP: Record<DocumentStatus, { label: string; color: string }> = {
    // GIAI ĐOẠN 1: XÂY DỰNG (Màu xám/vàng nhạt - Tính chất nội bộ)
    [DocumentStatus.Draft]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Draft],
        color: "text-gray-400 bg-gray-900/20"
    },
    [DocumentStatus.InternalPending]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.InternalPending],
        color: "text-yellow-500 bg-yellow-900/20"
    },
    [DocumentStatus.InternalApproved]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.InternalApproved],
        color: "text-yellow-400 bg-yellow-900/10"
    },

    // GIAI ĐOẠN 2: THẨM ĐỊNH ĐA BÊN (Màu xanh dương/tím - Tính chất phối hợp)
    [DocumentStatus.AppraisalPending]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.AppraisalPending],
        color: "text-blue-400 bg-blue-900/20"
    },
    [DocumentStatus.Appraising]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Appraising],
        color: "text-indigo-400 bg-indigo-900/20"
    },
    [DocumentStatus.AdjustmentRequired]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.AdjustmentRequired],
        color: "text-orange-400 bg-orange-900/20"
    },

    // GIAI ĐOẠN 3: PHÊ DUYỆT & BAN HÀNH (Màu xanh lá - Trạng thái tích cực)
    [DocumentStatus.Signing]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Signing],
        color: "text-emerald-400 bg-emerald-900/20"
    },
    [DocumentStatus.Issued]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Issued],
        color: "text-green-500 bg-green-900/30 border border-green-500/20"
    },

    // GIAI ĐOẠN 4: CẢI TIẾN (Màu tím/hồng - Tính chất thay đổi)
    [DocumentStatus.FeedbackReceived]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.FeedbackReceived],
        color: "text-purple-400 bg-purple-900/20"
    },
    [DocumentStatus.UnderImprovement]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.UnderImprovement],
        color: "text-fuchsia-400 bg-fuchsia-900/20"
    },

    // TRẠNG THÁI CUỐI (Màu đỏ/xám đậm - Kết thúc hoặc dừng)
    [DocumentStatus.Rejected]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Rejected],
        color: "text-red-400 bg-red-900/20"
    },
    [DocumentStatus.Archived]: {
        label: DOCUMENT_STATUS_LABELS[DocumentStatus.Archived],
        color: "text-gray-500 bg-dark-800"
    },
};

export const ASSIGNMENT_STATUS_OPTIONS = [
    { value: "", label: "Tất cả trạng thái" },
    ...Object.entries(ASSIGNMENT_STATUS_MAP).map(([value, info]) => ({
        value: value.toString(),
        label: info.label
    }))
];