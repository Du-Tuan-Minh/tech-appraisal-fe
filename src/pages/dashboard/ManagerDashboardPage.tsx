// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import Card from "../../components/ui/Card";
// import { Layout } from "../../components/layout";
// import StatCard from "../../components/ui/StatCard";

// import { dashboardService } from "../../services/dashboardService";
// import { getTopRejectedDocumentTypes } from "../../services/userService";
// import { documentService } from "../../services/documentService";
// import { ManagerDashboardDocumentType } from "../../constants/enum/ManagerDashboardDocumentType";

// import type { DashboardSummaryManagerDto } from "../../types/dashboard";
// import type { DocumentTypeStatisticDto } from "../../types/user";
// import type { OverdueDocumentDto } from "../../types/document";
// import { DocumentType, DOCUMENT_TYPE_MAP } from "@/constants/enum/DocumentType";
// import { getEnumMapValue } from "@/utils/enumHelper";

// const ManagerDashboardPage = () => {
//     const navigate = useNavigate();

//     const [summary, setSummary] = useState<DashboardSummaryManagerDto | null>(null);
//     const [topRejectedDocumentTypes, setTopRejectedDocumentTypes] = useState<DocumentTypeStatisticDto[]>([]);
//     const [overdueDocuments, setOverdueDocuments] = useState<OverdueDocumentDto[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [activeTab, setActiveTab] = useState<string>("progress");

//     useEffect(() => {
//         let isMounted = true;

//         const fetchDashboardData = async () => {
//             setIsLoading(true);
//             try {
//                 const [summaryRes, rejectedRes, overdueRes] = await Promise.all([
//                     dashboardService.getManagerSummary(),
//                     getTopRejectedDocumentTypes(1, 4),
//                     documentService.getOverdueDocuments({
//                         page: 1,
//                         pageSize: 5,
//                         searchTerm: null,
//                         status: null
//                     })
//                 ]);

//                 if (!isMounted) return;

//                 setSummary(summaryRes);
//                 setTopRejectedDocumentTypes(rejectedRes?.items || []);
//                 setOverdueDocuments(overdueRes?.items || []);
//             } catch (err: any) {
//                 console.error("[Dashboard Critical Error]:", err);
//                 toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra khi tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.');
//             } finally {
//                 if (isMounted) setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//         return () => { isMounted = false; };
//     }, []);

//     const formatOverdueDynamic = (deadline: string | null | undefined): string => {
//         if (!deadline) return "Hạn linh hoạt";

//         const deadlineTime = new Date(deadline).getTime();
//         const nowTime = new Date().getTime();
//         const diffMs = nowTime - deadlineTime;

//         if (diffMs > 0) {
//             const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
//             if (totalHours < 24) {
//                 return `${totalHours}h Idle`;
//             }
//             const days = Math.floor(totalHours / 24);
//             return `Quá hạn ${days} ngày`;
//         }

//         const remainingMs = Math.abs(diffMs);
//         const remainingHours = remainingMs / (1000 * 60 * 60);

//         if (remainingHours < 24 && new Date(deadline).getDate() === new Date().getDate()) {
//             return "Đến hạn hôm nay";
//         }

//         const remainingDays = Math.ceil(remainingHours / 24);
//         return `Còn ${remainingDays} ngày`;
//     };

//     if (isLoading) {
//         return (
//             <Layout>
//                 <div className="flex items-center justify-center h-[60vh]">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
//                 </div>
//             </Layout>
//         );
//     }

//     const handleStatCardClick = (type: number) => {
//         navigate(`/manager/dashboard/documents?type=${type}&page=1`);
//     };

//     return (
//         <Layout>
//             <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#090d16] min-h-screen text-gray-300">

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <StatCard
//                         title="TÀI LIỆU ĐANG XỬ LÝ NỘI BỘ"
//                         count={summary?.internalSigningCount || 0}
//                         icon={<span>📄</span>}
//                         isActive={activeTab === "progress"}
//                         activeBorderColor="border-blue-500"
//                         onClick={() => handleStatCardClick(ManagerDashboardDocumentType.InternalSigning)}
//                     />
//                     <StatCard
//                         title="ĐÁNH GIÁ CHỜ XỬ LÝ"
//                         count={summary?.pendingReviewCount || 0}
//                         icon={<span>⏱️</span>}
//                         isActive={activeTab === "review"}
//                         activeBorderColor="border-yellow-500"
//                         onClick={() => handleStatCardClick(ManagerDashboardDocumentType.PendingReview)}
//                     />
//                     <StatCard
//                         title="CẦN XÁC NHẬN"
//                         count={summary?.needConfirmationCount || 0}
//                         icon={<span>✅</span>}
//                         isActive={activeTab === "confirm"}
//                         activeBorderColor="border-green-500"
//                         onClick={() => handleStatCardClick(ManagerDashboardDocumentType.NeedConfirmation)}
//                     />
//                     <StatCard
//                         title="TÀI LIỆU BỊ TỪ CHỐI"
//                         count={summary?.rejectedCount || 0}
//                         icon={<span>⚠️</span>}
//                         isActive={activeTab === "rejected"}
//                         activeBorderColor="border-red-500"
//                         onClick={() => handleStatCardClick(ManagerDashboardDocumentType.Rejected)}
//                     />
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

//                     <Card className="p-6 w-full flex flex-col justify-between">
//                         <div>
//                             <div className="mb-4 flex items-center justify-between gap-4">
//                                 <div className="min-w-0">
//                                     <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
//                                         <span className="text-red-500 text-sm flex-shrink-0">⚠️</span> Phân Loại Tài Liệu Bị Từ Chối
//                                     </h2>
//                                     <p className="text-gray-500 text-xs mt-0.5 truncate">Thống kê số lượng tài liệu bị trả về theo từng danh mục kỹ thuật</p>
//                                 </div>
//                             </div>

//                             <div className="divide-y divide-gray-800/60">
//                                 {topRejectedDocumentTypes.map((item) => {
//                                     const config = getEnumMapValue(DOCUMENT_TYPE_MAP, DocumentType, String(item.type)) || {
//                                         label: `${String(item.type)}`,
//                                         color: "text-gray-400 bg-gray-900/20"
//                                     };

//                                     const initialChar = config.label.trim().charAt(0) || "D";

//                                     return (
//                                         <div
//                                             key={String(item.type)}
//                                             className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer gap-4"
//                                         >
//                                             <div className="flex items-center gap-3 min-w-0">
//                                                 <div className={`w-9 h-9 rounded-xl border border-gray-800/40 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 ${config.color}`}>
//                                                     {initialChar}
//                                                 </div>
//                                                 <div className="min-w-0">
//                                                     <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">
//                                                         {config.label}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <span className="text-white font-semibold text-sm flex-shrink-0 bg-gray-800/30 px-2.5 py-1 rounded-md border border-gray-700/20">
//                                                 {item.totalDocuments}
//                                             </span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </Card>

//                     <Card className="p-6 w-full flex flex-col justify-between">
//                         <div>
//                             <div className="mb-6 flex items-center justify-between gap-4">
//                                 <h2 className="text-lg font-bold text-white flex items-center gap-2 truncate">
//                                     <span className="text-red-400 text-base flex-shrink-0">⚠️</span> ĐIỂM NGHẼN: TRỄ PHẢN HỒI QUÁ HẠN
//                                 </h2>
//                                 <button
//                                     onClick={() => navigate("/manager/overdue-documents")}
//                                     className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap flex-shrink-0"
//                                 >
//                                     Xem tất cả
//                                 </button>
//                             </div>

//                             <div className="space-y-4">
//                                 {overdueDocuments.length > 0 ? (
//                                     overdueDocuments.map((item) => (
//                                         <div
//                                             key={item.assignmentId}
//                                             className="flex items-center justify-between p-4 bg-[#161f30]/50 rounded-xl border border-gray-800/20 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-all cursor-pointer gap-4"
//                                         >
//                                             <div className="min-w-0">
//                                                 <p className="text-white font-semibold text-sm truncate">
//                                                     {item.reviewerName}
//                                                     {item.employeeCode && (
//                                                         <span className="text-xs text-gray-500 font-mono font-normal ml-1.5">
//                                                             ({item.employeeCode})
//                                                         </span>
//                                                     )}
//                                                 </p>
//                                                 <p className="text-gray-400 text-xs mt-0.5 truncate">
//                                                     {item.documentTitle} — <span className="font-mono text-gray-500 text-[11px] uppercase">{item.documentCode}</span>
//                                                 </p>
//                                             </div>
//                                             <div className="text-right flex-shrink-0">
//                                                 <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20 whitespace-nowrap">
//                                                     {formatOverdueDynamic(item.deadline)}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className="text-sm text-gray-500 text-center py-6">Hiện không có điểm nghẽn quá hạn nào cần xử lý.</p>
//                                 )}
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default ManagerDashboardPage;


import { useState, useEffect } from "react";
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
import type { OverdueDocumentDto } from "../../types/document";
import { DocumentType, DOCUMENT_TYPE_MAP } from "@/constants/enum/DocumentType";
import { getEnumMapValue } from "@/utils/enumHelper";

type ViewMode = "personal" | "department";

const ManagerDashboardPage = () => {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<ViewMode>("personal");

    const [summary, setSummary] = useState<DashboardSummaryManagerDto | null>(null);
    const [deptSummary, setDeptSummary] = useState<DepartmentDocumentStatusSummaryDto | null>(null);
    const [topRejectedDocumentTypes, setTopRejectedDocumentTypes] = useState<DocumentTypeStatisticDto[]>([]);
    const [overdueDocuments, setOverdueDocuments] = useState<OverdueDocumentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("progress");

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const overdueFilters = {
                    page: 1,
                    pageSize: 5,
                    searchTerm: null,
                    status: null
                };

                const summaryPromise = viewMode === "personal"
                    ? dashboardService.getManagerSummary()
                    : dashboardService.getManagerRequestedDocumentSummary();

                const overduePromise = viewMode === "personal"
                    ? documentService.getOverdueDocuments(overdueFilters)
                    : documentService.getDepartmentCreatedOverdueDocuments(overdueFilters);

                const [summaryRes, rejectedRes, overdueRes] = await Promise.all([
                    summaryPromise,
                    getTopRejectedDocumentTypes(1, 4),
                    overduePromise
                ]);

                if (!isMounted) return;

                if (viewMode === "personal") {
                    setSummary(summaryRes as DashboardSummaryManagerDto);
                    setDeptSummary(null);
                } else {
                    setDeptSummary(summaryRes as DepartmentDocumentStatusSummaryDto);
                    setSummary(null);
                }

                setTopRejectedDocumentTypes(rejectedRes?.items || []);
                setOverdueDocuments(overdueRes?.items || []);
            } catch (err: any) {
                console.error("[Dashboard Critical Error]:", err);
                toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra khi tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDashboardData();
        return () => { isMounted = false; };
    }, [viewMode]);

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

    const handleStatCardClick = (type: number) => {
        navigate(`/manager/dashboard/documents?type=${type}&mode=${viewMode}&page=1`);
    };

    const metricsData = viewMode === "personal"
        ? {
            card1: { title: "TÀI LIỆU ĐANG XỬ LÝ NỘI BỘ", count: summary?.internalSigningCount || 0 },
            card2: { title: "ĐÁNH GIÁ CHỜ XỬ LÝ", count: summary?.pendingReviewCount || 0 },
            card3: { title: "CẦN XÁC NHẬN", count: summary?.needConfirmationCount || 0 },
            card4: { title: "TÀI LIỆU BỊ TỪ CHỐI", count: summary?.rejectedCount || 0 },
        }
        : {
            card1: { title: "DANH MỤC ĐANG ĐÁNH GIÁ", count: deptSummary?.reviewingDocuments || 0 },
            card2: { title: "ĐÁNH GIÁ PHÒNG BAN QUÁ HẠN", count: deptSummary?.overdueReviewDocuments || 0 },
            card3: { title: "TÀI LIỆU ĐÃ PHÁT HÀNH", count: deptSummary?.issuedDocuments || 0 },
            card4: { title: "TÀI LIỆU PHÒNG BAN BỊ TỪ CHỐI", count: deptSummary?.rejectedDocuments || 0 },
        };

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
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${viewMode === "personal"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Cá nhân
                        </button>
                        <button
                            onClick={() => setViewMode("department")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${viewMode === "department"
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Phòng ban
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={metricsData.card1.title}
                        count={metricsData.card1.count}
                        icon={<span>📄</span>}
                        isActive={activeTab === "progress"}
                        activeBorderColor="border-blue-500"
                        onClick={() => handleStatCardClick(ManagerDashboardDocumentType.InternalSigning)}
                    />
                    <StatCard
                        title={metricsData.card2.title}
                        count={metricsData.card2.count}
                        icon={<span>⏱️</span>}
                        isActive={activeTab === "review"}
                        activeBorderColor="border-yellow-500"
                        onClick={() => handleStatCardClick(ManagerDashboardDocumentType.PendingReview)}
                    />
                    <StatCard
                        title={metricsData.card3.title}
                        count={metricsData.card3.count}
                        icon={<span>✅</span>}
                        isActive={activeTab === "confirm"}
                        activeBorderColor="border-green-500"
                        onClick={() => handleStatCardClick(ManagerDashboardDocumentType.NeedConfirmation)}
                    />
                    <StatCard
                        title={metricsData.card4.title}
                        count={metricsData.card4.count}
                        icon={<span>⚠️</span>}
                        isActive={activeTab === "rejected"}
                        activeBorderColor="border-red-500"
                        onClick={() => handleStatCardClick(ManagerDashboardDocumentType.Rejected)}
                    />
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
                                {topRejectedDocumentTypes.map((item) => {
                                    const config = getEnumMapValue(DOCUMENT_TYPE_MAP, DocumentType, String(item.type)) || {
                                        label: `${String(item.type)}`,
                                        color: "text-gray-400 bg-gray-900/20"
                                    };

                                    const initialChar = config.label.trim().charAt(0) || "D";

                                    return (
                                        <div
                                            key={String(item.type)}
                                            className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 group cursor-pointer gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-9 h-9 rounded-xl border border-gray-800/40 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 ${config.color}`}>
                                                    {initialChar}
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
                                    {viewMode === "personal" ? "DIỂM NGHẼN: TRỄ PHẢN HỒI QUÁ HẠN" : "PHÒNG BAN: TÀI LIỆU TẠO MỚI QUÁ HẠN"}
                                </h2>
                                <button
                                    onClick={() => navigate(`/manager/overdue-documents?mode=${viewMode}`)}
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 whitespace-nowrap flex-shrink-0"
                                >
                                    Xem tất cả
                                </button>
                            </div>

                            <div className="space-y-4">
                                {overdueDocuments.length > 0 ? (
                                    overdueDocuments.map((item) => (
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