import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";

import { appraisalService } from "../../services/appraisalService";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";

export const ReviewerStatus = {
    Pending: 0,
    Reviewing: 1,
    Completed: 2
} as const;

export const REVIEWER_STATUS_LABELS = {
    [ReviewerStatus.Pending]: "Chờ thẩm định",
    [ReviewerStatus.Reviewing]: "Đang thẩm định",
    [ReviewerStatus.Completed]: "Đã hoàn thành"
};

const REVIEWER_STATUS_STYLES: Record<number, string> = {
    [ReviewerStatus.Pending]: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
    [ReviewerStatus.Reviewing]: "text-blue-400 bg-blue-900/20 border-blue-500/30",
    [ReviewerStatus.Completed]: "text-green-400 bg-green-900/20 border-green-500/30",
};

const INITIAL_FILTERS = {
    searchTerm: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc"
};

const StaffReviewerListPage = () => {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState<AppraisalAssignmentDetailDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const getDeadlineStyle = (deadline?: string | null) => {
        if (!deadline) return "text-gray-500";
        const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
        if (diffDays < 0) return "text-red-400 font-bold";
        if (diffDays <= 3) return "text-orange-400";
        return "text-green-400";
    };

    const loadData = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const params = {
                page,
                pageSize: pagination.pageSize,
                keyword: filters.searchTerm,
                status: filters.status !== "" ? Number(filters.status) : undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            const response = await appraisalService.getReviewerAssignments(params as any);
            setAssignments(response.items);
            setPagination(prev => ({
                ...prev,
                page: response.page,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            }));
        } catch (err) {
            toast.error("Không thể tải danh sách phân công.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 300);
        return () => clearTimeout(handler);
    }, [filters, loadData]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Danh Sách Reviewer</h1>
                        <p className="text-primary-400 mt-1">Quản lý các phân công thẩm định cho staff</p>
                    </div>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            label="Tìm kiếm nhanh"
                            placeholder="Mã số, tên tài liệu..."
                            value={filters.searchTerm}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val }))}
                        />
                        <Select
                            label="Trạng thái"
                            value={filters.status}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                ...Object.entries(REVIEWER_STATUS_LABELS).map(([value, label]) => ({ value, label }))
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />
                        <Select
                            label="Sắp xếp theo"
                            value={filters.sortBy}
                            options={[
                                { value: "createdAt", label: "Ngày tạo" },
                                { value: "deadline", label: "Hạn định" },
                                { value: "documentTitle", label: "Tên hồ sơ" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                        />
                        <div className="flex items-end">
                            <Button variant="ghost" onClick={() => setFilters(INITIAL_FILTERS)} className="text-red-400">
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
                                    <th className="p-4 text-primary-300 font-semibold">Hồ Sơ / Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold text-center">Phiên Bản</th>
                                    <th className="p-4 text-primary-300 font-semibold">Đơn Vị Chịu Trách Nhiệm</th>
                                    <th className="p-4 text-primary-300 font-semibold text-center">Reviewers</th>
                                    <th className="p-4 text-primary-300 font-semibold">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold">Hạn Thẩm Định</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-44">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <LoadingState colSpan={7} />
                                ) : assignments.length > 0 ? (
                                    assignments.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/appraisals/reviewer-assignments/${item.id}`)}
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{item.documentTitle}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-1">{item.documentCode}</div>
                                            </td>
                                            <td className="p-4 text-center text-gray-300">
                                                <span className="bg-dark-700 px-2 py-0.5 rounded text-xs border border-dark-600">v{item.versionNumber}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="text-sm">{item.departmentName}</div>
                                                <div className="text-[10px] text-primary-500/70 uppercase">Quản lý: {item.responsibleManagerName}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="text-white font-medium">{item.reviewerCount}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${REVIEWER_STATUS_STYLES[item.status] || "text-gray-400 border-gray-500"}`}>
                                                    {REVIEWER_STATUS_LABELS[item.status as keyof typeof REVIEWER_STATUS_LABELS] || "Không xác định"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className={`text-sm ${getDeadlineStyle(item.deadline)}`}>
                                                    {item.deadline ? new Date(item.deadline).toLocaleDateString("vi-VN") : "---"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/appraisals/reviewer-assignments/${item.id}`)}
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => navigate(`/appraisals/staff-assignment/${item.id}`)}
                                                    >
                                                        Phân Công
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-gray-500">Hiện chưa có phân công nào.</td>
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
                            onPageChange={loadData}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const LoadingState = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center">
            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </td>
    </tr>
);

export default StaffReviewerListPage;