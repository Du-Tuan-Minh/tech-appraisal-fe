import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { documentService } from "../../services/documentService";
import { getEnumMapValue } from "../../utils/enumHelper";

import {
    ReviewerStatus,
    REVIEWER_STATUS_MAP
} from "../../constants/enum/ReviewerStatus";

import type {
    OverdueDocumentDto,
    OverdueFilterDto
} from "../../types/document";

const INITIAL_FILTERS: Omit<OverdueFilterDto, "searchTerm"> = {
    page: 1,
    pageSize: 10,
    status: null
};

const OverdueDocumentsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const mode = searchParams.get("mode") || "personal";

    const [documents, setDocuments] = useState<OverdueDocumentDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setSearchQuery("");
        setFilters(INITIAL_FILTERS);
    }, [mode]);

    const activeFilters = useMemo<OverdueFilterDto>(() => ({
        ...filters,
        searchTerm: debouncedSearch.trim() || null
    }), [filters, debouncedSearch]);

    const loadDocuments = useCallback(async (params: OverdueFilterDto, currentMode: string) => {
        setIsLoading(true);
        try {
            const response = currentMode === "department"
                ? await documentService.getManagerRequestedOverdueDocuments(params)
                : await documentService.getOverdueDocuments(params);

            setDocuments(response.items || []);
            setPagination({
                page: response.page,
                pageSize: response.pageSize,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            });
        } catch (err) {
            console.error("[Fetch Overdue Documents Error]:", err);
            toast.error("Không thể tải danh sách tài liệu quá hạn.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments(activeFilters, mode);
    }, [activeFilters, mode, loadDocuments]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getOverdueDays = (deadline: string | null) => {
        if (!deadline) return 0;
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffMs = now.getTime() - deadlineDate.getTime();
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    };

    const handlePageChange = (page: number) => {
        setFilters((f) => ({ ...f, page }));
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilters({ ...INITIAL_FILTERS, page: 1 });
    };

    const pageHeader = useMemo(() => {
        return mode === "department"
            ? { title: "Tài Liệu Quá Hạn Phòng Ban", sub: "Danh sách tài liệu do phòng ban yêu cầu đang quá hạn phản hồi" }
            : { title: "Tài Liệu Quá Hạn Cá Nhân", sub: "Danh sách tài liệu gán cho bạn đang bị quá hạn phản hồi" };
    }, [mode]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {pageHeader.title}
                        </h1>
                        <p className="text-red-400 mt-1">
                            {pageHeader.sub}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/manager/dashboard")}
                    >
                        Quay lại Dashboard
                    </Button>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Người đánh giá, mã NV, tài liệu..."
                            value={searchQuery}
                            onChange={(val) => {
                                setSearchQuery(val);
                                setFilters((f) => ({ ...f, page: 1 }));
                            }}
                        />

                        <Select
                            label="Trạng thái"
                            value={filters.status?.toString() || ""}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                {
                                    value: ReviewerStatus.Pending.toString(),
                                    label: REVIEWER_STATUS_MAP[ReviewerStatus.Pending].label
                                },
                                {
                                    value: ReviewerStatus.Reviewing.toString(),
                                    label: REVIEWER_STATUS_MAP[ReviewerStatus.Reviewing].label
                                },
                                {
                                    value: ReviewerStatus.Completed.toString(),
                                    label: REVIEWER_STATUS_MAP[ReviewerStatus.Completed].label
                                },
                                {
                                    value: ReviewerStatus.Skipped.toString(),
                                    label: REVIEWER_STATUS_MAP[ReviewerStatus.Skipped].label
                                }
                            ]}
                            onChange={(val) =>
                                setFilters((f) => ({
                                    ...f,
                                    page: 1,
                                    status: val ? (Number(val) as ReviewerStatus) : null
                                }))
                            }
                        />

                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={handleClearFilters}
                                className="text-red-400 hover:bg-red-500/10 w-full md:w-auto"
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
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Người Đánh Giá</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Người tạo tài liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Deadline</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Quá Hạn</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-24 text-sm">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : documents.length > 0 ? (
                                    documents.map((doc) => {
                                        const overdueDays = getOverdueDays(doc.deadline);
                                        const statusConfig = getEnumMapValue(
                                            REVIEWER_STATUS_MAP,
                                            ReviewerStatus,
                                            doc.status
                                        ) ?? {
                                            label: "Không xác định",
                                            color: "text-gray-400 bg-gray-900/20"
                                        };

                                        return (
                                            <tr
                                                key={doc.assignmentId}
                                                className="hover:bg-red-500/5 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/appraisals/${doc.assignmentId}`)}
                                            >
                                                <td className="p-4">
                                                    <div className="font-semibold text-white text-sm">{doc.reviewerName}</div>
                                                    <div className="text-xs text-gray-500">MNV: {doc.employeeCode}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-white text-sm line-clamp-1 max-w-[250px]">{doc.documentTitle}</div>
                                                    <div className="text-xs text-gray-500">Mã: {doc.documentCode}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-white text-sm line-clamp-1 max-w-[250px]">{doc.requesterName}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-gray-300">{formatDate(doc.deadline)}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm font-bold text-red-400">{overdueDays} ngày</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/appraisals/${doc.assignmentId}`);
                                                            }}
                                                        >
                                                            Xem
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-gray-500 text-sm">
                                            Không có tài liệu quá hạn nào.
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
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OverdueDocumentsPage;