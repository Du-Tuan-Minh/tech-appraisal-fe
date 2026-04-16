import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// UI Components
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

// Services & Types
import { appraisalService } from "../../services/appraisalService";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";
import { AssignmentStatus } from "../../constants/enum/AssignmentStatus";

const AssignmentListPage = () => {
    const navigate = useNavigate();

    // --- Configuration Constants ---
    const STATUS_MAP = useMemo(() => ({
        [0]: { label: "Pending", color: "text-yellow-400 bg-yellow-900/20" },
        [1]: { label: "In Progress", color: "text-blue-400 bg-blue-900/20" },
        [2]: { label: "Completed", color: "text-green-400 bg-green-900/20" },
        [3]: { label: "Cancelled", color: "text-red-400 bg-red-900/20" },
    }), []);

    const INITIAL_FILTERS = {
        searchTerm: "",
        status: "" as string,
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc"
    };

    // --- States ---
    const [assignments, setAssignments] = useState<AppraisalAssignmentDetailDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    // --- Logic Fetch Data ---
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

            const response = await appraisalService.getAssignments(params as any);

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

    // Trigger load khi filter thay đổi (có debounce cho search)
    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 300);
        return () => clearTimeout(handler);
    }, [filters.searchTerm, filters.status, filters.sortBy, filters.sortOrder, loadData]);

    // --- Actions ---
    const clearFilters = () => setFilters(INITIAL_FILTERS);

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
                        <h1 className="text-3xl font-bold text-white">Danh Sách Phân Công</h1>
                        <p className="text-gray-400 mt-1">Quản lý và theo dõi tiến độ thẩm định tài liệu kỹ thuật</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/appraisals/assignment/create')}>
                        Tạo Phân Công Mới
                    </Button>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/50 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tên, mã tài liệu..."
                            value={filters.searchTerm}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val }))}
                        />
                        <Select
                            label="Trạng thái"
                            value={filters.status}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                { value: "0", label: "Pending" },
                                { value: "1", label: "In Progress" },
                                { value: "2", label: "Completed" },
                                { value: "3", label: "Cancelled" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />
                        <Select
                            label="Sắp xếp"
                            value={filters.sortBy}
                            options={[
                                { value: "createdAt", label: "Ngày tạo" },
                                { value: "deadline", label: "Hạn chót" },
                                { value: "documentTitle", label: "Tên tài liệu" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                        />
                        <div className="flex items-end gap-2">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setFilters(f => ({ ...f, sortOrder: f.sortOrder === 'asc' ? 'desc' : 'asc' }))}
                            >
                                {filters.sortOrder === 'asc' ? "Tang dan" : "Giam dan"}
                            </Button>
                            <Button variant="ghost" onClick={clearFilters} className="text-red-400 hover:text-red-300">
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-dark-800/50">
                                <tr className="border-b border-dark-700">
                                    <th className="p-4 text-primary-400 font-semibold">Tên Tài Liệu</th>
                                    <th className="p-4 text-primary-400 font-semibold text-center">Phiên Bản</th>
                                    <th className="p-4 text-primary-400 font-semibold">Phòng Ban</th>
                                    <th className="p-4 text-primary-400 font-semibold">Trạng Thái</th>
                                    <th className="p-4 text-primary-400 font-semibold">Deadline</th>
                                    <th className="p-4 text-center text-primary-400 font-semibold">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : assignments.length > 0 ? (
                                    assignments.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-dark-800/50 transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/appraisals/assignments/${item.id}`)}
                                        >
                                            <td className="p-4">
                                                <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                                                    {item.documentTitle}
                                                </div>
                                                {item.documentCode && (
                                                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                                        {item.documentCode}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center text-gray-300">v{item.versionNumber}</td>
                                            <td className="p-4 text-gray-300">{item.departmentName}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_MAP[item.status as keyof typeof STATUS_MAP]?.color || "text-gray-400 bg-gray-900/20"}`}>
                                                    {STATUS_MAP[item.status as keyof typeof STATUS_MAP]?.label || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-sm ${getDeadlineStyle(item.deadline)}`}>
                                                    {item.deadline ? new Date(item.deadline).toLocaleDateString("vi-VN") : "Khong co deadline"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/appraisals/assignments/${item.id}`);
                                                    }}
                                                >
                                                    Xem chi tiet
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-500 italic">
                                            Không có phân công nào được tìm thấy.
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

export default AssignmentListPage;