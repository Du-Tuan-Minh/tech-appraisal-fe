import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import StatCard from "../../components/ui/StatCard";

import { dashboardService } from "../../services/dashboardService";
import { getTopRejectedDocumentTypes } from "../../services/userService";
import { documentService } from "../../services/documentService";
import { ManagerDashboardDocumentType } from "../../constants/enum/ManagerDashboardDocumentType";

import type { DashboardSummaryManagerDto, DepartmentDocumentStatusSummaryDto } from "../../types/dashboard";
import type { DocumentTypeStatisticDto } from "../../types/user";
import type { OverdueDocumentDto, OverdueFilterDto } from "../../types/document";
import { DocumentType, DOCUMENT_TYPE_MAP } from "@/constants/enum/DocumentType";
import { getEnumMapValue } from "@/utils/enumHelper";
import { DepartmentDocumentStatusType } from "@/constants/enum/DepartmentDocumentStatusType";

type ViewMode = "personal" | "department";

const OVERDUE_DEFAULT_FILTERS: OverdueFilterDto = {
    page: 1,
    pageSize: 5,
    searchTerm: null,
    status: null
};

interface DashboardState {
    personalSummary: DashboardSummaryManagerDto | null;
    departmentSummary: DepartmentDocumentStatusSummaryDto | null;
    topRejectedDocumentTypes: DocumentTypeStatisticDto[];
    overdueDocuments: OverdueDocumentDto[];
    isLoading: boolean;
}

const ManagerDashboardPage = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>("personal");

    const [state, setState] = useState<DashboardState>({
        personalSummary: null,
        departmentSummary: null,
        topRejectedDocumentTypes: [],
        overdueDocuments: [],
        isLoading: true,
    });

    useEffect(() => {
        let isCurrentRequest = true;

        const fetchDashboardData = async () => {
            setState(prev => ({ ...prev, isLoading: true }));
            try {
                const isPersonal = viewMode === "personal";

                const summaryPromise = isPersonal
                    ? dashboardService.getManagerSummary()
                    : dashboardService.getManagerRequestedDocumentSummary();

                const overduePromise = isPersonal
                    ? documentService.getOverdueDocuments(OVERDUE_DEFAULT_FILTERS)
                    : documentService.getManagerRequestedOverdueDocuments(OVERDUE_DEFAULT_FILTERS);

                const [summaryRes, rejectedRes, overdueRes] = await Promise.all([
                    summaryPromise,
                    getTopRejectedDocumentTypes(1, 4),
                    overduePromise
                ]);

                if (!isCurrentRequest) return;

                setState({
                    personalSummary: isPersonal ? (summaryRes as DashboardSummaryManagerDto) : null,
                    departmentSummary: !isPersonal ? (summaryRes as DepartmentDocumentStatusSummaryDto) : null,
                    topRejectedDocumentTypes: rejectedRes?.items || [],
                    overdueDocuments: overdueRes?.items || [],
                    isLoading: false,
                });

            } catch (err: any) {
                if (!isCurrentRequest) return;

                console.error(`[Dashboard Critical Error] Mode: ${viewMode}`, err);
                const errorMsg = err.response?.data?.message || 'Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.';
                toast.error(`${viewMode === "department" ? "[Phòng ban] " : ""}${errorMsg}`);

                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchDashboardData();
        return () => { isCurrentRequest = false; };
    }, [viewMode]);

    const formatOverdueDynamic = useCallback((deadline: string | null | undefined): string => {
        if (!deadline) return "Hạn linh hoạt";

        const deadlineTime = new Date(deadline).getTime();
        const nowTime = Date.now();
        const diffMs = nowTime - deadlineTime;

        if (diffMs > 0) {
            const totalHours = Math.floor(diffMs / 3600000);
            if (totalHours < 24) return `${totalHours}h Idle`;
            return `Quá hạn ${Math.floor(totalHours / 24)} ngày`;
        }

        const remainingHours = Math.abs(diffMs) / 3600000;
        const isToday = new Date(deadline).toDateString() === new Date().toDateString();
        if (remainingHours < 24 && isToday) return "Đến hạn hôm nay";

        return `Còn ${Math.ceil(remainingHours / 24)} ngày`;
    }, []);

    const handleStatCardClick = useCallback((type: ManagerDashboardDocumentType | DepartmentDocumentStatusType) => {
        navigate(`/manager/dashboard/documents?type=${type}&mode=${viewMode}&page=1`);
    }, [navigate, viewMode]);

    const cardConfigs = useMemo(() => {
        const { personalSummary, departmentSummary } = state;

        if (viewMode === "personal") {
            return [
                { title: "TÀI LIỆU ĐANG XỬ LÝ", count: personalSummary?.reviewingDocuments || 0, type: ManagerDashboardDocumentType.Review, color: "border-blue-500", icon: "📄" },
                { title: "TÀI LIỆU QUÁ HẠN", count: personalSummary?.overdueReviewDocuments || 0, type: ManagerDashboardDocumentType.Overdue, color: "border-yellow-500", icon: "⏱️" },
                { title: "TÀI LIỆU CẦN XÁC NHẬN", count: personalSummary?.needConfirmationCount || 0, type: ManagerDashboardDocumentType.NeedConfirmation, color: "border-green-500", icon: "✅" },
                { title: "TÀI LIỆU ĐÃ TỪ CHỐI", count: personalSummary?.rejectedCount || 0, type: ManagerDashboardDocumentType.Rejected, color: "border-red-500", icon: "⚠️" },
            ];
        }
        return [
            { title: "TÀI LIỆU ĐANG ĐÁNH GIÁ", count: departmentSummary?.reviewingDocuments || 0, type: DepartmentDocumentStatusType.Reviewing, color: "border-blue-500", icon: "📄" },
            { title: "TÀI LIỆU ĐANG THẨM ĐỊNH QUÁ HẠN", count: departmentSummary?.overdueReviewDocuments || 0, type: DepartmentDocumentStatusType.OverdueReview, color: "border-yellow-500", icon: "⏱️" },
            { title: "TÀI LIỆU ĐÃ BAN HÀNH", count: departmentSummary?.issuedDocuments || 0, type: DepartmentDocumentStatusType.Issued, color: "border-green-500", icon: "✅" },
            { title: "TÀI LIỆU ĐÃ BỊ TỪ CHỐI", count: departmentSummary?.rejectedDocuments || 0, type: DepartmentDocumentStatusType.Rejected, color: "border-red-500", icon: "⚠️" },
        ];
    }, [viewMode, state.personalSummary, state.departmentSummary]);

    if (state.isLoading) {
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
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Bảng kiểm soát quản lý</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Theo dõi luồng xử lý kỹ thuật và phê duyệt tài liệu</p>
                    </div>

                    <div className="bg-[#121824] p-1 rounded-xl border border-gray-800 flex items-center gap-1">
                        <button
                            onClick={() => setViewMode("personal")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${viewMode === "personal" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Phòng ban kiểm duyệt
                        </button>
                        <button
                            onClick={() => setViewMode("department")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${viewMode === "department" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Phòng ban tạo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cardConfigs.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            count={card.count}
                            icon={<span>{card.icon}</span>}
                            isActive={true}
                            activeBorderColor={card.color}
                            onClick={() => handleStatCardClick(card.type)}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <Card className="p-6 w-full flex flex-col justify-between">
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                                        <span className="text-red-500 text-sm flex-shrink-0">⚠️</span> Phân Loại Tài Liệu Bị Từ Chối
                                    </h2>
                                    <p className="text-gray-500 text-xs mt-0.5 truncate">Thống kê số lượng tài liệu bị trả về theo từng danh mục kỹ thuật</p>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-800/60">
                                {state.topRejectedDocumentTypes.map((item) => {
                                    const config = getEnumMapValue(DOCUMENT_TYPE_MAP, DocumentType, String(item.type)) || {
                                        label: `${String(item.type)}`,
                                        color: "text-gray-400 bg-gray-900/20"
                                    };
                                    return (
                                        <div
                                            key={String(item.type)}
                                            className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 rounded-xl border border-gray-800/40 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 ${config.color}`}>
                                                    {config.label.trim().charAt(0) || "D"}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">
                                                        {config.label}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-white font-semibold text-sm flex-shrink-0 bg-gray-800/30 px-2.5 py-1 rounded-md border border-gray-700/20">
                                                {item.totalDocuments}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 w-full flex flex-col justify-between">
                        <div>
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                                    <span className="text-red-400 text-base flex-shrink-0">⚠️</span>
                                    {viewMode === "personal" ? "ĐIỂM NGHẼN: TRỄ PHẢN HỒI QUÁ HẠN" : "PHÒNG BAN: TÀI LIỆU TẠO MỚI QUÁ HẠN"}
                                </h2>
                                <button
                                    onClick={() => navigate(`/manager/overdue-documents?mode=${viewMode}`)}
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap flex-shrink-0"
                                >
                                    Xem tất cả
                                </button>
                            </div>

                            <div className="space-y-4">
                                {state.overdueDocuments.length > 0 ? (
                                    state.overdueDocuments.map((item) => (
                                        <div
                                            key={item.assignmentId}
                                            className="flex items-center justify-between p-4 bg-[#161f30]/50 rounded-xl border border-gray-800/20 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all cursor-pointer gap-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-white font-semibold text-sm truncate">
                                                    {item.reviewerName}
                                                    {item.employeeCode && (
                                                        <span className="text-xs text-gray-500 font-mono font-normal ml-1.5">
                                                            ({item.employeeCode})
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-0.5 truncate">
                                                    {item.documentTitle} — <span className="font-mono text-gray-500 text-[11px] uppercase">{item.documentCode}</span>
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 whitespace-nowrap">
                                                    {formatOverdueDynamic(item.deadline)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-6">Hiện không có điểm nghẽn quá hạn nào cần xử lý.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ManagerDashboardPage;