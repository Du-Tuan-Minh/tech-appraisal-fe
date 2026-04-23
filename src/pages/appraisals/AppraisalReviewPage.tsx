import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import NestedTechnicalSpecsEditor from "../../components/forms/NestedTechnicalSpecsEditor";

import { IssueCategory, ISSUE_CATEGORY_LABELS } from "@/constants/enum/IssueCategory";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
import { IssueStatus, ISSUE_STATUS_LABELS } from "@/constants/enum/IssueStatus";
import { ISSUE_SEVERITY_MAP } from "@/constants/mapping/ui-mapping";

import { documentService } from "../../services/documentService";
import { signingService } from "../../services/signingService";
import { feedbackService } from "../../services/feedbackService";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/constants/enum/UserRole";
import type { FeedbackIssueResponseDto } from "../../types/feedback";
import type { PagedResult } from "../../types/paginationResult";
import FeedbackList from "@/components/forms/FeedbackList";
import { appraisalService } from "@/services/appraisalService";
import { ReviewerStatus } from "@/constants/enum/ReviewerStatus";

interface FeedbackFormState {
    indicatorPath: string;
    description: string;
    issueCategory: IssueCategory;
    severity: IssueSeverity;
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${className}`}>{children}</span>
);

const IssueRow: React.FC<{ item: any; onDelete?: () => void; isHistory?: boolean }> = ({ item, onDelete, isHistory }) => {
    const severityInfo = ISSUE_SEVERITY_MAP[item.severity as IssueSeverity] || { label: 'Unknown', color: 'bg-gray-500' };

    return (
        <div className={`p-3 border rounded-xl flex justify-between items-start group transition-all ${isHistory ? 'bg-dark-900/20 border-dark-700' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
            <div className="space-y-1.5 w-full text-left">
                <div className="flex gap-2 items-center flex-wrap">
                    {item.indicatorPath && (
                        <code className="text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded truncate max-w-[200px]">
                            📍 {item.indicatorPath.split('.').pop()}
                        </code>
                    )}
                    <Badge className={severityInfo.color}>{ISSUE_SEVERITY_LABELS[item.severity as IssueSeverity]}</Badge>
                    {isHistory && (
                        <span className="text-[10px] text-slate-500 italic ml-auto">
                            {ISSUE_STATUS_LABELS[item.status as IssueStatus]}
                        </span>
                    )}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{item.description}</p>
            </div>
            {onDelete && (
                <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-red-500 p-1.5 hover:bg-red-500/10 rounded transition-all ml-2">✕</button>
            )}
        </div>
    );
};

const AppraisalReviewPage = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const { documentId, versionId, reviewerId } = useParams<{
        documentId: string;
        versionId: string;
        reviewerId?: string;
    }>();

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const [data, setData] = useState<any>({ document: null, version: null });
    const [pendingIssues, setPendingIssues] = useState<any[]>([]);

    const [historyData, setHistoryData] = useState<PagedResult<FeedbackIssueResponseDto> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    const [loading, setLoading] = useState({ page: true, submit: false, history: false });

    const [newFeedback, setNewFeedback] = useState<FeedbackFormState>({
        indicatorPath: "",
        description: "",
        issueCategory: IssueCategory.InconsistentLogic,
        severity: IssueSeverity.Moderate
    });

    const isDirector = role === UserRole.Director;

    const loadHistory = useCallback(async (page: number) => {
        if (!versionId) return;
        setLoading(p => ({ ...p, history: true }));
        try {
            const res = await feedbackService.getByVersion(versionId, page, PAGE_SIZE);
            setHistoryData(res);
        } catch (e) {
            console.error("Failed to load history feedback");
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    }, [versionId]);

    const loadData = useCallback(async () => {
        if (!documentId) return;
        setLoading(p => ({ ...p, page: true }));
        try {
            const docDetail = await documentService.getDocumentById(documentId);
            const version = versionId
                ? await documentService.getVersionDetail(versionId)
                : (docDetail.currentVersionId ? await documentService.getVersionDetail(docDetail.currentVersionId) : null);

            setData({
                document: docDetail,
                version: { ...version, technicalSpecsJson: typeof version?.technicalSpecsJson === 'string' ? JSON.parse(version.technicalSpecsJson) : version?.technicalSpecsJson }
            });
            await loadHistory(1);
        } catch (e) {
            toast.error("Lỗi tải dữ liệu");
            navigate("/my-tasks");
        } finally {
            setLoading(p => ({ ...p, page: false }));
        }
    }, [documentId, versionId, navigate, loadHistory]);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        if (!loading.page && currentPage > 1) {
            loadHistory(currentPage);
        }
    }, [currentPage, loadHistory, loading.page]);

    const handleAddPendingIssue = () => {
        if (!newFeedback.description.trim()) return toast.error("Nhập mô tả lỗi");
        const issue = { ...newFeedback, id: Date.now().toString(), documentId, requestVersionId: versionId };
        setPendingIssues(p => [issue, ...p]);
        setNewFeedback(p => ({ ...p, description: "", indicatorPath: "" }));
        toast.success("Đã thêm vào danh sách tạm");
    };

    const handleReview = async () => {
        if (!reviewerId) return;

        setLoading(p => ({ ...p, submit: true }));
        try {
            await appraisalService.submitReview(reviewerId, {
                reviewerId,
                status: ReviewerStatus.Completed,
                comment: "Đã hoàn thành thẩm định",
                newIssues: pendingIssues.map(({ id, ...rest }) => rest),
                attachmentIds: []
            });

            toast.success("Đã gửi kết quả thẩm định");
            navigate("/appraisals/my-tasks");
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Lỗi hệ thống");
        } finally {
            setLoading(p => ({ ...p, submit: false }));
        }
    };

    const handleApprove = async () => {
        if (!window.confirm("Xác nhận thông qua?")) return;
        setLoading(p => ({ ...p, submit: true }));
        try {
            if (isDirector) {
                await signingService.approveSign({ documentId: documentId!, comment: "Director Approved" });
                toast.success("Đã ký duyệt");
            } else {
                await documentService.submitForAppraisal(documentId!);
                toast.success("Đã gửi thẩm định");
            }
            navigate("/appraisals/my-tasks");
        } catch (e: any) {
            toast.error(e.response?.data?.message || "Lỗi hệ thống");
        } finally {
            setLoading(p => ({ ...p, submit: false }));
        }
    };

    const handleRowClick = (id: string) => {
        navigate(`/appraisals/feedback-detail/${id}`);
    };

    const handleReject = async () => {
        if (pendingIssues.length === 0) return toast.error("Cần ít nhất một lỗi để Reject");
        setLoading(p => ({ ...p, submit: true }));
        try {
            await signingService.reject({
                documentId: documentId!,
                comment: "Vui lòng điều chỉnh theo danh sách lỗi.",
                newIssues: pendingIssues.map(({ id, ...rest }) => rest),
                attachmentIds: []
            });
            toast.success("Đã từ chối và yêu cầu sửa");
            navigate("/appraisals/my-tasks");
        } catch (e) { toast.error("Thất bại"); }
        finally { setLoading(p => ({ ...p, submit: false })); }
    };

    if (loading.page) return <div className="p-20 text-center animate-pulse text-slate-500 text-sm">Đang tải hồ sơ...</div>;

    return (
        <Layout>
            <div className="max-w-[1650px] mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {isDirector ? "Ký Phê Duyệt" : "Thẩm Định Kỹ Thuật"}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 text-left">
                            <span className="text-primary-400 font-mono text-xs bg-primary-500/10 px-2 py-0.5 rounded">
                                {data.document?.documentCode}
                            </span>
                            <span className="text-slate-400 text-sm truncate max-w-md">{data.document?.title}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">

                        {reviewerId ? (
                            // STAFF
                            <Button
                                variant="primary"
                                onClick={handleReview}
                                isLoading={loading.submit}
                            >
                                ✓ Hoàn thành review
                            </Button>
                        ) : (
                            // DIRECTOR / MANAGER
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                                    onClick={handleReject}
                                    isLoading={loading.submit}
                                >
                                    ✕ Từ chối
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleApprove}
                                    isLoading={loading.submit}
                                >
                                    ✓ Thông qua
                                </Button>
                            </>
                        )}

                        <div className="w-px h-8 bg-slate-800 mx-2" />

                        <Button variant="ghost" onClick={() => navigate(-1)}>
                            Hủy
                        </Button>

                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 lg:sticky lg:top-6">
                        <Card title="Cấu trúc chỉ tiêu" className="shadow-2xl h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                            <div className="overflow-y-auto pr-2 custom-scrollbar">
                                <NestedTechnicalSpecsEditor
                                    value={data.version?.technicalSpecsJson || {}}
                                    onSelectPath={(path) => {
                                        setNewFeedback(p => ({ ...p, indicatorPath: path }));
                                        descriptionRef.current?.focus();
                                    }}
                                    readOnly
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <Card title="Ghi nhận sai lệch" className="border-l-4 border-primary-500">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Input label="Vị trí (Path)" value={newFeedback.indicatorPath} readOnly placeholder="Chọn 📍 bên trái" className="bg-slate-950 font-mono text-primary-400 text-xs" />
                                <Select
                                    label="Phân loại"
                                    options={Object.entries(ISSUE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                                    value={newFeedback.issueCategory.toString()}
                                    onChange={v => setNewFeedback(p => ({ ...p, issueCategory: Number(v) as IssueCategory }))}
                                />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nội dung chi tiết</label>
                                <textarea
                                    ref={descriptionRef}
                                    className="w-full p-3 bg-slate-950 rounded-xl text-sm border border-slate-800 focus:ring-1 focus:ring-primary-500 outline-none text-slate-200"
                                    rows={3}
                                    placeholder="Nhập nội dung sai lệch..."
                                    value={newFeedback.description}
                                    onChange={e => setNewFeedback(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>
                            <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 border-none text-xs" variant="secondary" onClick={handleAddPendingIssue}>
                                + Thêm vào danh sách tạm
                            </Button>
                        </Card>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lỗi dự thảo ({pendingIssues.length})</h3>
                                {pendingIssues.length > 0 && <button onClick={() => setPendingIssues([])} className="text-[10px] text-red-400 hover:underline font-medium">Xóa hết</button>}
                            </div>
                            {pendingIssues.length === 0 ? (
                                <div className="p-10 text-center border border-dashed border-slate-800 rounded-2xl text-slate-600 bg-slate-900/10 italic text-[11px]">Chưa có lỗi ghi nhận.</div>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    {pendingIssues.map((item) => (
                                        <IssueRow key={item.id} item={item} onDelete={() => setPendingIssues(p => p.filter(x => x.id !== item.id))} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col h-[calc(100vh-200px)] border-l border-slate-800 pl-4">
                        <div className="flex-1 overflow-hidden">
                            <FeedbackList
                                data={historyData?.items || []}
                                isLoading={loading.history}
                                totalCount={historyData?.totalCount || 0}
                                totalPages={historyData?.totalPages || 0}
                                currentPage={currentPage}

                                onPageChange={setCurrentPage}
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AppraisalReviewPage;