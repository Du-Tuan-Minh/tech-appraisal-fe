import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";

import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";

import type { TechnicalDocumentDetailDto, TechnicalDocumentUpdateDto } from "@/types/document";
import type { DocumentVersionDto } from "@/types/version";

import { DocumentType, DOCUMENT_TYPE_MAP } from "@/constants/enum/DocumentType";
import { DOCUMENT_STATUS_MAP, DocumentStatus } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_MAP } from "@/constants/enum/IssueSeverity";
import { getEnumMapValue } from "@/utils/enumHelper";
import NestedTechnicalSpecsEditor from "@/components/forms/NestedTechnicalSpecsEditor";

import { History, Save, ArrowLeft, Eye, Send } from "lucide-react";

const DocumentEditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const parseDocumentType = (value: unknown): DocumentType => {
        if (typeof value === "string") {
            const config = getEnumMapValue(DOCUMENT_TYPE_MAP, DocumentType, value);
            if (config) {
                return DocumentType[value as keyof typeof DocumentType] as DocumentType;
            }
            return DocumentType.TechnicalSpecifications;
        }

        return typeof value === "number" && Object.values(DocumentType).includes(value as DocumentType)
            ? (value as DocumentType)
            : DocumentType.TechnicalSpecifications;
    };

    const parseIssueSeverity = (value: unknown): IssueSeverity => {
        if (typeof value === "string") {
            const config = getEnumMapValue(ISSUE_SEVERITY_MAP, IssueSeverity, value);
            if (config) {
                return IssueSeverity[value as keyof typeof IssueSeverity] as IssueSeverity;
            }
            return IssueSeverity.Minor;
        }

        return typeof value === "number" && Object.values(IssueSeverity).includes(value as IssueSeverity)
            ? (value as IssueSeverity)
            : IssueSeverity.Minor;
    };

    const [doc, setDoc] = useState<TechnicalDocumentDetailDto | null>(null);
    const [formData, setFormData] = useState<TechnicalDocumentUpdateDto>({
        title: "",
        type: DocumentType.TechnicalSpecifications,
        priority: IssueSeverity.Minor,
        description: "",
        technicalSpecs: {},
        externalDepartmentIds: [],
        approvalProposerIds: ""
    });
    const [versions, setVersions] = useState<DocumentVersionDto[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).map((value) => ({
            value: String(value),
            label: DOCUMENT_TYPE_MAP[value as DocumentType]?.label || "N/A"
        })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity).map((value) => ({
            value: String(value),
            label: ISSUE_SEVERITY_MAP[value as IssueSeverity]?.label || "N/A"
        })), []);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [documentData, versionList] = await Promise.all([
                documentService.getDocumentById(id),
                documentService.getDocumentVersions(id)
            ]);

            setDoc(documentData);
            setVersions(versionList);

            const currentVersion = versionList.find((v: any) => v.isCurrent) || versionList[0];

            let specs = {};
            if (currentVersion && currentVersion.technicalSpecsJson) {
                specs = typeof currentVersion.technicalSpecsJson === 'string'
                    ? JSON.parse(currentVersion.technicalSpecsJson || "{}")
                    : currentVersion.technicalSpecsJson;
            }
            let extDepts = [];
            if (documentData.externalDepartmentIds) {
                extDepts = typeof documentData.externalDepartmentIds === 'string'
                    ? JSON.parse(documentData.externalDepartmentIds || "[]")
                    : documentData.externalDepartmentIds;
            }

            setFormData({
                title: documentData.title,
                description: documentData.description,
                type: parseDocumentType((documentData as any).type),
                priority: parseIssueSeverity((documentData as any).priority),
                technicalSpecs: specs,
                externalDepartmentIds: extDepts,
                approvalProposerIds: Array.isArray(documentData.approvalProposerIds)
                    ? documentData.approvalProposerIds.join(", ")
                    : (documentData.approvalProposerIds || "")
            });

        } catch (error) {
            toast.error("Không thể tải dữ liệu tài liệu");
            navigate("/documents");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleInputChange = (field: keyof TechnicalDocumentUpdateDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const statusInfo = getEnumMapValue(DOCUMENT_STATUS_MAP, DocumentStatus, doc?.status);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                approvalProposerIds: formData.approvalProposerIds?.trim() || null
            };

            const success = await documentService.updateDocument(id, payload);
            if (success) {
                toast.success("Đã cập nhật bản thảo thành công");
                await fetchData();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi hệ thống khi cập nhật");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendToAppraisal = async () => {
        if (!id || !window.confirm("Gửi phiên bản hiện tại đi thẩm định?")) return;
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                approvalProposerIds: formData.approvalProposerIds?.trim() || null
            };
            await documentService.updateDocument(id, payload);
            await documentService.submitForAppraisal(id);

            toast.success("Hồ sơ đã được gửi đi thẩm định thành công");
            navigate("/documents");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Gửi thẩm định thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const paginatedVersions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return versions.slice(start, start + itemsPerPage);
    }, [versions, currentPage]);

    if (isLoading) return <LoadingSpinner />;
    if (!doc) return <div className="p-10 text-center text-gray-500">Tài liệu không tồn tại</div>;

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-white">
                            Mã tài liệu: <span className="text-primary-400 font-mono">{doc.documentCode}</span>
                        </h1>
                        <p className="text-xs text-gray-400 italic">Lần cuối cập nhật: {new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/documents")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="p-6 bg-dark-900/40 border-l-2 border-primary-500 shadow-xl">
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <Input
                                    label="Tiêu đề tài liệu"
                                    placeholder="Nhập tiêu đề..."
                                    value={formData.title}
                                    onChange={(v) => handleInputChange("title", v)}
                                    disabled={isSaving}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Loại tài liệu"
                                        options={typeOptions}
                                        value={String(formData.type)}
                                        onChange={(v) => handleInputChange("type", Number(v))}
                                        disabled={isSaving}
                                    />
                                    <Select
                                        label="Mức độ ưu tiên"
                                        options={priorityOptions}
                                        value={String(formData.priority)}
                                        onChange={(v) => handleInputChange("priority", Number(v))}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mô tả chi tiết</label>
                                    <textarea
                                        className="w-full bg-dark-800/50 border border-dark-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                        rows={5}
                                        placeholder="Mô tả nội dung thay đổi hoặc yêu cầu..."
                                        value={formData.description || ""}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-dark-800">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Thông số kỹ thuật chi tiết</label>
                                    <NestedTechnicalSpecsEditor
                                        value={formData.technicalSpecs || {}}
                                        onChange={(newSpecs) => handleInputChange("technicalSpecs", newSpecs)}
                                        readOnly={isSaving || isSubmitting}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleSendToAppraisal}
                                        isLoading={isSubmitting}
                                        disabled={isSaving}
                                    >
                                        <Send className="w-4 h-4 mr-2" /> Gửi Thẩm Định
                                    </Button>

                                    <Button
                                        type="submit"
                                        isLoading={isSaving}
                                        disabled={isSubmitting}
                                        className="min-w-[120px]"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Lưu bản thảo
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <History className="w-4 h-4 text-primary-500" />
                                Lịch sử phiên bản ({versions.length})
                            </h3>
                            <Card className="overflow-hidden bg-dark-950/20 border-dark-800">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-dark-900 text-gray-500 uppercase font-bold">
                                            <tr>
                                                <th className="px-4 py-3">Phiên bản</th>
                                                <th className="px-4 py-3 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dark-800 text-gray-300">
                                            {paginatedVersions.length > 0 ? paginatedVersions.map(v => (
                                                <tr key={v.id} className="hover:bg-white/[0.03] transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-primary-400">v{v.versionNumber}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:text-primary-400"
                                                            onClick={() => navigate(`/documents/${doc.id}/version/${v.id}`)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-8 text-center text-gray-600">Chưa có lịch sử phiên bản nào</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                            {versions.length > itemsPerPage && (
                                <div className="flex justify-center pt-2">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(versions.length / itemsPerPage)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <Card className="p-4 bg-dark-900/60 border-dark-800 space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 border-b border-dark-700 pb-2 uppercase">Thông tin hệ thống</h4>
                            <MetaRow
                                label="Trạng thái"
                                value={statusInfo?.label || "N/A"}
                                color={statusInfo?.color}
                            />
                            <MetaRow label="Phòng ban quản lý" value={doc.departmentName} />
                            <MetaRow label="Người khởi tạo" value={doc.requesterName} />
                            <div className="pt-2">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tight mb-1">Mã Tài liệu</div>
                                <div className="text-[10px] font-mono text-gray-600 break-all bg-black/20 p-2 rounded">{doc.documentCode}</div>
                            </div>
                        </Card>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const MetaRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{label}</span>
        <span className={`text-xs font-medium ${color ? color : "text-white"}`}>{value}</span>
    </div>
);

const LoadingSpinner = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-950 gap-4">
        <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-primary-500 rounded-full"></div>
        <span className="text-xs text-gray-500 font-mono animate-pulse">Loading Document...</span>
    </div>
);

export default DocumentEditorPage;