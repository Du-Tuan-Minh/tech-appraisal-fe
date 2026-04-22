import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { feedbackService } from "../../services/feedbackService";
import type { FeedbackIssueResponseDto } from "../../types/feedback";

import { ISSUE_CATEGORY_LABELS } from "../../constants/enum/IssueCategory";
import { IssueStatus, ISSUE_STATUS_LABELS } from "../../constants/enum/IssueStatus";
import { ISSUE_SEVERITY_MAP } from "../../constants/mapping/ui-mapping";

const getStatusInfo = (status: IssueStatus) => {
    const colors: Record<IssueStatus, string> = {
        [IssueStatus.New]: "text-yellow-400 bg-yellow-900/20",
        [IssueStatus.InProcessing]: "text-blue-400 bg-blue-900/20",
        [IssueStatus.Adjusted]: "text-indigo-400 bg-indigo-900/20",
        [IssueStatus.Closed]: "text-green-400 bg-green-900/20",
        [IssueStatus.Rejected]: "text-red-400 bg-red-900/20",
    };
    return {
        label: ISSUE_STATUS_LABELS[status] || "N/A",
        color: colors[status] || "text-gray-400 bg-gray-900/20"
    };
};

const FeedbackListPage = () => {
    const navigate = useNavigate();
    const { versionId } = useParams<{ versionId: string }>();

    const [feedback, setFeedback] = useState<FeedbackIssueResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalPages: 0
    });

    const loadData = useCallback(async (targetPage: number) => {
        if (!versionId) return;

        setIsLoading(true);
        try {
            const data = await feedbackService.getByVersion(
                versionId,
                targetPage,
                pagination.pageSize
            );

            setFeedback(data.items);
            setPagination(prev => ({
                ...prev,
                page: data.page,
                totalPages: data.totalPages
            }));
        } catch (err) {
            toast.error("Không thể tải danh sách phản hồi.");
        } finally {
            setIsLoading(false);
        }
    }, [versionId, pagination.pageSize]);

    useEffect(() => {
        loadData(pagination.page);
    }, [loadData, pagination.page]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Chi Tiết Phản Hồi</h1>
                        <p className="text-primary-400 mt-1 italic text-sm">
                            Phiên bản ID: <span className="font-mono">{versionId}</span>
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => navigate("/feedback/create")}>
                        + Ghi nhận Issue mới
                    </Button>
                </div>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/70 border-b border-dark-700">
                                    <th className="p-4 text-primary-300 font-semibold">Tài liệu / Phiên bản</th>
                                    <th className="p-4 text-primary-300 font-semibold">Phân loại</th>
                                    <th className="p-4 text-primary-300 font-semibold">Mức độ</th>
                                    <th className="p-4 text-primary-300 font-semibold">Trạng thái</th>
                                    <th className="p-4 text-primary-300 font-semibold">Đơn vị xử lý</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-24">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : feedback.length > 0 ? (
                                    feedback.map((item) => {
                                        const statusInfo = getStatusInfo(item.status);
                                        const severityInfo = ISSUE_SEVERITY_MAP[item.severity];

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/feedback/${item.id}`)}
                                            >
                                                <td className="p-4">
                                                    <div className="font-semibold text-white">{item.documentTitle}</div>
                                                    <div className="text-xs text-primary-500 font-mono">Ver: {item.versionNumber}</div>
                                                </td>
                                                <td className="p-4 text-gray-300 text-sm">
                                                    {ISSUE_CATEGORY_LABELS[item.issueCategory]}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[11px] font-bold ${severityInfo?.color}`}>
                                                        {severityInfo?.label.toUpperCase() || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400 text-sm">
                                                    {item.assignedDepartmentName || "Chưa điều phối"}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Button variant="ghost" size="sm" className="hover:text-primary-400">
                                                        Chi tiết
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center text-gray-500">
                                            Không có phản hồi nào cho phiên bản này.
                                        </td>
                                    </tr>
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
                            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FeedbackListPage;