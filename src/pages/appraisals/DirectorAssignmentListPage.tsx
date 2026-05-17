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
import type { AppraisalAssignmentDto } from "../../types/assignment";
import { AssignmentStatus, ASSIGNMENT_STATUS_MAP } from "../../constants/enum/AssignmentStatus";

const DirectorAssignmentListPage = () => {
    const navigate = useNavigate();

    const INITIAL_FILTERS = {
        searchTerm: "",
        status: "" as string,
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc"
    };

    const statusOptions = useMemo(() => {
        const options = [
            { value: "", label: "Tất cả trạng thái" }
        ];

        Object.entries(ASSIGNMENT_STATUS_MAP).forEach(([value, { label }]) => {
            options.push({ value: value.toString(), label });
        });

        return options;
    }, []);

    const [assignments, setAssignments] = useState<AppraisalAssignmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const handleCreateWithData = useCallback((item: AppraisalAssignmentDto) => {
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
            toast.error("Không thể tải danh sách phân công.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 300);
        return () => clearTimeout(handler);
    }, [filters.searchTerm, filters.status, filters.sortBy, filters.sortOrder, loadData]);

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Giám Sát Thẩm Định</h1>
                    <p className="text-primary-400 mt-1 font-medium">Ban Giám đốc theo dõi luồng tài liệu liên Trung tâm</p>
                </header>

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
                            options={statusOptions}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />

                        <div className="flex items-end">
                            <Button variant="ghost" onClick={() => setFilters(INITIAL_FILTERS)} className="text-red-400 hover:bg-red-500/10 h-10 w-full md:w-auto">
                                Xóa lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/70 border-b border-dark-700 text-[13px]">
                                    <th className="p-4 text-primary-300 font-bold uppercase tracking-wider">Hồ Sơ / Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-bold uppercase tracking-wider text-center">Phiên Bản</th>
                                    <th className="p-4 text-primary-300 font-bold uppercase tracking-wider">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-bold uppercase tracking-wider text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <TableLoader colSpan={5} />
                                ) : assignments.length > 0 ? (
                                    assignments.map((item) => (
                                        <tr key={item.id} className="hover:bg-primary-500/5 transition-colors cursor-pointer group" onClick={() => navigate(`/appraisals/assignments/${item.id}`)}>
                                            <td className="p-4">
                                                <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">{item.documentTitle}</div>
                                                <div className="text-[11px] text-gray-500 font-mono mt-1 uppercase tracking-widest">{item.documentCode}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-dark-700 px-2 py-0.5 rounded text-xs text-gray-300">v{item.versionNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                {ASSIGNMENT_STATUS_MAP[AssignmentStatus[item.status as unknown as keyof typeof AssignmentStatus]]?.label}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <ActionIconBtn icon="📋" title="Quản lý phân công" onClick={() => navigate(`/appraisals/listAssignments/${item.requestVersionId}`)} colorClass="hover:bg-blue-500/20 text-blue-400 border-blue-500/30" />
                                                    <ActionIconBtn icon="👁️" title="Xem chi tiết" onClick={() => navigate(`/appraisals/assignments/${item.id}`)} colorClass="hover:bg-green-500/20 text-green-400 border-green-500/30" />
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
                                    <EmptyRow colSpan={5} />
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
                            onPageChange={(page) => {
                                setPagination(p => ({ ...p, page }));
                                loadData(page);
                            }}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const StatusBadge = ({ status }: { status: AssignmentStatus }) => {
    const config = ASSIGNMENT_STATUS_MAP[status] || { label: "N/A", color: "text-gray-400 bg-gray-900/20" };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${config.color}`}>
            {config.label}
        </span>
    );
};

const ActionIconBtn = ({ icon, title, onClick, colorClass }: any) => (
    <button
        title={title}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${colorClass}`}
    >
        {icon}
    </button>
);

const TableLoader = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </td>
    </tr>
);

const EmptyRow = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center text-gray-500 italic">
            Hiện chưa có yêu cầu thẩm định nào cần giám sát.
        </td>
    </tr>
);

export default DirectorAssignmentListPage;