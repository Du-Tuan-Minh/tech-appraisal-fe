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
import { getEnumMapValue } from "../../utils/enumHelper";
import type { AppraisalReviewerDto } from "@/types/reviewer";

const StaffAssignmentListPage = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams<{ assignmentId: string }>();

    const [reviewers, setReviewers] = useState<AppraisalReviewerDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 });

    const loadData = useCallback(async (page: number, search?: string) => {
        if (!assignmentId) return;
        setIsLoading(true);
        try {
            const queryParams: any = {
                page,
                pageSize: pagination.pageSize,
                searchTerm: search?.trim() || undefined
            };

            const response = await appraisalService.getReviewerAssignments(assignmentId, queryParams);

            setReviewers(response.items);
            setPagination(prev => ({ ...prev, page: response.page, totalPages: response.totalPages }));
        } catch {
            toast.error("Không thể tải danh sách nhân viên thẩm định.");
        } finally {
            setIsLoading(false);
        }
    }, [assignmentId, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1, searchTerm), 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
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
                                onKeyDown={(e) => e.key === 'Enter' && loadData(1, searchTerm)}
                            />
                        </div>
                        <Button variant="primary" onClick={() => loadData(1, searchTerm)} isLoading={isLoading} className="min-w-[120px]">
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
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
                                        </td>
                                    </tr>
                                ) : reviewers.length > 0 ? (
                                    reviewers.map((reviewer) => {
                                        const statusConfig = getEnumMapValue(REVIEWER_STATUS_MAP, ReviewerStatus, reviewer.status);
                                        return (
                                            <tr key={reviewer.id} className="hover:bg-primary-500/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-semibold text-white">{reviewer.staffName}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusConfig?.color || "text-gray-400 bg-gray-900/20 border-dark-700"}`}>
                                                        {statusConfig?.label || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/appraisals/assignments/${reviewer.id}`)}>
                                                        Chi tiết
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-20 text-center text-gray-500 italic">Chưa có nhân viên nào được phân công.</td>
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
                            onPageChange={(page) => loadData(page, searchTerm)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default StaffAssignmentListPage;