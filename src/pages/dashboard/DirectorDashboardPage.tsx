import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import type { DashboardSummaryDirectorDto, ManagerWorkloadDto } from "@/types/dashboard";

const DirectorDashboardPage = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState<DashboardSummaryDirectorDto | null>(null);
    const [workloads, setWorkloads] = useState<ManagerWorkloadDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(5);
    const [totalCount, setTotalCount] = useState<number>(0);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 40000000);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        let isMounted = true;

        const fetchSummaryData = async () => {
            try {
                const summaryRes = await dashboardService.getDirectorSummary();
                if (isMounted) {
                    setSummary(summaryRes);
                }
            } catch (err: any) {
                console.error("[Director Summary Error]:", err);
                toast.error("Không thể tải dữ liệu tổng quan thống kê.");
            }
        };

        fetchSummaryData();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchWorkloadData = async () => {
            setIsTableLoading(true);
            try {
                const workloadsRes = await dashboardService.getManagerWorkloads(
                    page,
                    pageSize,
                    debouncedSearch.trim() || null
                );

                if (isMounted) {
                    setWorkloads(workloadsRes?.items || []);
                    setTotalCount(workloadsRes?.totalCount || 0);
                }
            } catch (err: any) {
                console.error("[Director Workloads Error]:", err);
                toast.error("Không thể tải danh sách khối lượng công việc quản lý.");
            } finally {
                if (isMounted) {
                    setIsTableLoading(false);
                    setIsLoading(false); // Tắt loading tổng sau khi dữ liệu đầu tiên được nạp xong
                }
            }
        };

        fetchWorkloadData();
        return () => { isMounted = false; };
    }, [page, pageSize, debouncedSearch]);

    // Điều hướng chi tiết tài liệu theo trạng thái
    const handleStatCardClick = (statusRoute: string) => {
        navigate(`/director/documents?status=${statusRoute}&page=1`);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#090d16] min-h-screen text-gray-300">

                {/* Tiêu đề Dashboard */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/60 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Hệ Thống Giám Sát Ban Giám Đốc</h1>
                        <p className="text-gray-500 text-xs mt-1">Báo cáo tổng quan tiến độ xử lý văn bản, chỉ tiêu kỹ thuật toàn hệ thống.</p>
                    </div>
                </div>

                {/* Hàng 1: Thống kê tổng số lượng dạng Grid Grid-cols-5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    <StatCard
                        title="ĐANG SOẠN THẢO"
                        count={summary?.draftingCount || 0}
                        icon={<span className="text-blue-400">📝</span>}
                        activeBorderColor="border-blue-500"
                        onClick={() => handleStatCardClick("Drafting")}
                    />
                    <StatCard
                        title="ĐANG THẨM ĐỊNH"
                        count={summary?.appraisingCount || 0}
                        icon={<span className="text-amber-400">⚖️</span>}
                        activeBorderColor="border-amber-500"
                        onClick={() => handleStatCardClick("Appraising")}
                    />
                    <StatCard
                        title="CHỜ KÝ DUYỆT"
                        count={summary?.signingCount || 0}
                        icon={<span className="text-indigo-400">✍️</span>}
                        activeBorderColor="border-indigo-500"
                        onClick={() => handleStatCardClick("Signing")}
                    />
                    <StatCard
                        title="ĐÃ BAN HÀNH"
                        count={summary?.issuedCount || 0}
                        icon={<span className="text-green-400">📜</span>}
                        activeBorderColor="border-green-500"
                        onClick={() => handleStatCardClick("Issued")}
                    />
                    <StatCard
                        title="BỊ TỪ CHỐI"
                        count={summary?.rejectedCount || 0}
                        icon={<span className="text-red-400">❌</span>}
                        activeBorderColor="border-red-500"
                        onClick={() => handleStatCardClick("Rejected")}
                    />
                </div>

                {/* Hàng 2: Điểm nóng cần chú ý khẩn cấp */}
                {summary && summary.overdueSigningCount > 0 && (
                    <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-900/40 rounded-xl gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl flex-shrink-0 animate-pulse">🚨</span>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-red-400">Cảnh báo điểm nghẽn hệ thống</h4>
                                <p className="text-gray-400 text-xs mt-0.5 truncate">
                                    Hiện đang có <span className="font-bold text-red-400">{summary.overdueSigningCount}</span> tài liệu đã quá hạn ký duyệt của cấp Quản lý.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/director/documents?filter=overdue&page=1")}
                            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 whitespace-nowrap"
                        >
                            Xử lý ngay
                        </button>
                    </div>
                )}

                {/* Hàng 3: Bảng quản lý khối lượng công việc cấp dưới */}
                <Card className="p-6 w-full flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                📊 Khối Lượng Công Việc Của Trưởng Phòng
                            </h2>
                            <p className="text-gray-500 text-xs mt-0.5">Theo dõi chi tiết số lượng bàn giao xử lý của từng Manager phụ trách đơn vị</p>
                        </div>

                        {/* Thanh tìm kiếm */}
                        <div className="w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Tìm theo tên quản lý, bộ phận..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#111827] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table Render dữ liệu */}
                    <div className="overflow-x-auto min-h-[250px] relative">
                        {isTableLoading && (
                            <div className="absolute inset-0 bg-[#090d16]/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                            </div>
                        )}

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider font-mono">
                                    <th className="pb-3 font-semibold">Quản lý</th>
                                    <th className="pb-3 font-semibold">Bộ phận phòng ban</th>
                                    <th className="pb-3 text-center font-semibold">Chờ giao việc</th>
                                    <th className="pb-3 text-center font-semibold">Đang đánh giá</th>
                                    <th className="pb-3 text-center font-semibold">Đã quá hạn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50 text-sm">
                                {workloads.length > 0 ? (
                                    workloads.map((row) => (
                                        <tr key={row.managerId} className="group hover:bg-gray-800/10 transition-colors">
                                            <td className="py-3.5 font-medium text-white group-hover:text-blue-400 transition-colors">
                                                {row.managerName}
                                            </td>
                                            <td className="py-3.5 text-gray-400">{row.departmentName}</td>
                                            <td className="py-3.5 text-center font-semibold text-gray-300">
                                                <span className="bg-gray-800/40 px-2 py-0.5 rounded border border-gray-700/20">{row.pendingAssignments}</span>
                                            </td>
                                            <td className="py-3.5 text-center font-semibold text-amber-400">
                                                <span className="bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">{row.inReviewAssignments}</span>
                                            </td>
                                            <td className="py-3.5 text-center font-semibold">
                                                <span className={`px-2 py-0.5 rounded border ${row.overdueAssignments > 0
                                                    ? "text-red-400 bg-red-500/5 border-red-500/20 font-bold"
                                                    : "text-gray-500 bg-gray-800/10 border-transparent font-normal"
                                                    }`}>
                                                    {row.overdueAssignments}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-gray-500 text-sm">
                                            Không có dữ liệu khối lượng công việc nào trùng khớp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-800/60 pt-4 mt-4">
                            <span className="text-xs text-gray-500 font-mono">
                                Trang {page} / {totalPages} (Tổng số {totalCount} bản ghi)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    disabled={page === 1 || isTableLoading}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800/50 border border-gray-700/30 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages || isTableLoading}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800/50 border border-gray-700/30 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default DirectorDashboardPage;