function AppraisalDashboardPage() {
    return (
        <div>
            <h1>Appraisal Dashboard</h1>
        </div>
    );
}

export default AppraisalDashboardPage;


// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import { Layout } from "../../components/layout";
// import Button from "../../components/ui/Button";
// import Card from "../../components/ui/Card";
// import Input from "../../components/ui/Input";
// import Select from "../../components/ui/Select";
// import NestedTechnicalSpecsEditor from "../../components/forms/NestedTechnicalSpecsEditor";

// import { IssueCategory, ISSUE_CATEGORY_LABELS } from "@/constants/enum/IssueCategory";
// import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
// import { IssueStatus, ISSUE_STATUS_LABELS } from "@/constants/enum/IssueStatus";
// import { documentService } from "../../services/documentService";
// import { feedbackService } from "../../services/feedbackService";

// interface FeedbackFormState {
//     indicatorPath: string;
//     description: string;
//     issueCategory: IssueCategory;
//     severity: IssueSeverity;
// }

// const STATUS_STYLES: Record<number, string> = {
//     [IssueStatus.New]: "text-blue-400 bg-blue-900/20",
//     [IssueStatus.InProcessing]: "text-yellow-400 bg-yellow-900/20",
//     [IssueStatus.Closed]: "text-green-400 bg-green-900/20",
// };

// const SEVERITY_STYLES: Record<number, string> = {
//     [IssueSeverity.Minor]: "text-green-400 bg-green-900/20",
//     [IssueSeverity.Moderate]: "text-yellow-400 bg-yellow-900/20",
//     [IssueSeverity.Serious]: "text-orange-400 bg-orange-900/20",
//     [IssueSeverity.Critical]: "text-red-400 bg-red-900/20",
// };

// const AppraisalReviewPage = () => {
//     const navigate = useNavigate();
//     const { documentId, versionId } = useParams<{ documentId: string; versionId: string }>();
//     const descriptionRef = useRef<HTMLTextAreaElement>(null);

//     const [data, setData] = useState<any>({ document: null, version: null, issues: [] });
//     const [loading, setLoading] = useState({ page: true, submit: false });

//     const [newFeedback, setNewFeedback] = useState<FeedbackFormState>({
//         indicatorPath: "",
//         description: "",
//         issueCategory: IssueCategory.TechnicalError,
//         severity: IssueSeverity.Moderate
//     });

//     const options = useMemo(() => ({
//         categories: Object.entries(ISSUE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l })),
//         severities: Object.entries(ISSUE_SEVERITY_LABELS).map(([v, l]) => ({ value: v, label: l }))
//     }), []);

//     const loadData = useCallback(async () => {
//         if (!documentId) return;
//         setLoading(p => ({ ...p, page: true }));
//         try {
//             const [docDetail, feedbackPaged] = await Promise.all([
//                 documentService.getDocumentById(documentId),
//                 feedbackService.getByDocument(documentId, 1, 100)
//             ]);

//             let specsObj = {};
//             const rawSpecs = docDetail.currentVersion?.technicalSpecsJson;
//             if (rawSpecs) {
//                 specsObj = typeof rawSpecs === "string" ? JSON.parse(rawSpecs) : rawSpecs;
//             }

//             setData({
//                 document: docDetail,
//                 version: { ...docDetail.currentVersion, technicalSpecsJson: specsObj },
//                 issues: feedbackPaged.items || []
//             });
//         } catch (e) {
//             toast.error("Lỗi đồng bộ dữ liệu");
//             navigate("/appraisals");
//         } finally {
//             setLoading(p => ({ ...p, page: false }));
//         }
//     }, [documentId, navigate]);

//     useEffect(() => { loadData(); }, [loadData]);

//     const handleSelectPath = useCallback((path: string) => {
//         setNewFeedback(p => ({ ...p, indicatorPath: path }));
//         toast.success(`Đã chọn: ${path}`, { duration: 1000, icon: '📍' });
//         setTimeout(() => descriptionRef.current?.focus(), 100);
//     }, []);

//     const handleCreateFeedback = async () => {
//         if (!newFeedback.description.trim()) return toast.error("Nhập mô tả lỗi");
//         setLoading(p => ({ ...p, submit: true }));
//         try {
//             await feedbackService.addReviewIssue({
//                 ...newFeedback,
//                 documentId: documentId!,
//                 requestVersionId: versionId!
//             } as any);
//             toast.success("Đã thêm phản hồi");

//             setNewFeedback({
//                 indicatorPath: "",
//                 description: "",
//                 issueCategory: IssueCategory.TechnicalError,
//                 severity: IssueSeverity.Moderate
//             });
//             loadData();
//         } catch (e) {
//             toast.error("Gửi thất bại");
//         } finally {
//             setLoading(p => ({ ...p, submit: false }));
//         }
//     };

//     const handleAction = async (issueId: string, action: 1 | 2) => {
//         setLoading(p => ({ ...p, submit: true }));
//         try {
//             await feedbackService.submitAction({ issueId, action, content: "", attachmentIds: [] });
//             toast.success("Thành công");
//             loadData();
//         } finally { setLoading(p => ({ ...p, submit: false })); }
//     };

//     if (loading.page) return <div className="p-20 text-center animate-pulse text-slate-500">Đang tải...</div>;

//     return (
//         <Layout>
//             <div className="max-w-[1600px] mx-auto p-6 space-y-8">
//                 <div className="flex justify-between items-center border-b border-slate-800 pb-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-white">Thẩm Định Kỹ Thuật</h1>
//                         <p className="text-slate-400 text-sm mt-1">
//                             <span className="text-primary-400 font-mono mr-2">[{data.document?.documentCode}]</span>
//                             {data.document?.title}
//                         </p>
//                     </div>
//                     <Button variant="ghost" onClick={() => navigate(-1)}>← Quay lại</Button>
//                 </div>

//                 <div className="grid lg:grid-cols-12 gap-8 items-start">
//                     <div className="lg:col-span-5 lg:sticky lg:top-6">
//                         <Card title="Cấu trúc chỉ tiêu kỹ thuật">
//                             <NestedTechnicalSpecsEditor
//                                 value={JSON.stringify(data.version?.technicalSpecsJson || {})}
//                                 onSelectPath={handleSelectPath}
//                                 onChange={(val) => setData((p: any) => ({
//                                     ...p, version: { ...p.version, technicalSpecsJson: JSON.parse(val) }
//                                 }))}
//                             />
//                         </Card>
//                     </div>

//                     <div className="lg:col-span-7 space-y-6">
//                         <Card title="Ghi nhận sai lệch" className="border-l-4 border-primary-500">
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                                 <Input
//                                     label="Vị trí lỗi (Path)"
//                                     value={newFeedback.indicatorPath}
//                                     readOnly
//                                     placeholder="Chọn 📍 từ bên trái"
//                                     className="bg-slate-950 font-mono text-primary-400"
//                                 />
//                                 <Select
//                                     label="Phân loại"
//                                     options={options.categories}
//                                     value={newFeedback.issueCategory.toString()}
//                                     onChange={v => setNewFeedback(p => ({ ...p, issueCategory: Number(v) as IssueCategory }))}
//                                 />
//                             </div>
//                             <textarea
//                                 ref={descriptionRef}
//                                 className="w-full p-4 bg-slate-950 rounded-xl text-sm border border-slate-800 focus:ring-1 focus:ring-primary-500 outline-none text-slate-200"
//                                 rows={4}
//                                 placeholder="Mô tả nội dung cần điều chỉnh..."
//                                 value={newFeedback.description}
//                                 onChange={e => setNewFeedback(p => ({ ...p, description: e.target.value }))}
//                             />
//                             <Button className="w-full mt-4" isLoading={loading.submit} onClick={handleCreateFeedback}>
//                                 Gửi yêu cầu thẩm định
//                             </Button>
//                         </Card>

//                         <div className="space-y-4">
//                             <h3 className="text-sm font-bold text-slate-500 uppercase px-1">Danh sách ghi chú ({data.issues.length})</h3>
//                             {data.issues.map((item: any) => (
//                                 <IssueRow key={item.id} item={item} onAction={handleAction} disabled={loading.submit} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// const IssueRow = ({ item, onAction, disabled }: any) => (
//     <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex justify-between items-start group hover:border-slate-600 transition-all">
//         <div className="space-y-2">
//             <div className="flex gap-2 items-center flex-wrap">
//                 {item.indicatorPath && <code className="text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">📍 {item.indicatorPath}</code>}
//                 <Badge className={SEVERITY_STYLES[item.severity]}>{ISSUE_SEVERITY_LABELS[item.severity as IssueSeverity]}</Badge>
//                 <Badge className={STATUS_STYLES[item.status]}>{ISSUE_STATUS_LABELS[item.status as IssueStatus]}</Badge>
//             </div>
//             <p className="text-slate-300 text-sm">{item.description}</p>
//         </div>

//         {item.status === IssueStatus.New && (
//             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
//                 <button onClick={() => onAction(item.id, 1)} disabled={disabled} className="text-green-500 hover:bg-green-500/10 p-2 rounded">✓</button>
//                 <button onClick={() => onAction(item.id, 2)} disabled={disabled} className="text-red-500 hover:bg-red-500/10 p-2 rounded">✕</button>
//             </div>
//         )}
//     </div>
// );

// const Badge = ({ children, className }: any) => (
//     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${className}`}>{children}</span>
// );

// export default AppraisalReviewPage;


