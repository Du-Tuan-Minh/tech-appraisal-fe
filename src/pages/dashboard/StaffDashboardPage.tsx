import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import type { DashboardSummaryStaffDto } from "../../types/dashboard";
import { StaffDashboardDocumentType } from "../../constants/enum/StaffDashboardDocumentType";

const TOP_METRICS_CONFIG = [
    {
        key: "draftCount",
        title: "Tài liệu soạn thảo",
        icon: <span className="text-lg">📄</span>,
        isActive: true,
        typeValue: StaffDashboardDocumentType.Draft
    },
    {
        key: "returnedForRevisionCount",
        title: "Tài liệu cần chỉnh sửa",
        icon: <span className="text-lg">🔄</span>,
        isActive: false,
        typeValue: StaffDashboardDocumentType.ReturnedForRevision
    },
    {
        key: "internalReviewCount",
        title: "Tài liệu đang chờ duyệt nội bộ",
        icon: <span className="text-lg">🕒</span>,
        isActive: false,
        typeValue: StaffDashboardDocumentType.InternalReview
    },
    {
        key: "issuedCount",
        title: "Tài liệu đã phát hành",
        icon: <span className="text-lg">✔️</span>,
        isActive: false,
        typeValue: StaffDashboardDocumentType.Issued
    }
] as const;

const PIPELINE_CONFIG = [
    {
        key: "draftCount",
        label: "Soạn thảo",
        typeValue: StaffDashboardDocumentType.Draft
    },
    {
        key: "internalReviewCount",
        label: "Duyệt nội bộ",
        typeValue: StaffDashboardDocumentType.InternalReview
    },
    {
        key: "appraisalCount",
        label: "Đánh giá",
        typeValue: StaffDashboardDocumentType.Appraisal
    },
    {
        key: "signingCount",
        label: "Ký tên",
        typeValue: StaffDashboardDocumentType.Signing
    },
    {
        key: "issuedCount",
        label: "Đã phát hành",
        typeValue: StaffDashboardDocumentType.Issued
    }
] as const;

const StaffDashboardPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<DashboardSummaryStaffDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getStaffSummary();
                if (data) setSummary(data);
            } catch {
                toast.error("Không thể kết nối dữ liệu Dashboard từ máy chủ.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const handleMetricClick = (type: StaffDashboardDocumentType) => {
        navigate(`/user/documents?type=${type}&page=1`, { replace: true });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6 flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TOP_METRICS_CONFIG.map((metric) => {
                        const count = summary ? Number(summary[metric.key as keyof DashboardSummaryStaffDto] || 0) : 0;
                        return (
                            <StatCard
                                key={metric.key}
                                title={metric.title}
                                count={count}
                                icon={metric.icon}
                                isActive={metric.isActive}
                                activeBorderColor="border-purple-500"
                                onClick={() => handleMetricClick(metric.typeValue)}
                            />
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Quy trình làm việc</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Các giai đoạn hiện tại</p>
                    </div>

                    <Card className="p-8 bg-[#121824] border border-gray-800/60 rounded-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2 max-w-5xl mx-auto">
                            {PIPELINE_CONFIG.map((step, index) => {
                                const count = summary ? Number(summary[step.key as keyof DashboardSummaryStaffDto] || 0) : 0;
                                const isLast = index === PIPELINE_CONFIG.length - 1;

                                return (
                                    <div key={step.key} className="flex-1 w-full flex items-center">
                                        <div
                                            className="flex flex-col items-center mx-auto space-y-3 cursor-pointer group"
                                            onClick={() => handleMetricClick(step.typeValue)}
                                        >
                                            <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#161f30] flex items-center justify-center transition-all group-hover:border-purple-500 group-hover:bg-[#1c263b]">
                                                <span className="text-sm font-bold text-white">
                                                    {count}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-400 tracking-wide whitespace-nowrap group-hover:text-purple-400 transition-colors">
                                                {step.label}
                                            </span>
                                        </div>

                                        {!isLast && (
                                            <div className="hidden md:block h-[1px] bg-gray-800 flex-1 mx-2 self-center -translate-y-3" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default StaffDashboardPage;
