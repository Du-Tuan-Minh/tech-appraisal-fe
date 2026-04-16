import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import Pagination from "@/components/ui/Pagination"; // Tái sử dụng component của bạn
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { TechnicalDocumentDetailDto, TechnicalDocumentUpdateDto } from "@/types/document";
import type { DocumentVersionDto } from "@/types/version";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { DocumentStatus, DOCUMENT_STATUS_LABELS } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
import { History, Save, Send, Eye } from "lucide-react";

const DocumentEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // States cho Document
    const [doc, setDoc] = useState<TechnicalDocumentDetailDto | null>(null);
    const [formData, setFormData] = useState<TechnicalDocumentUpdateDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // States cho Versions & Pagination
    const [versions, setVersions] = useState<DocumentVersionDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Bạn có thể điều chỉnh hoặc lấy từ API nếu BE hỗ trợ phân trang version

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

    // 1. Fetch thông tin Document
    const fetchDoc = useCallback(async () => {
        if (!id) return;
        try {
            const res = await documentService.getDocumentById(id);
            setDoc(res);
            setFormData({
                title: res.title,
                description: res.description,
                type: res.type,
                priority: res.priority,
                technicalSpecs: null,
            });
        } catch (err) {
            toast.error("Không thể tải tài liệu");
            navigate("/documents");
        }
    }, [id, navigate]);

    // 2. Fetch danh sách Versions
    const fetchVersions = useCallback(async () => {
        if (!id) return;
        try {
            const res = await documentService.getDocumentVersions(id);
            setVersions(res);
        } catch (err) {
            console.error("Lỗi tải danh sách phiên bản", err);
        }
    }, [id]);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await Promise.all([fetchDoc(), fetchVersions()]);
            setIsLoading(false);
        };
        init();
    }, [fetchDoc, fetchVersions]);

    // Logic phân trang cho danh sách version (Client-side pagination dựa trên component bạn cung cấp)
    const totalPages = Math.ceil(versions.length / itemsPerPage);
    const currentVersions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return versions.slice(start, start + itemsPerPage);
    }, [versions, currentPage]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData) return;
        setIsSaving(true);
        try {
            await documentService.updateDocument(id, formData);
            toast.success("Đã cập nhật thông tin hồ sơ");
            await fetchDoc();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Cập nhật thất bại");
        } finally { setIsSaving(false); }
    };

    // const handleSendToAppraisal = async () => {
    //     if (!id || !window.confirm("Gửi hồ sơ này đi thẩm định?")) return;
    //     try {
    //         await documentService.submitForAppraisal(id);
    //         toast.success("Đã gửi thẩm định thành công");
    //         navigate("/documents");
    //     } catch (err: any) {
    //      toast.error(err.response?.data?.message || "Thao tác thất bại");
    //     }
    // };

    if (isLoading) return <LoadingSpinner />;
    if (!doc || !formData) return <div className="text-white">Không tìm thấy dữ liệu</div>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white italic">
                        Biên tập hồ sơ: <span className="text-primary-400 not-italic">{doc.documentCode}</span>
                    </h1>
                    <Button variant="ghost" onClick={() => navigate("/documents")}>← Quay lại</Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="p-6 bg-dark-900/40 border-l-4 border-primary-500">
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <Input
                                    label="Tiêu đề tài liệu"
                                    value={formData.title}
                                    onChange={(v) => setFormData(p => p ? ({ ...p, title: v }) : null)}
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
                                    <label className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Mô tả</label>
                                    <textarea
                                        className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white text-sm min-h-[80px] outline-none focus:ring-1 focus:ring-primary-500"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData(p => p ? ({ ...p, description: e.target.value }) : null)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" variant="primary" isLoading={isSaving} className="h-9">
                                        <Save className="w-4 h-4 mr-2" /> Cập nhật thông tin
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-accent-green">
                                <History className="w-5 h-5" />
                                <h2 className="text-sm font-bold uppercase tracking-widest">Lịch sử các phiên bản kỹ thuật</h2>
                            </div>

                            <Card className="overflow-hidden bg-dark-950/20 border-dark-800">
                                <table className="w-full text-left text-xs text-gray-400">
                                    <thead className="bg-dark-900/50 text-primary-400 uppercase text-[10px] font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Phiên bản</th>
                                            <th className="px-4 py-3 text-center">Mã yêu cầu</th>
                                            <th className="px-4 py-3 text-right">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-800">
                                        {currentVersions.length > 0 ? (
                                            currentVersions.map((v) => (
                                                <tr key={v.id} className="hover:bg-dark-800/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <span className="text-white font-bold">v{v.versionNumber}</span>
                                                        {v.id === doc.currentVersionId &&
                                                            <span className="ml-2 text-[9px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/30">Hiện tại</span>
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-mono">{v.requestId}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/documents/${doc.id}/version/${v.id}`)}
                                                            className="h-7 hover:text-primary-400"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1" /> Chi tiết
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={3} className="px-4 py-10 text-center italic">Chưa có phiên bản nào được ghi lại</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </Card>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                className="pt-2"
                            />
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <Card className="p-5 space-y-4 bg-dark-900/60 border-none shadow-xl">
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-dark-700 pb-2">Hồ sơ hệ thống</h3>
                            <MetaRow label="Trạng thái" value={DOCUMENT_STATUS_LABELS[doc.status]} badgeClass="text-primary-400" />
                            <MetaRow label="Phòng ban" value={doc.departmentName} />
                            <MetaRow label="Người tạo" value={doc.requesterName} />
                            <MetaRow label="Người xử lý" value={doc.currentHandlerName || "N/A"} />
                        </Card>

                        {/* <Button variant="primary" className="w-full py-6" onClick={handleSendToAppraisal}>
                            <Send className="w-4 h-4" />
                            <span>Gửi Thẩm Định</span>
                        </Button> */}
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const MetaRow = ({ label, value, badgeClass }: { label: string; value: string; badgeClass?: string }) => (
    <div className="flex justify-between items-center text-[11px]">
        <span className="text-gray-500">{label}:</span>
        <span className={badgeClass ? `font-bold ${badgeClass}` : "text-gray-300"}>{value}</span>
    </div>
);

const LoadingSpinner = () => (
    <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
    </div>
);

export default DocumentEditorPage;