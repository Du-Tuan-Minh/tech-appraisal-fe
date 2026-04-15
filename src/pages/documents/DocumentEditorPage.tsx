import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { TechnicalDocumentDetailDto, TechnicalDocumentUpdateDto } from "@/types/document";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { DocumentStatus, DOCUMENT_STATUS_LABELS } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";

const DocumentEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [doc, setDoc] = useState<TechnicalDocumentDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);

    const [formData, setFormData] = useState<TechnicalDocumentUpdateDto | null>(null);
    const [jsonString, setJsonString] = useState<string>("{}");

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).filter(v => typeof v === 'number').map(v => ({
            value: String(v),
            label: DOCUMENT_TYPE_LABELS[v as DocumentType]
        })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity).filter(v => typeof v === 'number').map(v => ({
            value: String(v),
            label: ISSUE_SEVERITY_LABELS[v as IssueSeverity]
        })), []);

    const fetchDoc = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await documentService.getDocumentById(id);
            setDoc(res);

            // Map dữ liệu từ Backend vào State
            setFormData({
                title: res.title,
                description: res.description,
                type: res.type,
                priority: res.priority,
                technicalSpecs: res.currentVersion?.technicalSpecsJson || {}
            });

            setJsonString(JSON.stringify(res.currentVersion?.technicalSpecsJson || {}, null, 4));
        } catch (err) {
            toast.error("Không thể tải tài liệu");
            navigate("/documents");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchDoc(); }, [fetchDoc]);


    const prepareSubmitData = (): TechnicalDocumentUpdateDto | null => {
        if (!formData) return null;
        try {
            const parsedSpecs = JSON.parse(jsonString);
            return { ...formData, technicalSpecs: parsedSpecs };
        } catch (e) {
            toast.error("Cú pháp JSON không hợp lệ. Vui lòng kiểm tra lại.");
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = prepareSubmitData();
        if (!id || !data) return;

        setIsSaving(true);
        try {
            await documentService.updateDocument(id, data);
            toast.success("Đã lưu bản nháp");
            await fetchDoc();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lưu thất bại");
        } finally { setIsSaving(false); }
    };

    const handleSendToAppraisal = async () => {
        const data = prepareSubmitData();
        if (!id || !data) return;

        if (!window.confirm("Hệ thống sẽ lưu nội dung hiện tại và gửi đi thẩm định. Xác nhận?")) return;

        setIsSubmittingAction(true);
        try {
            await documentService.updateDocument(id, data);
            await documentService.submitForAppraisal(id);
            toast.success("Hồ sơ đã được gửi đi thẩm định!");
            navigate("/documents");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Gửi thẩm định thất bại");
        } finally {
            setIsSubmittingAction(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!doc || !formData) return <Layout><div className="text-center p-20 text-white">Dữ liệu không tồn tại</div></Layout>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white italic">Biên tập: <span className="text-primary-400 not-italic">{doc.documentCode}</span></h1>
                    <Button variant="ghost" onClick={() => navigate("/documents")}>← Quay lại</Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                        <Card className="p-6 space-y-4 border-l-4 border-primary-500 bg-dark-900/40">
                            <Input
                                label="Tiêu đề"
                                value={formData.title}
                                onChange={(v) => setFormData(p => p ? ({ ...p, title: v }) : null)}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Phân loại"
                                    options={typeOptions}
                                    value={String(formData.type)}
                                    onChange={(v) => setFormData(p => p ? ({ ...p, type: Number(v) as DocumentType }) : null)}
                                />
                                <Select
                                    label="Mức độ ưu tiên"
                                    options={priorityOptions}
                                    value={String(formData.priority)}
                                    onChange={(v) => setFormData(p => p ? ({ ...p, priority: Number(v) as IssueSeverity }) : null)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-primary-400 mb-2 uppercase tracking-wider">Mô tả chi tiết</label>
                                <textarea
                                    className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none min-h-[100px]"
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData(p => p ? ({ ...p, description: e.target.value }) : null)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-accent-green mb-2 uppercase tracking-widest font-bold">Thông số kỹ thuật (JSON Editor)</label>
                                <textarea
                                    className="w-full bg-dark-950 border border-dark-700 rounded-lg p-4 text-accent-green font-mono text-sm focus:border-accent-green outline-none min-h-[400px] shadow-inner"
                                    value={jsonString}
                                    onChange={(e) => setJsonString(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </Card>

                        <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
                            <Button variant="ghost" onClick={() => navigate("/documents")} disabled={isSaving}>Hủy bỏ</Button>
                            <Button variant="primary" type="submit" isLoading={isSaving}>Cập nhật bản nháp</Button>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <Card className="p-5 space-y-4 bg-dark-900/60 border-none shadow-xl">
                            <h3 className="text-sm font-bold text-white uppercase border-b border-dark-700 pb-2">Thông tin hệ thống</h3>
                            <MetaRow label="Trạng thái" value={DOCUMENT_STATUS_LABELS[doc.status]} badgeClass="text-primary-400" />
                            <MetaRow label="Yêu cầu bởi" value={doc.requesterName} />
                            <MetaRow label="Người xử lý" value={doc.currentHandlerName || "Chưa phân công"} />
                            <MetaRow label="Phòng ban" value={doc.departmentName} />
                            <MetaRow label="Ngày tạo" value={new Date(doc.createdAt).toLocaleDateString("vi-VN")} />
                        </Card>

                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full shadow-lg shadow-primary-500/20"
                                onClick={handleSendToAppraisal}
                                isLoading={isSubmittingAction}
                                disabled={isSaving}
                            >
                                🚀 Gửi Thẩm Định
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => navigate(`/documents/${id}/versions`)}>📜 Phiên bản</Button>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const MetaRow = ({ label, value, badgeClass }: { label: string; value: string; badgeClass?: string }) => (
    <div className="flex justify-between items-center text-[11px] py-0.5">
        <span className="text-gray-500">{label}:</span>
        <span className={badgeClass ? `font-bold ${badgeClass}` : "text-gray-300 font-medium"}>{value}</span>
    </div>
);

const LoadingSpinner = () => (
    <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
    </div>
);

export default DocumentEditorPage;