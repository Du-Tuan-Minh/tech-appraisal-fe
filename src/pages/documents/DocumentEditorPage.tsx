import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";
import FileUploadComponent from "@/components/forms/FileUploadComponent";

import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";

import type { TechnicalDocumentDetailDto, TechnicalDocumentUpdateDto } from "@/types/document";
import type { DocumentVersionDto } from "@/types/version";
import type { AttachmentResponseDto } from "@/types/attachment";

import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { DOCUMENT_STATUS_LABELS } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
import { AttachmentCategory } from "@/constants/enum/AttachmentCategory";

import { History, Save, ArrowLeft, Eye } from "lucide-react";

const DocumentEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [doc, setDoc] = useState<TechnicalDocumentDetailDto | null>(null);
    const [formData, setFormData] = useState<(TechnicalDocumentUpdateDto & { attachments: AttachmentResponseDto[] }) | null>(null);
    const [versions, setVersions] = useState<DocumentVersionDto[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).filter(v => typeof v === "number").map(v => ({
            value: String(v), label: DOCUMENT_TYPE_LABELS[v as DocumentType]
        })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity).filter(v => typeof v === "number").map(v => ({
            value: String(v), label: ISSUE_SEVERITY_LABELS[v as IssueSeverity]
        })), []);

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            const [document, versionList] = await Promise.all([
                documentService.getDocumentById(id),
                documentService.getDocumentVersions(id)
            ]);

            setDoc(document);
            setVersions(versionList);
            setFormData({
                title: document.title,
                description: document.description,
                type: document.type,
                priority: document.priority,
                technicalSpecs: null,
                attachments: (document as any).attachments || []
            });
        } catch {
            toast.error("Không thể tải dữ liệu tài liệu");
            navigate("/documents/list");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData) return;
        setIsSaving(true);
        try {
            await documentService.updateDocument(id, formData);
            toast.success("Đã lưu thay đổi");
            await fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi cập nhật");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!doc || !formData) return <div className="p-10 text-center text-gray-500">Dữ liệu không tồn tại</div>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">
                        Biên tập: <span className="text-primary-400 font-mono">{doc.documentCode}</span>
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/documents/list")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="p-6 bg-dark-900/40 border-l-2 border-primary-500">
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <Input
                                    label="Tiêu đề"
                                    value={formData.title}
                                    onChange={(v) => setFormData(p => p ? ({ ...p, title: v }) : null)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Loại"
                                        options={typeOptions}
                                        value={String(formData.type)}
                                        onChange={(v) => setFormData(p => p ? ({ ...p, type: Number(v) as DocumentType }) : null)}
                                    />
                                    <Select
                                        label="Ưu tiên"
                                        options={priorityOptions}
                                        value={String(formData.priority)}
                                        onChange={(v) => setFormData(p => p ? ({ ...p, priority: Number(v) as IssueSeverity }) : null)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase">Mô tả</label>
                                    <textarea
                                        className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-sm text-white"
                                        rows={4}
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData(p => p ? ({ ...p, description: e.target.value }) : null)}
                                    />
                                </div>

                                <div className="pt-4 border-t border-dark-800">
                                    <FileUploadComponent
                                        technicalDocumentId={doc.id}
                                        category={AttachmentCategory.IssueEvidence}
                                        initialAttachments={formData.attachments}
                                        onChange={(updatedFiles) => {
                                            setFormData(prev => prev ? ({ ...prev, attachments: updatedFiles }) : null);
                                        }}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={isSaving}>
                                        <Save className="w-4 h-4 mr-2" /> Lưu
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <History className="w-4 h-4 text-gray-500" /> Lịch sử
                            </h3>
                            <Card className="overflow-hidden bg-dark-950/20 border-dark-800">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-dark-900 text-gray-500 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Version</th>
                                            <th className="px-4 py-3">Request ID</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-800 text-gray-300">
                                        {versions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(v => (
                                            <tr key={v.id} className="hover:bg-white/[0.02]">
                                                <td className="px-4 py-3 text-white">v{v.versionNumber}</td>
                                                <td className="px-4 py-3 font-mono">{v.requestId}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/version/${v.id}`)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(versions.length / itemsPerPage)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <Card className="p-4 bg-dark-900 border-dark-800 space-y-3">
                            <MetaRow label="Trạng thái" value={DOCUMENT_STATUS_LABELS[doc.status]} />
                            <MetaRow label="Phòng ban" value={doc.departmentName} />
                            <MetaRow label="Người tạo" value={doc.requesterName} />
                        </Card>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const MetaRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{label}</span>
        <span className="text-xs text-white font-medium">{value}</span>
    </div>
);

const LoadingSpinner = () => (
    <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin w-8 h-8 border-t-2 border-primary-500 rounded-full"></div>
    </div>
);

export default DocumentEditorPage;