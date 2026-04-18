import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { appraisalService } from "../../services/appraisalService";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";

const DirectorAssignmentListPage = () => {
    const navigate = useNavigate();

    const STATUS_MAP = useMemo(() => ({
        0: { label: "Đang chờ", color: "text-yellow-400 bg-yellow-900/20" },
        1: { label: "Đang thực hiện", color: "text-blue-400 bg-blue-900/20" },
        2: { label: "Đã hoàn thành", color: "text-green-400 bg-green-900/20" },
        3: { label: "Đã hủy", color: "text-red-400 bg-red-900/20" },
    }), []);

    const INITIAL_FILTERS = {
        searchTerm: "",
        status: "" as string,
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
    const handleCreateWithData = useCallback((item: AppraisalAssignmentDetailDto) => {
        const params = new URLSearchParams({
            documentId: item.documentId || "",
            parentId: item.departmentId || "",
            title: item.documentTitle || "",
            code: item.documentCode || "",
            v: (item.versionNumber || 0).toString()
        });
        navigate(`/appraisals/assignment/create/${item.requestVersionId}?${params.toString()}`);
    }, [navigate]);

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

            const response = await appraisalService.getDirectorAssignments(params as any);

            setAssignments(response.items);
            setPagination(prev => ({
                ...prev,
                page: response.page,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            }));
        } catch (err) {
            toast.error("Không thể tải danh sách phân công của Giám đốc.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 300);
        return () => clearTimeout(handler);
    }, [filters.searchTerm, filters.status, filters.sortBy, filters.sortOrder, loadData]);

    const getDeadlineStyle = (deadline?: string | null) => {
        if (!deadline) return "text-gray-400";
        const diffDays = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
        if (diffDays < 0) return "text-red-400 font-bold";
        if (diffDays <= 3) return "text-orange-400";
        return "text-green-400";
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Giám Sát Thẩm Định</h1>
                        <p className="text-primary-400 mt-1">Ban Giám đốc theo dõi luồng tài liệu liên Trung tâm</p>
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
                            label="Trạng thái tài liệu"
                            value={filters.status}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                { value: "0", label: "Đang chờ (Pending)" },
                                { value: "1", label: "Đang xử lý (In Progress)" },
                                { value: "2", label: "Hoàn thành (Completed)" },
                                { value: "3", label: "Từ chối/Hủy (Cancelled)" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />
                        <Select
                            label="Sắp xếp theo"
                            value={filters.sortBy}
                            options={[
                                { value: "createdAt", label: "Ngày trình ký" },
                                { value: "deadline", label: "Hạn định" },
                                { value: "documentTitle", label: "Tên hồ sơ" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                        />
                        <div className="flex items-end gap-2">
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
                                    <th className="p-4 text-center text-primary-300 font-semibold w-44">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : assignments.length > 0 ? (
                                    assignments.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/appraisals/assignments/${item.id}`)}
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{item.documentTitle}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-1">{item.documentCode}</div>
                                            </td>
                                            <td className="p-4 text-center text-gray-300">
                                                <span className="bg-dark-700 px-2 py-0.5 rounded text-xs">v{item.versionNumber}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="text-sm">{item.departmentName}</div>
                                                <div className="text-[10px] text-primary-500/70 uppercase">Quản lý: {item.responsibleManagerName}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="text-white font-medium">{item.reviewerCount}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_MAP[item.status as keyof typeof STATUS_MAP]?.color}`}>
                                                    {STATUS_MAP[item.status as keyof typeof STATUS_MAP]?.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className={`text-sm ${getDeadlineStyle(item.deadline)}`}>
                                                    {item.deadline ? new Date(item.deadline).toLocaleDateString("vi-VN") : "---"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Nút 1: Đi tới Danh sách Phân công (AssignmentListPage) */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                        title="Quản lý danh sách phân công"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/appraisals/listAssignments/${item.requestVersionId}`);
                                                        }}
                                                    >
                                                        📋
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-green-500/20 text-green-400 border border-green-500/30"
                                                        title="Xem chi tiết hồ sơ"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/appraisals/assignment/${item.id}`);
                                                        }}
                                                    >
                                                        👁️
                                                    </Button>

                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="shadow-lg shadow-primary-500/20"
                                                        title="Tạo phân công mới"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCreateWithData(item);
                                                        }}
                                                    >
                                                        Tạo Phân Công
                                                    </Button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-20 text-center text-gray-500">
                                            Hiện chưa có yêu cầu thẩm định nào cần giám sát.
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
                            onPageChange={(page) => loadData(page)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DirectorAssignmentListPage;