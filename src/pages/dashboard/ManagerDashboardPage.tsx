import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import { getTopDocumentAuthors, getTopRejectedAuthors } from "../../services/userService";
import { documentService } from "../../services/documentService";

import type { DashboardSummaryManagerDto } from "../../types/dashboard";
import type { UserDocumentStatisticDto } from "../../types/user";
import type { OverdueDocumentDto } from "../../types/document";

const ManagerDashboardPage = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState<DashboardSummaryManagerDto | null>(null);
    const [topAuthors, setTopAuthors] = useState<UserDocumentStatisticDto[]>([]);
    const [topRejectedAuthors, setTopRejectedAuthors] = useState<UserDocumentStatisticDto[]>([]);
    const [overdueDocuments, setOverdueDocuments] = useState<OverdueDocumentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("progress");

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [summaryRes, authorsRes, rejectedRes, overdueRes] = await Promise.all([
                    dashboardService.getManagerSummary(),
                    getTopDocumentAuthors(1, 4),
                    getTopRejectedAuthors(1, 4),
                    documentService.getOverdueDocuments({
                        page: 1,
                        pageSize: 5,
                        searchTerm: null,
                        status: null
                    })
                ]);

                if (!isMounted) return;

                setSummary(summaryRes);
                setTopAuthors(authorsRes?.items || []);
                setTopRejectedAuthors(rejectedRes?.items || []);
                setOverdueDocuments(overdueRes?.items || []);
            } catch (err) {
                console.error("[Dashboard Critical Error]:", err);
                toast.error("Không thể tải thông tin hệ thống. Vui lòng thử lại sau.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDashboardData();
        return () => { isMounted = false; };
    }, []);

    const formatOverdueDynamic = (deadline: string | null | undefined): string => {
        if (!deadline) return "Hạn linh hoạt";

        const deadlineTime = new Date(deadline).getTime();
        const nowTime = new Date().getTime();
        const diffMs = nowTime - deadlineTime;

        if (diffMs > 0) {
            const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (totalHours < 24) {
                return `${totalHours}h Idle`;
            }
            const days = Math.floor(totalHours / 24);
            return `Quá hạn ${days} ngày`;
        }

        const remainingMs = Math.abs(diffMs);
        const remainingHours = remainingMs / (1000 * 60 * 60);

        if (remainingHours < 24 && new Date(deadline).getDate() === new Date().getDate()) {
            return "Đến hạn hôm nay";
        }

        const remainingDays = Math.ceil(remainingHours / 24);
        return `Còn ${remainingDays} ngày`;
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

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#090d16] min-h-screen text-gray-300">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="TÀI LIỆU ĐANG XỬ LÝ"
                        count={summary?.internalSigningCount || 0}
                        icon={<span>📄</span>}
                        isActive={activeTab === "progress"}
                        activeBorderColor="border-blue-500"
                        onClick={() => setActiveTab("progress")}
                    />
                    <StatCard
                        title="ĐÁNH GIÁ CHỜ XỬ LÝ"
                        count={summary?.pendingReviewCount || 0}
                        icon={<span>⏱️</span>}
                        isActive={activeTab === "review"}
                        activeBorderColor="border-yellow-500"
                        onClick={() => setActiveTab("review")}
                    />
                    <StatCard
                        title="CẦN XÁC NHẬN"
                        count={summary?.needConfirmationCount || 0}
                        icon={<span>✅</span>}
                        isActive={activeTab === "confirm"}
                        activeBorderColor="border-green-500"
                        onClick={() => setActiveTab("confirm")}
                    />
                    <StatCard
                        title="TÀI LIỆU BỊ TỪ CHỐI"
                        count={summary?.rejectedCount || 0}
                        icon={<span>⚠️</span>}
                        isActive={activeTab === "rejected"}
                        activeBorderColor="border-red-500"
                        onClick={() => setActiveTab("rejected")}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6 bg-[#121824] border border-gray-800/40 rounded-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-green-500 text-sm">📈</span> Top Nhân Viên Đóng Góp
                                </h2>
                                <p className="text-gray-500 text-xs mt-0.5">Tổng số tài liệu được soạn thảo & đánh giá trong tháng</p>
                            </div>
                            <button
                                onClick={() => navigate("/users/top?type=authors")}
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                            >
                                Xem tất cả
                            </button>
                        </div>

                        <div className="divide-y divide-gray-800/60">
                            {topAuthors.map((author) => (
                                <div
                                    key={author.id}
                                    className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/users/${author.id}`);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400 uppercase">
                                            {author.fullName?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">{author.fullName}</p>
                                            <p className="text-gray-500 text-xs font-mono">{author.employeeCode}</p>
                                        </div>
                                    </div>
                                    <span className="text-white font-semibold text-sm">{author.totalDocuments}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6 bg-[#121824] border border-gray-800/40 rounded-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-red-500 text-sm">⚠️</span> Tỷ Lệ Tài Liệu Bị Trả Về Cao
                                </h2>
                                <p className="text-gray-500 text-xs mt-0.5">Nhân sự có nhiều tài liệu cần sửa đổi/bị từ chối nhiều nhất</p>
                            </div>
                            <button
                                onClick={() => navigate("/users/top?type=rejected")}
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                            >
                                Xem tất cả
                            </button>
                        </div>

                        <div className="divide-y divide-gray-800/60">
                            {topRejectedAuthors.map((author) => (
                                <div
                                    key={author.id}
                                    className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/users/${author.id}`);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-900/30 border border-red-500/20 flex items-center justify-center text-sm font-bold text-red-400 uppercase">
                                            {author.fullName?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">{author.fullName}</p>
                                            <p className="text-gray-500 text-xs font-mono">{author.employeeCode}</p>
                                        </div>
                                    </div>
                                    <span className="text-white font-semibold text-sm">{author.totalDocuments}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card className="p-6 bg-[#121824] border border-gray-800/40 rounded-xl max-w-2xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-red-400 text-base">⚠️</span> ĐIỂM NGHẼN: TRỄ PHẢN HỒI QUÁ HẠN
                        </h2>
                        <button
                            onClick={() => navigate("/manager/overdue-documents")}
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                        >
                            Xem tất cả
                        </button>
                    </div>

                    <div className="space-y-4">
                        {overdueDocuments.length > 0 ? (
                            overdueDocuments.map((item) => (
                                <div
                                    key={item.assignmentId}
                                    className="flex items-center justify-between p-4 bg-[#161f30]/50 rounded-xl border border-gray-800/20 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/appraisals/${item.assignmentId}`);
                                    }}
                                >
                                    <div>
                                        <p className="text-white font-semibold text-sm">
                                            {item.reviewerName}
                                            {item.employeeCode && (
                                                <span className="text-xs text-gray-500 font-mono font-normal ml-1.5">
                                                    ({item.employeeCode})
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5">
                                            {item.documentTitle} — <span className="font-mono text-gray-500 text-[11px] uppercase">{item.documentCode}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 clean-wrp">
                                            {formatOverdueDynamic(item.deadline)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-6">Hiện không có điểm nghẽn quá hạn nào cần xử lý.</p>
                        )}
                    </div>
                </Card>

            </div>
        </Layout>
    );
};

export default ManagerDashboardPage;