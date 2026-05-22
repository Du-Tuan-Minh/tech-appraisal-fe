import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import { getTopDocumentAuthors } from "../../services/userService";
import { getTopRejectedAuthors } from "../../services/userService";
import { documentService } from "../../services/documentService";
import type { UserDocumentStatisticDto } from "../../types/user";
import type { PendingAppraisalResponseDto } from "../../types/document";

const ManagerDashboardPage = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState<any>(null);
    const [topAuthors, setTopAuthors] = useState<UserDocumentStatisticDto[]>([]);
    const [topRejectedAuthors, setTopRejectedAuthors] = useState<UserDocumentStatisticDto[]>([]);
    const [pendingAppraisals, setPendingAppraisals] = useState<PendingAppraisalResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("progress");

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [summaryRes, authorsRes, rejectedRes, pendingRes] = await Promise.all([
                    dashboardService.getManagerSummary(),
                    getTopDocumentAuthors(1, 4),
                    getTopRejectedAuthors(1, 4),
                    documentService.getPendingAppraisalResponses({ page: 1, pageSize: 5 }) // Thường hiển thị top 5 bottleneck
                ]);

                setSummary(summaryRes);
                setTopAuthors(authorsRes.items || []);
                setTopRejectedAuthors(rejectedRes.items || []);
                setPendingAppraisals(pendingRes.items || []);
            } catch (err) {
                console.error("[Dashboard Error]:", err);
                toast.error("Không thể tải thông tin hệ thống.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const calculateIdleTime = (deadline: string | null | undefined): string => {
        if (!deadline) return "24h Idle";
        const hours = Math.floor((new Date().getTime() - new Date(deadline).getTime()) / (1000 * 60 * 60));
        return `${hours > 0 ? hours : Math.abs(hours)}h Idle`;
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
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-green-500 text-sm">📈</span> Top Nhân Viên Đóng Góp
                            </h2>
                            <p className="text-gray-500 text-xs mt-0.5">Tổng số tài liệu được soạn thảo & đánh giá trong tháng</p>
                        </div>
                        <div className="divide-y divide-gray-800/60">
                            {topAuthors.map((author) => (
                                <div key={author.id} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer" onClick={() => navigate(`/users/${author.id}`)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400 uppercase">
                                            {author.fullName.charAt(0)}
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
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-red-500 text-sm">⚠️</span> Tỷ Lệ Tài Liệu Bị Trả Về Cao
                            </h2>
                            <p className="text-gray-500 text-xs mt-0.5">Nhân sự có nhiều tài liệu cần sửa đổi/bị từ chối nhiều nhất</p>
                        </div>
                        <div className="divide-y divide-gray-800/60">
                            {topRejectedAuthors.map((author) => (
                                <div key={author.id} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer" onClick={() => navigate(`/users/${author.id}`)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-red-900/30 border border-red-500/20 flex items-center justify-center text-sm font-bold text-red-400 uppercase">
                                            {author.fullName.charAt(0)}
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
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-gray-400 text-base">👥</span> ĐIỂM NGHẼN: TRỄ PHẢN HỒI
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {pendingAppraisals.map((item) => (
                            <div
                                key={item.assignmentId}
                                className="flex items-center justify-between p-4 bg-[#161f30]/50 rounded-xl border border-gray-800/20 hover:border-gray-700/60 transition-all cursor-pointer"
                                onClick={() => navigate(`/appraisals/${item.assignmentId}`)}
                            >
                                <div>
                                    <p className="text-white font-semibold text-sm">{item.reviewerName}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {item.documentTitle} — <span className="font-mono text-gray-500 text-[11px] uppercase">{item.documentCode}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                                        {calculateIdleTime(item.deadline)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </Layout>
    );
};

export default ManagerDashboardPage;