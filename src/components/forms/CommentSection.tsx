import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import FormField from "../ui/FormField";
import { toast } from "react-hot-toast";

import { feedbackCommentService } from "../../services/feedbackCommentService";
import type {
    FeedbackCommentDto,
    CreateFeedbackCommentRequest
} from "../../types/comment";

interface CommentSectionProps {
    feedbackIssueId: string;
    className?: string;
}

const CommentSection = ({ feedbackIssueId, className = "" }: CommentSectionProps) => {
    const [comments, setComments] = useState<FeedbackCommentDto[]>([]);
    const [content, setContent] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await feedbackCommentService.getByIssue(feedbackIssueId, 1, 50);
            setComments(res.items);
        } catch {
            toast.error("Không tải được bình luận");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [feedbackIssueId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const handleCreate = async () => {
        if (!content.trim()) return toast.error("Nhập nội dung");

        setSubmitting(true);
        try {
            const payload: CreateFeedbackCommentRequest = {
                feedbackIssueId,
                content: content.trim(),
                parentCommentId: null,
                attachmentIds: undefined
            };

            const res = await feedbackCommentService.create(payload);

            setComments(prev => [res, ...prev]);
            setContent("");
            toast.success("Đã gửi bình luận");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim()) return toast.error("Nhập nội dung trả lời");

        setSubmitting(true);
        try {
            const payload: CreateFeedbackCommentRequest = {
                feedbackIssueId,
                content: replyContent.trim(),
                parentCommentId: parentId
            };

            const res = await feedbackCommentService.create(payload);

            setComments(prev =>
                prev.map(c =>
                    c.id === parentId
                        ? { ...c, replies: [...c.replies, res] }
                        : c
                )
            );

            setReplyContent("");
            setReplyingTo(null);
            toast.success("Đã trả lời");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (d: string) =>
        new Date(d).toLocaleString("vi-VN");

    const CommentItem = ({
        comment,
        isReply = false
    }: {
        comment: FeedbackCommentDto;
        isReply?: boolean;
    }) => (
        <div className={`${isReply ? "ml-10 mt-3" : "mb-4"}`}>
            <Card className="p-4 bg-dark-900/50 border-dark-700">

                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-white font-medium">
                        {comment.userName}
                    </div>
                    <div className="text-xs text-gray-400">
                        {formatTime(comment.createdAt)}
                    </div>
                </div>

                <div className="text-gray-300 text-sm whitespace-pre-wrap">
                    {comment.content}
                </div>

                {!isReply && (
                    <div className="mt-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setReplyingTo(
                                    replyingTo === comment.id ? null : comment.id
                                )
                            }
                        >
                            Trả lời
                        </Button>
                    </div>
                )}

                {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                        <textarea
                            className="w-full p-2 rounded bg-dark-800 border border-dark-700 text-white"
                            rows={3}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleReply(comment.id)}
                                isLoading={submitting}
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>
                )}

                {comment.replies?.map(r => (
                    <CommentItem key={r.id} comment={r} isReply />
                ))}
            </Card>
        </div>
    );

    return (
        <div className={className}>
            <Card className="p-6">

                <h3 className="text-white font-semibold mb-4">
                    Bình luận ({comments.length})
                </h3>

                <FormField label="Viết bình luận">
                    <textarea
                        className="w-full p-3 rounded bg-dark-800 border border-dark-700 text-white"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </FormField>

                <div className="flex justify-end mt-3">
                    <Button
                        variant="primary"
                        onClick={handleCreate}
                        isLoading={submitting}
                    >
                        Gửi
                    </Button>
                </div>

                <div className="mt-6 space-y-2 max-h-[500px] overflow-y-auto">
                    {loading ? (
                        <div className="text-gray-400">Đang tải...</div>
                    ) : (
                        comments.map(c => (
                            <CommentItem key={c.id} comment={c} />
                        ))
                    )}
                    <div ref={endRef} />
                </div>

            </Card>
        </div>
    );
};

export default CommentSection;