import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import type { DashboardSummaryCoordinatorDto } from "../../types/dashboard";

const COORDINATOR_METRICS_CONFIG = [
    {
        key: "totalDepartments",
        title: "TỔNG SỐ PHÒNG BAN QUẢN LÝ",
        icon: <span className="text-xl">🏢</span>,
        color: "border-blue-500",
        routePath: "/centers"
    },
    {
        key: "pendingAssignments",
        title: "NHIỆM VỤ ĐIỀU PHỐI TÀI LIỆU",
        icon: <span className="text-xl">⏳</span>,
        color: "border-yellow-500",
        routePath: "/incoming-appraisal-documents"
    }
] as const;

const CoordinatorDashboardPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummaryCoordinatorDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchCoordinatorData = async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getCoordinatorSummary();
                if (data && isMounted) {
                    setSummary(data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("[Coordinator Dashboard Error]", error);
                    toast.error("Không thể tải dữ liệu điều phối từ hệ thống.");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchCoordinatorData();
        return () => { isMounted = false; };
    }, []);

    const handleCardClick = (path: string) => {
        navigate(path);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-11 w-11 border-t-2 border-purple-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#090d16] min-h-screen text-gray-300">

                <div className="border-b border-gray-800/80 pb-4">
                    <h1 className="text-xl font-bold text-white tracking-tight">Bảng kiểm soát điều phối viên</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Giám sát tổng quan phòng ban và phân phối luồng công việc</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {COORDINATOR_METRICS_CONFIG.map((metric) => {
                        const count = summary ? Number(summary[metric.key as keyof DashboardSummaryCoordinatorDto] || 0) : 0;

                        return (
                            <StatCard
                                key={metric.key}
                                title={metric.title}
                                count={count}
                                icon={metric.icon}
                                isActive={true}
                                activeBorderColor={metric.color}
                                onClick={() => handleCardClick(metric.routePath)}
                            />
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default CoordinatorDashboardPage;