import type { AttachmentResponseDto } from "./attachment";
export interface FeedbackCommentDto {
    id: string;
    feedbackIssueId: string;
    userId: string;
    userName: string;
    avatarUrl: string | null;
    content: string;
    parentCommentId: string | null;
    createdAt: string;
    // chỉ 1 cấp theo BE
    replies: FeedbackCommentDto[];
    attachments: AttachmentResponseDto[];
}

export interface CreateFeedbackCommentRequest {
    feedbackIssueId: string;
    content: string;
    parentCommentId: string | null;
    attachmentIds?: string[];
}