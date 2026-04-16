import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import { documentService } from "../../services/documentService";
import { signingService } from "../../services/signingService";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/constants/enum/UserRole";


interface FeedbackFormState {
    indicatorPath: string;
    description: string;
    issueCategory: IssueCategory;
    severity: IssueSeverity;
}

interface PendingIssue extends FeedbackFormState {
    id: string;
    documentId: string;
    requestVersionId: string;
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${className}`}>{children}</span>
);

const IssueRow: React.FC<{ item: PendingIssue; onDelete: () => void; disabled?: boolean }> = ({ item, onDelete, disabled }) => (
    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex justify-between items-start group hover:border-slate-600 transition-all">
        <div className="space-y-2">
            <div className="flex gap-2 items-center flex-wrap">
                {item.indicatorPath && <code className="text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">📍 {item.indicatorPath}</code>}
                <Badge className="text-orange-400 bg-orange-900/20">{ISSUE_SEVERITY_LABELS[item.severity]}</Badge>
            </div>
            <p className="text-slate-300 text-sm">{item.description}</p>
        </div>
        <button onClick={onDelete} disabled={disabled} className="opacity-0 group-hover:opacity-100 text-red-500 p-2 hover:bg-red-500/10 rounded transition-all">✕</button>
    </div>
);

const AppraisalReviewPage = () => {
    const navigate = useNavigate();
    const { role } = useAuth();
    const { documentId, versionId } = useParams<{ documentId: string; versionId: string }>();
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const [data, setData] = useState<any>({ document: null, version: null });
    const [pendingIssues, setPendingIssues] = useState<PendingIssue[]>([]);
    const [loading, setLoading] = useState({ page: true, submit: false });

    const isDirector = role === UserRole.Director;
    const [newFeedback, setNewFeedback] = useState<FeedbackFormState>({
        indicatorPath: "",
        description: "",
        issueCategory: IssueCategory.TechnicalError,
        severity: IssueSeverity.Moderate
    });

    const options = useMemo(() => ({
        categories: Object.entries(ISSUE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
        severities: Object.entries(ISSUE_SEVERITY_LABELS).map(([v, l]) => ({ value: v, label: l }))
    }), []);

    const safeParseJson = (data: any) => {
        if (!data) return {};
        if (typeof data === "object") return data;

        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    };

    const loadData = useCallback(async () => {
        if (!documentId) return;

        setLoading(p => ({ ...p, page: true }));

        try {
            const docDetail = await documentService.getDocumentById(documentId);

            let version = null;

            if (versionId) {
                version = await documentService.getVersionDetail(versionId);
            } else if (docDetail.currentVersionId) {
                version = await documentService.getVersionDetail(docDetail.currentVersionId);
            }

            const parsedSpecs = safeParseJson(version?.technicalSpecsJson);

            setData({
                document: docDetail,
                version: {
                    ...version,
                    technicalSpecsJson: parsedSpecs
                }
            });

        } catch (e) {
            console.error(e);
            toast.error("Lỗi tải dữ liệu");
            navigate("/my-tasks");
        } finally {
            setLoading(p => ({ ...p, page: false }));
        }
    }, [documentId, versionId, navigate]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSelectPath = useCallback((path: string) => {
        setNewFeedback(p => ({ ...p, indicatorPath: path }));
        toast.success(`Đã chọn: ${path}`, { duration: 1000, icon: '📍' });
        setTimeout(() => descriptionRef.current?.focus(), 100);
    }, []);

    const handleAddPendingIssue = () => {
        if (!newFeedback.description.trim()) return toast.error("Nhập mô tả lỗi");

        const issue: PendingIssue = {
            ...newFeedback,
            documentId: documentId!,
            requestVersionId: versionId!,
            id: Date.now().toString()
        };

        setPendingIssues(p => [issue, ...p]);
        setNewFeedback(p => ({ ...p, description: "", indicatorPath: "" }));
        toast.success("Đã thêm lỗi vào danh sách");
    };

    const handleApprove = async () => {
        const confirmMsg = isDirector
            ? "Xác nhận ký duyệt và gửi sang các trung tâm thẩm định phối hợp?"
            : "Xác nhận thông qua thẩm định nội bộ cho tài liệu này?";

        if (!window.confirm(confirmMsg)) return;
        setLoading(p => ({ ...p, submit: true }));
        try {
            if (isDirector) {
                await signingService.approveSign({
                    documentId: documentId!,
                    comment: "Director đã ký duyệt. Chuyển tiếp thẩm định đơn vị phối hợp."
                });
                toast.success("Đã ký duyệt và gửi yêu cầu thẩm định thành công");
            } else {
                await documentService.submitForAppraisal(documentId!);
                toast.success("Phê duyệt nội bộ thành công");
            }
            navigate("/appraisals/my-tasks", { replace: true });
        } catch (e: any) {
            toast.error(e.response?.data?.message);
        } finally {
            setLoading(p => ({ ...p, submit: false }));
        }
    };

    const handleReject = async () => {
        if (pendingIssues.length === 0) return toast.error("Cần ít nhất một lỗi để Reject");
        if (!window.confirm(`Từ chối và yêu cầu chỉnh sửa với ${pendingIssues.length} lỗi?`)) return;

        setLoading(p => ({ ...p, submit: true }));
        try {
            await signingService.reject({
                documentId: documentId!,
                comment: "Tài liệu không đạt. Vui lòng chỉnh sửa theo danh sách lỗi.",
                newIssues: pendingIssues.map(({ id, ...rest }) => rest),
                attachmentIds: []
            });
            toast.success("Đã từ chối");
            navigate("/appraisals");
        } catch (e) {
            toast.error("Gửi yêu cầu thất bại");
        } finally {
            setLoading(p => ({ ...p, submit: false }));
        }
    };

    if (loading.page) return <div className="p-20 text-center animate-pulse text-slate-500 font-medium">Đang tải hồ sơ...</div>;

    return (
        <Layout>
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{isDirector ? "Ký Phê Duyệt Tài Liệu" : "Thẩm Định Kỹ Thuật"}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-primary-400 font-mono text-xs bg-primary-500/10 px-2 py-0.5 rounded">
                                {data.document?.documentCode}
                            </span>
                            <span className="text-slate-400 text-sm truncate max-w-md">{data.document?.title}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={handleReject} isLoading={loading.submit}>
                            ✕ Từ chối
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApprove}
                            isLoading={loading.submit}
                            disabled={pendingIssues.length > 0}
                        >
                            {isDirector ? "✓ Ký & Gửi thẩm định" : "✓ Thông qua"}
                        </Button>
                        <div className="w-px h-8 bg-slate-800 mx-2" />
                        <Button variant="ghost" onClick={() => navigate(-1)}>Hủy bỏ</Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-6">
                        <Card title="Cấu trúc chỉ tiêu kỹ thuật" className="shadow-2xl shadow-black/50">
                            <NestedTechnicalSpecsEditor
                                value={data.version?.technicalSpecsJson || {}}
                                onSelectPath={handleSelectPath}
                                readOnly
                            />
                        </Card>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <Card title="Ghi nhận sai lệch" className="border-l-4 border-primary-500 bg-slate-900/30">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Input label="Vị trí lỗi (Path)" value={newFeedback.indicatorPath} readOnly placeholder="Chọn 📍 bên trái" className="bg-slate-950 font-mono text-primary-400 text-xs" />

                                <Select
                                    label="Phân loại"
                                    options={options.categories}
                                    value={newFeedback.issueCategory.toString()}
                                    onChange={v => setNewFeedback(p => ({ ...p, issueCategory: Number(v) as IssueCategory }))}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nội dung yêu cầu điều chỉnh</label>
                                <textarea
                                    ref={descriptionRef}
                                    className="w-full p-4 bg-slate-950 rounded-xl text-sm border border-slate-800 focus:ring-1 focus:ring-primary-500 outline-none text-slate-200 transition-all"
                                    rows={4}
                                    placeholder="Nhập chi tiết sai lệch kỹ thuật..."
                                    value={newFeedback.description}
                                    onChange={e => setNewFeedback(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 border-none" variant="secondary" onClick={handleAddPendingIssue}>
                                + Thêm lỗi vào danh sách tạm
                            </Button>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Danh sách lỗi dự thảo ({pendingIssues.length})</h3>
                                {pendingIssues.length > 0 && <button onClick={() => setPendingIssues([])} className="text-[10px] text-red-400 hover:underline">Xóa tất cả</button>}
                            </div>

                            {pendingIssues.length === 0 ? (
                                <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 bg-slate-900/10">
                                    <p className="italic text-sm">Chưa có lỗi nào được ghi nhận.</p>
                                    <p className="text-[10px] mt-1 text-slate-700">Tài liệu sẽ được đánh giá là "Đạt" nếu bạn nhấn Approve.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingIssues.map((item) => (
                                        <IssueRow key={item.id} item={item} onDelete={() => setPendingIssues(p => p.filter(x => x.id !== item.id))} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AppraisalReviewPage;