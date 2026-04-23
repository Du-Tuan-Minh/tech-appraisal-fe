import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { UserRole } from "@/constants/enum/UserRole";
import { useAuth } from "@/hooks/useAuth";
import { appraisalService } from "../../services/appraisalService";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";
import { AssignmentStatus } from "@/constants/enum/AssignmentStatus";
import { ASSIGNMENT_STATUS_MAP, ASSIGNMENT_STATUS_OPTIONS } from "@/constants/mapping/ui-mapping";

const ManagerAssignmentListPage = () => {
    const navigate = useNavigate();
    const { versionId } = useParams<{ versionId: string }>();
    const { isAdmin, role } = useAuth();

    const INITIAL_FILTERS = {
        searchTerm: "",
        status: "",
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc"
    };

    const [assignments, setAssignments] = useState<AppraisalAssignmentDetailDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const loadData = useCallback(async (page: number = 1, currentFilters = filters) => {
        setIsLoading(true);
        try {
            const targetVersionId = versionId;
            const params = {
                page,
                pageSize: pagination.pageSize,
                keyword: currentFilters.searchTerm,
                status: currentFilters.status !== "" ? Number(currentFilters.status) : undefined,
                sortBy: currentFilters.sortBy,
                sortOrder: currentFilters.sortOrder
            };

            const response = await appraisalService.getManagerAssignments(targetVersionId, params);

            setAssignments(response.items);
            setPagination(prev => ({
                ...prev,
                page: response.page,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            }));
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [isAdmin, versionId, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1, filters), 300);
        return () => clearTimeout(handler);
    }, [filters, loadData]);

    const getDeadlineStyle = (deadline?: string | null) => {
        if (!deadline) return "text-gray-500 italic";
        const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
        if (diffDays < 0) return "text-red-400 font-bold underline";
        if (diffDays <= 3) return "text-orange-400 animate-pulse";
        return "text-green-400";
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {isAdmin ? "Phân Công Của Tôi" : "Tất Cả Phân Công"}
                        </h1>
                        <p className="text-primary-400/80 mt-1 font-medium">Quản lý và theo dõi tiến độ thẩm định</p>
                    </div>
                </header>

                <Card className="p-5 border-dark-700 bg-dark-900/60 backdrop-blur-md shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tên, mã tài liệu..."
                            value={filters.searchTerm}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val }))}
                        />
                        <Select
                            label="Trạng thái"
                            value={filters.status}
                            options={ASSIGNMENT_STATUS_OPTIONS}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />
                        <Select
                            label="Sắp xếp theo"
                            value={filters.sortBy}
                            options={[
                                { value: "createdAt", label: "Ngày tạo" },
                                { value: "deadline", label: "Hạn chót" },
                                { value: "documentTitle", label: "Tên tài liệu" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                        />
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                onClick={() => setFilters(INITIAL_FILTERS)}
                                className="w-full text-red-400 hover:bg-red-400/10"
                            >
                                ✕ Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/40 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/80 border-b border-dark-700">
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs">Tài liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs text-center">Version</th>
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs">Phòng Ban</th>
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs text-center">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs text-center">Hạn chót</th>
                                    <th className="p-4 text-primary-300 font-semibold uppercase text-xs text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <TableSkeleton colSpan={6} />
                                ) : assignments.length > 0 ? (
                                    assignments.map((item) => (
                                        <tr>
                                            <td className="p-4">
                                                <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                                                    {item.documentTitle}
                                                </div>
                                                <div className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-tighter">
                                                    {item.documentCode || "N/A"}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-dark-700 px-2 py-0.5 rounded text-sm text-gray-300">v{item.versionNumber}</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">{item.departmentName}</td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={item.status as AssignmentStatus} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className={`text-sm ${getDeadlineStyle(item.deadline)}`}>
                                                    {item.deadline ? new Date(item.deadline).toLocaleDateString("vi-VN") : "---"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                    {role === UserRole.Manager && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="h-8 px-3 text-[11px]"
                                                            onClick={() => navigate(`/appraisals/department/${item.departmentId}/assignment/staff/${item.id}`)}
                                                        >
                                                            + Gán việc
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-[11px] border border-dark-600 hover:border-primary-500"
                                                        onClick={() => navigate(`/appraisals/assignment/${item.id}`)}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-[11px] border border-dark-600 hover:border-primary-500"
                                                        onClick={() => navigate(`/appraisals/list-reviewer-assignments/${item.id}`)}
                                                    >
                                                        Danh sách phân công
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <EmptyState colSpan={6} />
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {!isLoading && pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => loadData(page)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const StatusBadge = ({ status }: { status: AssignmentStatus }) => {
    const config = ASSIGNMENT_STATUS_MAP[status] || { label: "Unknown", color: "text-gray-400 bg-gray-500/10" };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-current/10 ${config.color}`}>
            {config.label}
        </span>
    );
};

const TableSkeleton = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
            <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
        </td>
    </tr>
);

const EmptyState = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center">
            <div className="text-gray-600 mb-2">📁</div>
            <p className="text-gray-500 italic text-sm font-light">Không có phân công nào được tìm thấy.</p>
        </td>
    </tr>
);

export default ManagerAssignmentListPage;