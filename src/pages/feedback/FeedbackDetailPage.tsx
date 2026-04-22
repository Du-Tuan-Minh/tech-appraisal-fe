import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Layout } from "../../components/layout";
import CommentSection from "../../components/forms/CommentSection";

import { feedbackService } from "../../services/feedbackService";
import type { FeedbackIssueDetailDto } from "@/types/feedback";

import {
    ISSUE_SEVERITY_MAP,
    DOCUMENT_STATUS_MAP
} from "../../constants/mapping/ui-mapping";

const FeedbackDetailPage = () => {
    const navigate = useNavigate();
    const { issueId } = useParams<{ issueId: string }>();

    const [feedback, setFeedback] = useState<FeedbackIssueDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeedbackDetail = useCallback(async () => {
        if (!issueId) return;
        try {
            setIsLoading(true);
            const data = await feedbackService.getDetail(issueId);
            setFeedback(data);
        } catch (err) {
            toast.error("Không thể tải thông tin chi tiết feedback.");
            navigate("/feedback");
        } finally {
            setIsLoading(false);
        }
    }, [issueId, navigate]);

    useEffect(() => {
        fetchFeedbackDetail();
    }, [fetchFeedbackDetail]);

    if (isLoading) return <LoadingSpinner />;
    if (!feedback) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono px-2 py-1 bg-primary-500/10 text-primary-400 rounded border border-primary-500/20">
                                ISSUE-{feedback.id.slice(0, 8).toUpperCase()}
                            </span>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Chi Tiết Phản Hồi</h1>
                        </div>
                        <p className="text-gray-400 font-medium">
                            Tài liệu: <span className="text-white">{feedback.documentTitle}</span>
                            <span className="mx-2 text-white/20">|</span>
                            Phiên bản: <span className="text-primary-400">v{feedback.versionNumber}</span>
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate("/feedback")} className="hover:bg-white/5">
                        ← Quay lại danh sách
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <section className="sticky top-6 space-y-6">
                            <Card className="p-6 bg-dark-900/40 border-white/5 backdrop-blur-md shadow-xl">
                                <h3 className="text-white font-semibold mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                    <div className="w-1 h-4 bg-primary-500 rounded-full" />
                                    Thông tin định danh
                                </h3>

                                <div className="space-y-5">
                                    <BadgeField
                                        label="Mức độ"
                                        config={ISSUE_SEVERITY_MAP[feedback.severity]}
                                    />
                                    <BadgeField
                                        label="Trạng thái"
                                        config={DOCUMENT_STATUS_MAP[feedback.status]}
                                    />
                                    <DetailItem label="Người báo cáo" value={feedback.reporterName} />
                                    <DetailItem
                                        label="Ngày tạo"
                                        value={new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                                    />
                                    <DetailItem
                                        label="Phòng ban phụ trách"
                                        value={feedback.assignedDepartmentName || "Chưa điều phối"}
                                    />
                                </div>
                            </Card>

                            <Card className="p-6 bg-primary-500/5 border-primary-500/10">
                                <label className="text-[10px] text-primary-400 font-bold uppercase tracking-widest block mb-2">
                                    Vị trí lỗi (Indicator Path)
                                </label>
                                <code className="text-xs text-primary-200 break-all leading-relaxed font-mono">
                                    {feedback.indicatorPath}
                                </code>
                            </Card>
                        </section>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <Card className="p-8 bg-dark-900/40 border-white/5">
                            <h2 className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-4">
                                Nội dung phản hồi
                            </h2>
                            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                                {feedback.description}
                            </p>
                        </Card>

                        <div className="border-t border-white/10 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-xl font-bold text-white">Thảo luận hệ thống</h2>
                                <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-gray-500">Live</span>
                            </div>
                            <CommentSection feedbackIssueId={feedback.id} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
        <span className="text-white font-medium">{value}</span>
    </div>
);

const BadgeField = ({ label, config }: { label: string; config: any }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config?.color || 'bg-gray-500 text-white'}`}>
            {config?.label || 'N/A'}
        </span>
    </div>
);

const LoadingSpinner = () => (
    <Layout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-primary-500/10 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-primary-400 font-mono text-xs tracking-[0.2em]">LOADING FEEDBACK...</p>
        </div>
    </Layout>
);

export default FeedbackDetailPage;