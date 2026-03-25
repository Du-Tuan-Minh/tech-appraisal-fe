import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select, Pagination } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { TechnicalDocumentResponseDto, DocumentFilterDto } from "@/types/document";
import type { PagedResult } from "@/types/paginationResult";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { DocumentStatus, DOCUMENT_STATUS_LABELS } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";

const DocumentListPage = () => {
    const navigate = useNavigate();

    const initialFilters: DocumentFilterDto = {
        page: 1,
        pageSize: 10,
        searchTerm: "",
        type: null,
        status: null,
        fromDate: null,
        toDate: null
    };

    const [filters, setFilters] = useState<DocumentFilterDto>(initialFilters);
    const [data, setData] = useState<PagedResult<TechnicalDocumentResponseDto> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).map(v => ({
            value: String(v),
            label: DOCUMENT_TYPE_LABELS[v as DocumentType]
        })), []);

    const statusOptions = useMemo(() =>
        Object.values(DocumentStatus).map(v => ({
            value: String(v),
            label: DOCUMENT_STATUS_LABELS[v as DocumentStatus]
        })), []);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await documentService.getDocuments(filters);
            setData(res);
        } catch (err) {
            toast.error("Lỗi tải danh sách tài liệu.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

    const handleAction = async (action: () => Promise<void>, msg: string) => {
        if (isSubmittingAction) return;
        setIsSubmittingAction(true);
        try {
            await action();
            toast.success(msg);
            fetchDocuments();
        } finally {
            setIsSubmittingAction(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Quản Lý Tài Liệu</h1>
                    <Button variant="primary" onClick={() => navigate("/documents/create")}>+ Tạo Mới</Button>
                </header>

                <Card className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end bg-dark-900/40">
                    <Input label="Tìm kiếm" placeholder="Tiêu đề tài liệu..." value={filters.searchTerm || ""} onChange={(v) => setFilters(p => ({ ...p, searchTerm: v, page: 1 }))} />

                    <Select
                        label="Loại"
                        options={typeOptions}
                        placeholder="Tất cả loại"
                        value={String(filters.type ?? "")}
                        onChange={(v) => setFilters(p => ({ ...p, type: v ? (Number(v) as DocumentType) : null, page: 1 }))}
                    />

                    <Select
                        label="Trạng thái"
                        options={statusOptions}
                        placeholder="Tất cả trạng thái"
                        value={String(filters.status ?? "")}
                        onChange={(v) => setFilters(p => ({ ...p, status: v ? (Number(v) as DocumentStatus) : null, page: 1 }))}
                    />

                    <Input label="Từ ngày" type="date" value={filters.fromDate || ""} onChange={(v) => setFilters(p => ({ ...p, fromDate: v, page: 1 }))} />
                    <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setFilters(initialFilters)}>Xóa bộ lọc</Button>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-dark-800 text-primary-400 uppercase text-[11px] tracking-widest font-bold">
                                <tr>
                                    <th className="p-4">Tiêu đề</th>
                                    <th className="p-4">Loại / Độ ưu tiên</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4">Người yêu cầu / Phòng ban</th>
                                    <th className="p-4">Ngày tạo</th>
                                    <th className="p-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800 text-white">
                                {isLoading ? <TableSkeleton rows={5} cols={6} /> : data?.items.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-primary-900/5 transition-colors group">
                                        <td className="p-4 font-semibold group-hover:text-primary-400 transition-colors cursor-pointer" onClick={() => navigate(`/documents/${doc.id}/editor`)}>
                                            {doc.title}
                                        </td>
                                        <td className="p-4 space-y-1.5">
                                            <div className="text-[12px] text-gray-400 font-medium">
                                                {DOCUMENT_TYPE_LABELS[doc.type as DocumentType]}
                                            </div>
                                            <Badge label={ISSUE_SEVERITY_LABELS[doc.priority as IssueSeverity]} />
                                        </td>
                                        <td className="p-4">
                                            <Badge label={DOCUMENT_STATUS_LABELS[doc.status as DocumentStatus]} />
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[13px]">{doc.requesterName}</div>
                                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{doc.departmentName}</div>
                                        </td>
                                        <td className="p-4 text-gray-400 font-mono text-xs">
                                            {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/editor`)}>Sửa</Button>
                                                {doc.status === DocumentStatus.Draft && (
                                                    <Button variant="outline" size="sm" onClick={() => handleAction(() => documentService.submitForAppraisal(doc.id), "Đã gửi!")} isLoading={isSubmittingAction}>Gửi</Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/versions`)}>Vòng đời</Button>
                                                <Button variant="ghost" size="sm" className="text-red-500/70" onClick={() => { if (confirm("Xác nhận xóa tài liệu?")) handleAction(() => documentService.getDocumentById(doc.id), "Đã xóa"); }}>Xóa</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {data && data.totalPages > 1 && (
                    <div className="pt-4">
                        <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={(page) => setFilters(p => ({ ...p, page }))} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const Badge = ({ label, className }: { label: string; className?: string }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] border border-dark-600 bg-dark-800 text-gray-300 font-bold uppercase tracking-tighter ${className || ""}`}>
        {label}
    </span>
);

const TableSkeleton = ({ rows, cols }: { rows: number, cols: number }) => (
    <>{Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
            <td colSpan={cols} className="p-6 h-16 bg-dark-800/10"></td>
        </tr>
    ))}</>
);

export default DocumentListPage;