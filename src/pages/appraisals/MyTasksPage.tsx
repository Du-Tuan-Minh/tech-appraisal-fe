import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select, Pagination } from "@/components/ui";
import { documentService } from "@/services/documentService";

import { DocumentStatus, DOCUMENT_STATUS_MAP } from "@/constants/enum/DocumentStatus";
import { IssueSeverity, ISSUE_SEVERITY_MAP } from "@/constants/enum/IssueSeverity";

import type { TechnicalDocumentResponseDto, DocumentFilterDto } from "@/types/document";

const MyTasksPage = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<TechnicalDocumentResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });

    const [filters, setFilters] = useState<DocumentFilterDto>({
        page: 1,
        pageSize: 10,
        searchTerm: "",
        status: null,
        type: null
    });

    const statusOptions = useMemo(() => [
        { value: "", label: "Tất cả trạng thái" },
        ...Object.entries(DOCUMENT_STATUS_MAP).map(([value, { label }]) => ({ value, label }))
    ], []);

    const priorityOptions = useMemo(() => [
        { value: "", label: "Tất cả mức độ" },
        ...Object.entries(ISSUE_SEVERITY_MAP).map(([value, { label }]) => ({ value, label }))
    ], []);

    const fetchTasks = useCallback(async (pageNumber: number = 1) => {
        setIsLoading(true);
        try {
            const response = await documentService.getMyTasks({
                ...filters,
                page: pageNumber
            });
            setTasks(response.items);
            setPagination({ page: response.page, totalPages: response.totalPages });
        } catch (err: any) {
            toast.error("Không thể tải danh sách nhiệm vụ.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks(filters.page);
    }, [filters.page, fetchTasks]);

    const handleDetailClick = useCallback((task: TechnicalDocumentResponseDto) => {
        const { id: docId, currentVersionId, currentReviewerId, currentAssignmentId } = task;

        const params = new URLSearchParams();
        if (currentReviewerId) {
            params.append("reviewerId", currentReviewerId);
        }

        if (currentAssignmentId) {
            params.append("assignmentId", currentAssignmentId);
        }

        const query = params.toString();

        navigate(
            `/appraisals/${docId}/review/${currentVersionId}${query ? `?${query}` : ""}`
        );
    }, [navigate]);

    const handleActionClick = useCallback((task: TechnicalDocumentResponseDto) => {
        const { currentAssignmentId: currentAssignmentId } = task;
        const hasAssignment = currentAssignmentId && currentAssignmentId !== "00000000-0000-0000-0000-000000000000";

        if (hasAssignment) {
            navigate(`/appraisals/assignment-detail/${currentAssignmentId}`);
        }
    }, [navigate]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fadeIn">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white italic tracking-tight uppercase">
                        Nhiệm Vụ Của Tôi
                    </h1>
                    <p className="text-primary-400 italic text-sm">Hệ thống thẩm định kỹ thuật tập trung</p>
                </header>

                <Card className="p-6 bg-dark-900/40 border-dark-800 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            label="Tìm kiếm mã/tiêu đề"
                            placeholder="Nhập nội dung..."
                            value={filters.searchTerm || ""}
                            onChange={(v) => setFilters(f => ({ ...f, searchTerm: v, page: 1 }))}
                        />
                        <Select
                            label="Trạng thái hồ sơ"
                            options={statusOptions}
                            value={String(filters.status ?? "")}
                            onChange={(v) => setFilters(f => ({ ...f, status: v ? Number(v) as DocumentStatus : null, page: 1 }))}
                        />
                        <Select
                            label="Mức độ ưu tiên"
                            options={priorityOptions}
                            value={String(filters.type ?? "")}
                            onChange={(v) => setFilters(f => ({ ...f, type: v ? Number(v) as any : null, page: 1 }))}
                        />
                        <div className="flex items-end gap-2">
                            <Button className="flex-1 bg-primary-600 hover:bg-primary-500" onClick={() => fetchTasks(1)}>
                                Lọc dữ liệu
                            </Button>
                            <Button variant="ghost" onClick={() => setFilters({ page: 1, pageSize: 10, searchTerm: "", status: null, type: null })}>
                                Xóa lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-t-2 border-primary-500 bg-dark-900/40 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-950/60 border-b border-dark-800">
                                    <th className="p-4 text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">Thông tin hồ sơ</th>
                                    <th className="p-4 text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">Độ ưu tiên</th>
                                    <th className="p-4 text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">Trạng thái</th>
                                    <th className="p-4 text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em] text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800/50">
                                {isLoading ? (
                                    <LoadingRows />
                                ) : tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center text-gray-500 italic">
                                            Danh sách nhiệm vụ trống.
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map(task => {
                                        const severityValue = IssueSeverity[task.priority as unknown as keyof typeof IssueSeverity];
                                        const severity = ISSUE_SEVERITY_MAP[severityValue] || { label: "Unknown", color: "text-gray-400 bg-gray-900/20" };

                                        const statusValue = DocumentStatus[task.status as unknown as keyof typeof DocumentStatus];
                                        const status = DOCUMENT_STATUS_MAP[statusValue] || { label: "N/A", color: "text-gray-500 bg-dark-800" };

                                        const hasAssignment = task.currentAssignmentId && task.currentAssignmentId !== "00000000-0000-0000-0000-000000000000";

                                        return (
                                            <tr
                                                key={task.id}
                                                className="hover:bg-primary-500/5 transition-all cursor-pointer group"
                                                onClick={() => handleActionClick(task)}
                                            >
                                                <td className="p-4">
                                                    <div className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors uppercase line-clamp-1">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-xs text-gray-300 mt-0.5 line-clamp-1">{task.requesterName}</div>
                                                    <div className="text-[10px] text-gray-500 mt-1 flex gap-2 items-center">
                                                        <span className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300">{task.departmentName}</span>
                                                        <span>•</span>
                                                        <span>{new Date(task.createdAt).toLocaleDateString("vi-VN")}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] px-2 py-1 rounded-sm font-black uppercase tracking-tighter ${severity.color}`}>
                                                        {severity.label}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${status.color.split(' ')[0]}`}></div>
                                                        <span className={`text-xs font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {hasAssignment && (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="h-8 text-[10px] font-bold uppercase tracking-widest px-4 shadow-lg shadow-primary-900/20"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActionClick(task);
                                                                }}
                                                            >
                                                                Chi tiết
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-[10px] font-bold uppercase tracking-widest px-3 border-dark-700 hover:bg-dark-800 text-gray-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDetailClick(task);
                                                            }}
                                                        >
                                                            Thẩm định
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
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
                <td colSpan={4} className="p-8 border-b border-dark-800/30">
                    <div className="h-4 bg-dark-800 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-dark-800/50 rounded w-1/4"></div>
                </td>
            </tr>
        ))}
    </>
);

export default MyTasksPage;