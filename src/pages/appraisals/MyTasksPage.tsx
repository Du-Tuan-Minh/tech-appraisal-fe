import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select, Pagination } from "@/components/ui";
import { documentService } from "@/services/documentService";
import { DocumentStatus, DOCUMENT_STATUS_LABELS } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
import type { TechnicalDocumentResponseDto } from "@/types/document";
import { useAuth } from "@/hooks/useAuth";

const MyTasksPage = () => {
    const navigate = useNavigate();
    const { isManager } = useAuth();
    const [tasks, setTasks] = useState<TechnicalDocumentResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });

    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: "",
        status: undefined as DocumentStatus | undefined,
        priority: undefined as IssueSeverity | undefined
    });

    const statusOptions = useMemo(() => [
        { value: "", label: "Tất cả trạng thái" },
        ...Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))
    ], []);

    const priorityOptions = useMemo(() => [
        { value: "", label: "Tất cả mức độ" },
        ...Object.entries(ISSUE_SEVERITY_LABELS).map(([value, label]) => ({ value, label }))
    ], []);

    const fetchTasks = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await documentService.getMyTasks({ ...filters, page });
            setTasks(response.items);
            setPagination({ page: response.page, totalPages: response.totalPages });
        } catch (err) {
            toast.error("Không thể tải danh sách nhiệm vụ.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskClick = (task: TechnicalDocumentResponseDto) => {
        // Lấy ID phân công (nếu có)
        const assignmentId = task.currentAssignmentId || (task as any).CurrentAssignmentId;

        if (isManager) {
            if (assignmentId && assignmentId !== "0") {
                // Đã giao việc -> Vào trang quản lý phân công
                navigate(`/appraisals/assignment/${assignmentId}`);
            } else {
                // CHƯA GIAO VIỆC -> Manager vào duyệt nội bộ (truyền documentId để lấy thông tin)
                navigate(`/appraisals/internal/new?documentId=${task.id}`);
            }
        } else {
            // Nhân viên
            if (assignmentId && assignmentId !== "0") {
                navigate(`/appraisals/staff-review/${assignmentId}`);
            } else {
                toast.error("Hồ sơ đang chờ duyệt nội bộ.");
            }
        }
    };

    const getSeverityStyle = (severity: IssueSeverity) => {
        const styles: Record<IssueSeverity, string> = {
            [IssueSeverity.Information]: "text-blue-400 bg-blue-900/20",
            [IssueSeverity.Low]: "text-green-400 bg-green-900/20",
            [IssueSeverity.Medium]: "text-yellow-400 bg-yellow-900/20",
            [IssueSeverity.Warning]: "text-orange-400 bg-orange-900/20",
            [IssueSeverity.High]: "text-red-400 bg-red-900/20",
            [IssueSeverity.Critical]: "text-red-600 bg-red-900/40 border border-red-500/50",
        };
        return styles[severity] || "text-gray-400 bg-gray-900/20";
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fadeIn">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white italic tracking-tight">Nhiệm Vụ Của Tôi</h1>
                        <p className="text-primary-400 mt-1 italic text-sm">Quản lý và xử lý các hồ sơ thẩm định kỹ thuật được phân công</p>
                    </div>
                </header>

                <Card className="p-6 bg-dark-900/40 border-dark-800">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tiêu đề tài liệu..."
                            value={filters.searchTerm}
                            onChange={(v) => setFilters(f => ({ ...f, searchTerm: v }))}
                        />
                        <Select
                            label="Trạng thái"
                            options={statusOptions}
                            value={String(filters.status ?? "")}
                            onChange={(v) => setFilters(f => ({ ...f, status: v ? Number(v) as DocumentStatus : undefined }))}
                        />
                        <Select
                            label="Độ ưu tiên"
                            options={priorityOptions}
                            value={String(filters.priority ?? "")}
                            onChange={(v) => setFilters(f => ({ ...f, priority: v ? Number(v) as IssueSeverity : undefined }))}
                        />
                        <div className="flex items-end gap-2">
                            <Button className="flex-1" onClick={() => fetchTasks(1)}>Lọc kết quả</Button>
                            <Button variant="ghost" onClick={() => {
                                setFilters({ page: 1, pageSize: 10, searchTerm: "", status: undefined, priority: undefined });
                                fetchTasks(1);
                            }}>Xóa</Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-t-2 border-primary-500 bg-dark-900/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-dark-950/50 border-b border-dark-800">
                                    <th className="p-4 text-xs font-bold text-primary-400 uppercase tracking-widest">Hồ sơ kỹ thuật</th>
                                    <th className="p-4 text-xs font-bold text-primary-400 uppercase tracking-widest">Độ ưu tiên</th>
                                    <th className="p-4 text-xs font-bold text-primary-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="p-4 text-xs font-bold text-primary-400 uppercase tracking-widest text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <LoadingRows />
                                ) : tasks.length === 0 ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-gray-500 italic">Hiện không có nhiệm vụ nào cần xử lý.</td></tr>
                                ) : (
                                    tasks.map(task => (
                                        <tr key={task.id} className="hover:bg-primary-500/5 transition-colors cursor-pointer group" onClick={() => handleTaskClick(task)}>
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{task.title}</div>
                                                <div className="text-[10px] text-gray-500 mt-1 font-mono uppercase">{task.departmentName} • {new Date(task.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${getSeverityStyle(Number(task.priority) as IssueSeverity)}`}>
                                                    {ISSUE_SEVERITY_LABELS[Number(task.priority) as IssueSeverity] || `${task.priority}`}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-300 font-medium border-l-2 border-dark-600 pl-2">
                                                    {DOCUMENT_STATUS_LABELS[Number(task.status) as DocumentStatus] || `${task.status}`}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary-500 font-bold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTaskClick(task);
                                                    }}
                                                >
                                                    {isManager
                                                        ? (task.currentAssignmentId ? "Giao việc" : "Duyệt nội bộ")
                                                        : "Thẩm định"
                                                    }
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={fetchTasks}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const LoadingRows = () => (
    <>
        {[1, 2, 3].map(i => (
            <tr key={i} className="animate-pulse">
                <td colSpan={4} className="p-6 bg-dark-800/20 mb-2"></td>
            </tr>
        ))}
    </>
);

export default MyTasksPage;