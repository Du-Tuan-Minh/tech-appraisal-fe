import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";

import { appraisalService } from "../../services/appraisalService";
import { ReviewerStatus, REVIEWER_STATUS_MAP } from "@/constants/enum/ReviewerStatus";
import type { AppraisalReviewerDto } from "@/types/reviewer";

const REVIEWER_STATUS_STYLES: Record<number, string> = {
    [ReviewerStatus.Pending]: "text-yellow-400 bg-yellow-900/20 border-yellow-500/30",
    [ReviewerStatus.Reviewing]: "text-blue-400 bg-blue-900/20 border-blue-500/30",
    [ReviewerStatus.Completed]: "text-green-400 bg-green-900/20 border-green-500/30",
};

const StaffAssignmentListPage = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams<{ assignmentId: string }>();

    const [reviewers, setReviewers] = useState<AppraisalReviewerDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const handleSearch = () => {
        loadData(1);
    };

    const loadData = useCallback(async (page: number = 1) => {
        if (!assignmentId) return;

        setIsLoading(true);
        try {
            const params = {
                page,
                pageSize: pagination.pageSize,
                searchTerm: searchTerm || undefined
            };

            const response = await appraisalService.getReviewerAssignments(assignmentId, params);

            setReviewers(response.items);
            setPagination(prev => ({
                ...prev,
                page: response.page,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            }));
        } catch (err) {
            toast.error("Không thể tải danh sách nhân viên thẩm định.");
        } finally {
            setIsLoading(false);
        }
    }, [assignmentId, searchTerm, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 400);
        return () => clearTimeout(handler);
    }, [searchTerm, loadData]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Nhân viên Thẩm định</h1>
                        <p className="text-primary-400 mt-1">Danh sách nhân sự chuyên trách cho nhiệm vụ này</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)}> Quay lại </Button>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Tìm kiếm tên nhân viên..."
                                value={searchTerm}
                                onChange={(val) => setSearchTerm(val)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleSearch}
                            isLoading={isLoading}
                            className="min-w-[120px]"
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/70 border-b border-dark-700">
                                    <th className="p-4 text-primary-300 font-semibold">Tên nhân viên</th>
                                    <th className="p-4 text-primary-300 font-semibold">Trạng thái</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <LoadingState colSpan={3} />
                                ) : reviewers.length > 0 ? (
                                    reviewers.map((reviewer) => (
                                        <tr key={reviewer.id} className="hover:bg-primary-500/5 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{reviewer.staffName}</div>
                                                <div className="text-xs text-gray-500 font-mono">ID: {reviewer.id.split('-')[0]}...</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${REVIEWER_STATUS_STYLES[reviewer.status]}`}>
                                                    {REVIEWER_STATUS_MAP[reviewer.status]?.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/appraisals/assignment-detail/${reviewer.id}`)}
                                                >
                                                    Chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center text-gray-500">
                                            Chưa có nhân viên nào được phân công.
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
                            onPageChange={loadData}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

const LoadingState = ({ colSpan }: { colSpan: number }) => (
    <tr>
        <td colSpan={colSpan} className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </td>
    </tr>
);

export default StaffAssignmentListPage;