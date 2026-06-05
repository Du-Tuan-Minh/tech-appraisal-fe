import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Pagination } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { IncomingAppraisalDocumentDto } from "@/types/document";
import type { PagedResult } from "@/types/paginationResult";
import { DocumentStatus, DOCUMENT_STATUS_MAP } from "@/constants/enum/DocumentStatus";

const IncomingAppraisalDocumentPage = () => {
    const navigate = useNavigate();

    const initialFilters = {
        page: 1,
        pageSize: 10,
        searchTerm: ""
    };

    const [filters, setFilters] = useState(initialFilters);
    const [data, setData] = useState<PagedResult<IncomingAppraisalDocumentDto> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await documentService.getIncomingAppraisalDocuments(filters);
            setData(res);
        } catch (err) {
            toast.error("Lỗi tải danh sách tài liệu thẩm định.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

    const handleNavigateToCreate = (doc: IncomingAppraisalDocumentDto) => {
        const documentId = doc.id;
        const title = encodeURIComponent(doc.title);
        const code = encodeURIComponent(doc.documentCode);
        const version = doc.VersionNumber || "1";

        navigate(
            `/appraisals/assignment/create/${doc.versionId}?documentId=${documentId}&title=${title}&code=${code}&v=${version}`
        );
    };
    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Tài Liệu Chờ Thẩm Định</h1>
                </header>

                <Card className="p-6 flex gap-4 items-end bg-dark-900/40">
                    <div className="flex-1">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Nhập tiêu đề hoặc mã tài liệu..."
                            value={filters.searchTerm || ""}
                            onChange={(v) => setFilters(p => ({ ...p, searchTerm: v, page: 1 }))}
                        />
                    </div>
                    <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setFilters(initialFilters)}>
                        Xóa bộ lọc
                    </Button>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-dark-800 text-primary-400 uppercase text-[11px] tracking-widest font-bold">
                                <tr>
                                    <th className="p-4">Mã tài liệu</th>
                                    <th className="p-4">Tiêu đề</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4">Ngày gửi đến</th>
                                    <th className="p-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800 text-white">
                                {isLoading ? (
                                    <TableSkeleton rows={5} cols={5} />
                                ) : data?.items && data.items.length > 0 ? (
                                    data.items.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-primary-900/5 transition-colors group">
                                            <td className="p-4 font-mono text-xs text-primary-400 font-semibold">
                                                {doc.documentCode}
                                            </td>

                                            <td className="p-4 font-medium cursor-pointer group-hover:text-primary-400 transition-colors" onClick={() => handleNavigateToCreate(doc)}>
                                                {doc.title}
                                            </td>

                                            <td className="p-4">
                                                <Badge
                                                    label={DOCUMENT_STATUS_MAP[DocumentStatus[doc.status as unknown as keyof typeof DocumentStatus]]?.label || "N/A"}
                                                />
                                            </td>

                                            <td className="p-4 text-gray-400 font-mono text-xs">
                                                {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                                            </td>

                                            <td className="p-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleNavigateToCreate(doc)}
                                                >
                                                    Thẩm định
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                            Không có tài liệu nào cần thẩm định.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {data && data.totalPages > 1 && (
                    <div className="pt-4">
                        <Pagination
                            currentPage={data.page}
                            totalPages={data.totalPages}
                            onPageChange={(page) => setFilters(p => ({ ...p, page }))}
                        />
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

const TableSkeleton = ({ rows, cols }: { rows: number; cols: number }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td colSpan={cols} className="p-6 h-16 bg-dark-800/10"></td>
            </tr>
        ))}
    </>
);

export default IncomingAppraisalDocumentPage;