import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { documentService } from "../../services/documentService";
import { ReviewerStatus, REVIEWER_STATUS_MAP } from "../../constants/enum/ReviewerStatus";
import type { PendingAppraisalResponseDto, PendingAppraisalFilterDto } from "../../types/document";

const INITIAL_FILTERS: PendingAppraisalFilterDto = {
    page: 1,
    pageSize: 10,
    searchTerm: null,
    status: null
};

const PendingAppraisalResponsesPage = () => {
    const navigate = useNavigate();

    const [appraisals, setAppraisals] = useState<PendingAppraisalResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<PendingAppraisalFilterDto>(INITIAL_FILTERS);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const loadAppraisals = useCallback(async (targetPage: number = 1) => {
        setIsLoading(true);
        try {
            const currentFilters: PendingAppraisalFilterDto = {
                ...filters,
                page: targetPage
            };

            const response = await documentService.getPendingAppraisalResponses(currentFilters);

            setAppraisals(response.items || []);
            setPagination({
                page: response.page,
                pageSize: response.pageSize,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            });
        } catch (err) {
            console.error("[Fetch Pending Appraisals Error]:", err);
            toast.error("Không thể tải danh sách đánh giá từ hệ thống.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const handler = setTimeout(() => {
            loadAppraisals(1);
        }, 300);

        return () => clearTimeout(handler);
    }, [filters.searchTerm, filters.status, loadAppraisals]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getDeadlineStyle = (deadline: string | null) => {
        if (!deadline) return "text-gray-400";

        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffDays = Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "text-red-400";
        if (diffDays <= 3) return "text-orange-400";
        return "text-green-400";
    };

    const handleViewDetail = (assignmentId: string) => {
        navigate(`/appraisals/${assignmentId}`);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Đánh Giá Chờ Trả Lời</h1>
                        <p className="text-primary-400 mt-1">Quản lý các đánh giá đang chờ phản hồi từ hội đồng thẩm định</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/dashboard/manager")}
                    >
                        Quay lại Dashboard
                    </Button>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Người đánh giá, mã NV, tài liệu..."
                            value={filters.searchTerm || ""}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val || null }))}
                        />

                        <Select
                            label="Trạng thái"
                            value={filters.status?.toString() || ""}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                { value: ReviewerStatus.Pending.toString(), label: REVIEWER_STATUS_MAP[ReviewerStatus.Pending].label },
                                { value: ReviewerStatus.Reviewing.toString(), label: REVIEWER_STATUS_MAP[ReviewerStatus.Reviewing].label },
                                { value: ReviewerStatus.Completed.toString(), label: REVIEWER_STATUS_MAP[ReviewerStatus.Completed].label },
                                { value: ReviewerStatus.Skipped.toString(), label: REVIEWER_STATUS_MAP[ReviewerStatus.Skipped].label }
                            ]}
                            onChange={(val) => setFilters(f => ({
                                ...f,
                                status: val ? (Number(val) as ReviewerStatus) : null
                            }))}
                        />

                        <div className="flex items-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setFilters(INITIAL_FILTERS)}
                                className="text-red-400 hover:bg-red-500/10"
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
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Mã NV</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Mã Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold text-sm">Hạn Chót</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-24 text-sm">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : appraisals.length > 0 ? (
                                    appraisals.map((appraisal) => {
                                        const statusConfig = REVIEWER_STATUS_MAP[appraisal.status] || {
                                            label: "Không xác định",
                                            color: "text-gray-400 bg-gray-900/20"
                                        };

                                        return (
                                            <tr
                                                key={appraisal.assignmentId}
                                                className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                                onClick={() => handleViewDetail(appraisal.assignmentId)}
                                            >
                                                <td className="p-4">
                                                    <div className="font-semibold text-white text-sm">{appraisal.reviewerName}</div>
                                                    <div className="text-xs text-gray-500">ID: {appraisal.reviewerId}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-mono text-white text-sm font-medium">{appraisal.employeeCode}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-white text-sm line-clamp-1 max-w-[250px]">{appraisal.documentTitle}</div>
                                                    <div className="text-xs text-gray-500">ID: {appraisal.documentId}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-mono text-gray-300 text-sm">{appraisal.documentCode}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-sm font-medium ${getDeadlineStyle(appraisal.deadline)}`}>
                                                        {formatDate(appraisal.deadline)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewDetail(appraisal.assignmentId);
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
                                            Không tìm thấy đánh giá nào phù hợp với bộ lọc.
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
                            onPageChange={(page) => loadAppraisals(page)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PendingAppraisalResponsesPage;