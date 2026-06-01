import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import { Layout } from "@/components/layout";

import { getEnumMapValue } from "@/utils/enumHelper";
import { documentService } from "@/services/documentService";

import type {
    ManagerDashboardDocumentDto,
    ManagerDashboardDocumentFilterDto
} from "@/types/document";

import {
    MANAGER_DASHBOARD_DOCUMENT_TYPE_MAP
} from "@/constants/enum/ManagerDashboardDocumentType";

import {
    DEPARTMENT_DOCUMENT_STATUS_TYPE_MAP
} from "@/constants/enum/DepartmentDocumentStatusType";

import { DOCUMENT_STATUS_MAP, DocumentStatus } from "@/constants/enum/DocumentStatus";
import { ASSIGNMENT_STATUS_MAP, AssignmentStatus } from "@/constants/enum/AssignmentStatus";

const formatDate = (date?: string | null) => {
    if (!date) return "---";
    return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

const getDeadlineStyle = (deadline?: string | null) => {
    if (!deadline) return "text-gray-400";
    const diffDays = Math.floor(
        (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0) return "text-red-400 font-semibold";
    if (diffDays <= 3) return "text-orange-400 font-semibold";
    return "text-green-400";
};

const Badge = memo(({ label, className }: { label: string; className?: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${className || "text-gray-400"}`}>
        {label}
    </span>
));
Badge.displayName = "Badge";

interface DocumentRowProps {
    doc: ManagerDashboardDocumentDto;
    onNavigate: (id: string) => void;
}

const DocumentRow = memo(({ doc, onNavigate }: DocumentRowProps) => {
    const statusConfig = getEnumMapValue(
        DOCUMENT_STATUS_MAP,
        DocumentStatus,
        doc.status
    );

    const assignmentConfig = getEnumMapValue(
        ASSIGNMENT_STATUS_MAP,
        AssignmentStatus,
        doc.assignmentStatus
    );

    return (
        <tr
            className="hover:bg-primary-500/5 transition-colors cursor-pointer group border-b border-dark-800"
            onClick={() => onNavigate(doc.id)}
        >
            <td className="p-4 w-[25%] max-w-[250px]">
                <div className="font-mono text-white font-medium truncate" title={doc.title}>
                    {doc.title}
                </div>
                <div className="text-xs text-gray-500">Mã: {doc.documentCode}</div>
            </td>
            <td className="p-4 w-[12%]">
                <Badge label={statusConfig?.label || "Không rõ"} className={statusConfig?.color} />
            </td>
            <td className="p-4 text-gray-300 text-sm truncate w-[15%]">
                {doc.currentHandlerName || "---"}
            </td>
            <td className="p-4 text-gray-300 text-sm truncate w-[15%]">
                {doc.reviewerName || "---"}
            </td>
            <td className="p-4 w-[13%]">
                {assignmentConfig ? (
                    <Badge label={assignmentConfig.label} className={assignmentConfig.color} />
                ) : (
                    <span className="text-gray-600">---</span>
                )}
            </td>
            <td className="p-4 w-[12%]">
                <span className={getDeadlineStyle(doc.deadline)}>
                    {formatDate(doc.deadline)}
                </span>
            </td>
            <td className="p-4 text-center w-[8%]" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" onClick={() => onNavigate(doc.id)}>
                    Chi tiết
                </Button>
            </td>
        </tr>
    );
});
DocumentRow.displayName = "DocumentRow";

const ManagerDashboardDocumentListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [documents, setDocuments] = useState<ManagerDashboardDocumentDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const viewMode = useMemo(() => {
        const mode = searchParams.get("mode");
        return mode === "department" ? "department" : "personal";
    }, [searchParams]);

    const typeOptions = useMemo(() => {
        const targetMap = viewMode === "personal"
            ? MANAGER_DASHBOARD_DOCUMENT_TYPE_MAP
            : DEPARTMENT_DOCUMENT_STATUS_TYPE_MAP;

        return [
            { value: "", label: "Tất cả loại" },
            ...Object.entries(targetMap).map(([key, value]) => ({
                value: key,
                label: value.label
            }))
        ];
    }, [viewMode]);

    const urlFilters = useMemo(() => {
        const pageParam = Number(searchParams.get("page"));
        const pageSizeParam = Number(searchParams.get("pageSize"));
        const typeParam = searchParams.get("type");

        const baseFilter = {
            page: isNaN(pageParam) || pageParam <= 0 ? 1 : pageParam,
            pageSize: isNaN(pageSizeParam) || pageSizeParam <= 0 ? 10 : pageSizeParam,
            searchTerm: searchParams.get("search") || null,
        };

        if (typeParam === null || typeParam === "" || isNaN(Number(typeParam))) {
            return { ...baseFilter, type: null };
        }

        return {
            ...baseFilter,
            type: Number(typeParam)
        };
    }, [searchParams]);

    const [localSearch, setLocalSearch] = useState(urlFilters.searchTerm || "");

    useEffect(() => {
        setLocalSearch(urlFilters.searchTerm || "");
    }, [urlFilters.searchTerm]);

    const updateUrlParams = useCallback((patch: Record<string, string | number | null>) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            Object.entries(patch).forEach(([key, value]) => {
                newParams.delete(key);
                if (value !== null && value !== "") {
                    newParams.set(key, value.toString());
                }
            });
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    const loadDocuments = useCallback(async (filters: any, mode: "personal" | "department") => {
        setIsLoading(true);
        try {
            const response = mode === "personal"
                ? await documentService.getManagerStatusDocuments(filters as ManagerDashboardDocumentFilterDto)
                : await documentService.getManagerRequestStatusDocuments(filters);

            if (response) {
                setDocuments(response.items || []);
                setPagination({
                    page: response.page || filters.page || 1,
                    pageSize: response.pageSize || filters.pageSize || 10,
                    totalCount: response.totalCount || 0,
                    totalPages: response.totalPages || 0
                });
            }
        } catch {
            toast.error("Không thể tải danh sách tài liệu quản lý.");
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments(urlFilters, viewMode);
    }, [urlFilters, viewMode, loadDocuments]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localSearch !== (urlFilters.searchTerm || "")) {
                updateUrlParams({ search: localSearch || null, page: 1 });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [localSearch, urlFilters.searchTerm, updateUrlParams]);

    const handleClearFilters = () => {
        setSearchParams({ mode: viewMode }, { replace: true });
        setLocalSearch("");
    };

    const handleNavigateDetail = useCallback((id: string) => {
        navigate(`/documents/${id}`);
    }, [navigate]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {viewMode === "personal" ? "Dashboard Kiểm Duyệt Phòng Ban" : "Dashboard Tài Liệu Phòng Ban Tạo"}
                    </h1>
                    <p className="text-primary-400 mt-1">
                        {viewMode === "personal"
                            ? "Quản lý tiến trình thẩm định và phê duyệt tài liệu nội bộ"
                            : "Theo dõi trạng thái phát hành các tài liệu do phòng ban khởi tạo"}
                    </p>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tên tài liệu, mã tài liệu..."
                            value={localSearch}
                            onChange={(val) => setLocalSearch(val || "")}
                        />

                        <Select
                            label="Loại danh mục dữ liệu"
                            value={urlFilters.type !== null ? urlFilters.type.toString() : ""}
                            options={typeOptions}
                            onChange={(val) =>
                                updateUrlParams({
                                    type: val !== "" ? val : null,
                                    page: 1
                                })
                            }
                        />

                        <div className="flex items-end gap-2">
                            <Button
                                variant="ghost"
                                className="text-red-400 hover:bg-red-500/10 transition-colors"
                                onClick={handleClearFilters}
                            >
                                Xóa lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                            <thead className="sticky top-0 bg-dark-800 backdrop-blur-sm border-b border-dark-700 z-10">
                                <tr>
                                    <th className="p-4 text-primary-300 font-semibold w-[25%]">Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold w-[12%]">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold w-[15%]">Người Xử Lý</th>
                                    <th className="p-4 text-primary-300 font-semibold w-[15%]">Thẩm Định Viên</th>
                                    <th className="p-4 text-primary-300 font-semibold w-[13%]">Ủy Quyền</th>
                                    <th className="p-4 text-primary-300 font-semibold w-[12%]">Hạn Chót</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-[8%]">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <DocumentRow
                                            key={doc.id}
                                            doc={doc}
                                            onNavigate={handleNavigateDetail}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-gray-500">
                                            Không có tài liệu nào trong danh mục này.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {!isLoading && pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => updateUrlParams({ page })}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManagerDashboardDocumentListPage;