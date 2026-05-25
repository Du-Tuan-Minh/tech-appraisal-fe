import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import type { UserCurrentDocumentDto, UserCurrentDocumentFilterDto } from "../../types/document";
import { DocumentStatus, DOCUMENT_STATUS_MAP } from "../../constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_MAP } from "../../constants/enum/IssueSeverity";
import { documentService } from "@/services/documentService";

const PRIORITY_OPTIONS = [
    { value: "", label: "Tất cả mức độ" },
    ...Object.entries(ISSUE_SEVERITY_MAP).map(([key, value]) => ({
        value: key,
        label: value.label
    }))
];

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả trạng thái" },
    ...Object.entries(DOCUMENT_STATUS_MAP).map(([key]) => ({
        value: key,
        label: DOCUMENT_STATUS_MAP[key as keyof typeof DOCUMENT_STATUS_MAP].label
    }))
];

const Badge = ({ label, className }: { label: string; className?: string }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${className || "text-gray-400"}`}>
        {label}
    </span>
);

const UserDocumentListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [documents, setDocuments] = useState<UserCurrentDocumentDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const urlFilters = useMemo<UserCurrentDocumentFilterDto>(() => {
        const pageParam = Number(searchParams.get("page"));
        const sizeParam = Number(searchParams.get("pageSize"));
        const priorityParam = Number(searchParams.get("priority"));
        const statusParams = searchParams.getAll("status");

        return {
            page: isNaN(pageParam) || pageParam <= 0 ? 1 : pageParam,
            pageSize: isNaN(sizeParam) || sizeParam <= 0 ? 10 : sizeParam,
            searchTerm: searchParams.get("search") || null,
            priority: isNaN(priorityParam) || !searchParams.get("priority") ? null : (priorityParam as IssueSeverity),
            status: statusParams.length > 0 ? statusParams : null
        };
    }, [searchParams]);

    const [localSearch, setLocalSearch] = useState(urlFilters.searchTerm || "");

    useEffect(() => {
        setLocalSearch(urlFilters.searchTerm || "");
    }, [urlFilters.searchTerm]);

    const loadDocuments = useCallback(async (filters: UserCurrentDocumentFilterDto) => {
        setIsLoading(true);
        try {
            const response = await documentService.getMyCurrentDocuments(filters);
            if (response && response.items) {
                setDocuments(response.items);
                setPagination({
                    page: response.page || filters.page || 1,
                    pageSize: response.pageSize || filters.pageSize || 10,
                    totalCount: response.totalCount || 0,
                    totalPages: response.totalPages || 0
                });
            }
        } catch (err) {
            toast.error("Không thể tải danh sách tài liệu từ hệ thống.");
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments(urlFilters);
    }, [urlFilters, loadDocuments]);

    useEffect(() => {
        const currentSearchInUrl = searchParams.get("search") || "";
        if (localSearch === currentSearchInUrl) return;

        const handler = setTimeout(() => {
            updateUrlParams({ search: localSearch || null, page: 1 });
        }, 300);

        return () => clearTimeout(handler);
    }, [localSearch, searchParams]);

    const updateUrlParams = (
        patch: Record<string, string | number | string[] | number[] | null>
    ) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(patch).forEach(([key, value]) => {
            newParams.delete(key);

            if (value === null || value === "") return;

            if (Array.isArray(value)) {
                value.forEach(v => {
                    newParams.append(key, v.toString());
                });
            } else {
                newParams.set(key, value.toString());
            }
        });

        setSearchParams(newParams, { replace: true });
    };

    const handleClearFilters = () => {
        setSearchParams({}, { replace: true });
        setLocalSearch("");
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getDeadlineStyle = (deadline: string | null) => {
        if (!deadline) return "text-gray-400";
        const diffDays = Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return "text-red-400";
        if (diffDays <= 3) return "text-orange-400";
        return "text-green-400";
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Tài Liệu Của Tôi</h1>
                        <p className="text-primary-400 mt-1">Quản lý các tài liệu bạn đang xử lý</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate("/documents/create")}>
                        Tạo Tài Liệu Mới
                    </Button>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tên tài liệu, mã tài liệu..."
                            value={localSearch}
                            onChange={(val) => setLocalSearch(val || "")}
                        />

                        <Select
                            label="Mức độ ưu tiên"
                            value={urlFilters.priority?.toString() || ""}
                            options={PRIORITY_OPTIONS}
                            onChange={(val) => updateUrlParams({ priority: val || null, page: 1 })}
                        />

                        <Select
                            label="Trạng thái"
                            value={urlFilters.status && urlFilters.status.length > 0 ? urlFilters.status[0] : ""}
                            options={STATUS_OPTIONS}
                            onChange={(val) =>
                                updateUrlParams({
                                    status: val ? [val] : null,
                                    page: 1
                                })
                            }
                        />

                        <div className="flex items-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={handleClearFilters}
                                className="text-red-400"
                            >
                                Xóa lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/70 border-b border-dark-700">
                                    <th className="p-4 text-primary-300 font-semibold">Tên Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold">Mức Độ</th>
                                    <th className="p-4 text-primary-300 font-semibold">Người Xử Lý</th>
                                    <th className="p-4 text-primary-300 font-semibold">Hạn Chót</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-24">Thao Tác</th>
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
                                    documents.map((doc) => {
                                        const statusConfig =
                                            DOCUMENT_STATUS_MAP[
                                            DocumentStatus[doc.status as keyof typeof DocumentStatus]
                                            ];

                                        const priorityConfig =
                                            ISSUE_SEVERITY_MAP[
                                            IssueSeverity[doc.priority as keyof typeof IssueSeverity]
                                            ];

                                        return (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/documents/${doc.id}`)}
                                            >
                                                <td className="p-4">
                                                    <div className="font-mono text-white font-medium">{doc.title}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Mã tài liệu: {doc.documentCode}
                                                    </div>
                                                </td>

                                                <td className="p-4">
                                                    <Badge
                                                        label={statusConfig?.label}
                                                        className={statusConfig?.color}
                                                    />
                                                </td>

                                                <td className="p-4">
                                                    <Badge
                                                        label={priorityConfig?.label}
                                                        className={priorityConfig?.color}
                                                    />
                                                </td>

                                                <td className="p-4 text-gray-300">
                                                    {doc.currentHandlerName || "---"}
                                                </td>

                                                <td className="p-4">
                                                    <span className={`font-medium ${getDeadlineStyle(doc.deadline)}`}>
                                                        {formatDate(doc.deadline)}
                                                    </span>
                                                </td>

                                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/editor`)}>Sửa</Button>

                                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/documents/${doc.id}/versions`)}>Vòng đời</Button>
                                                        {/* <Button variant="ghost" size="sm" className="text-red-500/70" onClick={() => { if (confirm("Xác nhận xóa tài liệu?")) handleAction(() => documentService.getDocumentById(doc.id), "Đã xóa"); }}>Xóa</Button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-gray-500">
                                            Không tìm thấy tài liệu nào.
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

export default UserDocumentListPage;