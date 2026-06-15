import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import type { DashboardSummaryStaffDto } from "../../types/dashboard";
import { StaffDashboardDocumentType } from "../../constants/enum/StaffDashboardDocumentType";
import WorkflowPipeline from "../../components/ui/WorkflowPipeline";

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
    },
    {
        key: "overdueCount",
        title: "Tài liệu đã quá hạn",
        icon: <span className="text-lg">⚠️</span>,
        isActive: false,
        typeValue: StaffDashboardDocumentType.Overdue
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchSummary = async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getStaffSummary();
                if (data && isMounted) setSummary(data);
            } catch {
                if (isMounted) toast.error("Không thể kết nối dữ liệu Dashboard từ máy chủ.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchSummary();

        return () => { isMounted = false; };
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
            <div className="w-full mx-auto p-6 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
                        <h2 className="text-xl font-bold text-white tracking-tight">Luồng thẩm định tài liệu</h2>
                    </div>

                    <Card className="p-8 bg-[#121824] border border-gray-800/60 rounded-xl">
                        <WorkflowPipeline
                            items={PIPELINE_CONFIG.map((step) => ({
                                key: step.key,
                                label: step.label,
                                count: summary ? Number(summary[step.key as keyof DashboardSummaryStaffDto] || 0) : 0,
                                onClick: () => handleMetricClick(step.typeValue),
                            }))}
                        />
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default StaffDashboardPage;