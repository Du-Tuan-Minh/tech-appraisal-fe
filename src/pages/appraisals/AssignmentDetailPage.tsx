import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import { appraisalService } from "../../services/appraisalService";
import { ASSIGNMENT_STATUS_MAP } from "../../constants/enum/AssignmentStatus";
import { REVIEWER_STATUS_MAP } from "../../constants/enum/ReviewerStatus";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";

const AssignmentDetailPage = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();

    const [assignment, setAssignment] = useState<AppraisalAssignmentDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAssignment = useCallback(async () => {
        if (!assignmentId) return;

        setIsLoading(true);
        try {
            const data = await appraisalService.getAssignmentById(assignmentId);
            setAssignment(data);
        } catch (err) {
            toast.error("Không thể tải thông tin phân công.");
            //navigate("/appraisals/my-tasks");
        } finally {
            setIsLoading(false);
        }
    }, [assignmentId, navigate]);

    useEffect(() => {
        fetchAssignment();
    }, [fetchAssignment]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6 flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
                </div>
            </Layout>
        );
    }

    if (!assignment) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Chi Tiết Phân Công</h1>
                        <p className="text-primary-400 mt-2 font-medium">
                            {assignment.documentTitle} <span className="text-gray-600 mx-2">|</span> v{assignment.versionNumber}
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        Quay lại danh sách
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Document Info */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="p-6 border-dark-700 bg-dark-900/50">
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <div className="w-1 h-5 bg-primary-500 rounded-full"></div>
                                Thông Tin Tài Liệu
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                <InfoItem label="Tên tài liệu" value={assignment.documentTitle} className="md:col-span-2" isBold />
                                <InfoItem label="Mã tài liệu" value={assignment.documentCode} />
                                <InfoItem label="Phiên bản" value={`v${assignment.versionNumber}`} />
                                <InfoItem label="Phòng ban" value={assignment.departmentName} />
                                <InfoItem label="Người phân công" value={assignment.assignedByName} />
                                <InfoItem label="Quản lý trách nhiệm" value={assignment.responsibleManagerName} />
                                <InfoItem label="Hạn chót" value={assignment.deadline ? formatDate(assignment.deadline) : "Không có"} />

                                <div className="md:col-span-2">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Trạng thái hệ thống</span>
                                    <div className="mt-2">
                                        <StatusBadge status={assignment.status} map={ASSIGNMENT_STATUS_MAP} />
                                    </div>
                                </div>

                                {assignment.managerComment && (
                                    <div className="md:col-span-2 bg-dark-800/50 p-4 rounded-lg border border-dark-700 mt-2">
                                        <span className="text-xs text-primary-400 font-bold uppercase">Ghi chú từ Quản lý</span>
                                        <p className="text-gray-300 mt-1 italic text-sm">"{assignment.managerComment}"</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <Card className="p-6 border-dark-700 bg-dark-900/50">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                                Danh Sách Thẩm Định
                                <span className="text-sm bg-dark-700 px-2 py-0.5 rounded text-primary-400">{assignment.reviewers.length}</span>
                            </h2>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {assignment.reviewers.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic text-center py-4">Chưa có thẩm định viên nào được gán.</p>
                                ) : (
                                    assignment.reviewers.map((reviewer) => (
                                        <div key={reviewer.id} className="group border border-dark-700 rounded-lg p-3 bg-dark-800/30 flex justify-between items-center hover:border-primary-500/50 transition-all">
                                            <div>
                                                <p className="text-white font-medium group-hover:text-primary-400 transition-colors">{reviewer.staffName}</p>
                                                <p className="text-[10px] text-gray-500 font-mono">ID: {reviewer.id}</p>
                                            </div>
                                            <StatusBadge status={reviewer.status} map={REVIEWER_STATUS_MAP} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <Card className="p-6 border-dark-700 bg-dark-900/50">
                            <h2 className="text-lg font-semibold text-white mb-4">Thống Kê Tổng Quan</h2>
                            <div className="space-y-4">
                                <StatRow label="Tổng thẩm định viên" value={assignment.reviewerCount} />
                                <StatRow label="Tệp đính kèm" value={assignment.attachmentCount} />
                                <StatRow label="Số lượng Issue" value={assignment.issueCount} />
                                <div className="pt-2 border-t border-dark-700 space-y-2">
                                    <StatRow label="Ngày khởi tạo" value={formatDate(assignment.createdAt)} isSmall />
                                    {assignment.completedAt && (
                                        <StatRow label="Hoàn thành vào" value={formatDate(assignment.completedAt)} isSuccess isSmall />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const InfoItem = ({ label, value, isBold, className = "" }: { label: string; value: string; isBold?: boolean; className?: string }) => (
    <div className={className}>
        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        <p className={`text-white mt-1 ${isBold ? "text-lg font-bold" : "font-medium"}`}>{value || "---"}</p>
    </div>
);

const StatusBadge = ({ status, map }: { status: any; map: any }) => {
    const config = map[status] || { label: "N/A", color: "text-gray-400 bg-gray-900/20" };
    return (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${config.color}`}>
            {config.label}
        </span>
    );
};

const StatRow = ({ label, value, isSuccess, isSmall }: { label: string; value: string | number; isSuccess?: boolean; isSmall?: boolean }) => (
    <div className="flex justify-between items-center">
        <span className={`text-gray-400 ${isSmall ? "text-xs" : "text-sm font-medium"}`}>{label}</span>
        <span className={`font-bold ${isSmall ? "text-xs" : "text-base"} ${isSuccess ? "text-green-400" : "text-white"}`}>
            {value}
        </span>
    </div>
);

export default AssignmentDetailPage;