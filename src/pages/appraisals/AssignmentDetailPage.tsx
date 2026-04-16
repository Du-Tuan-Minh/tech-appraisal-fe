import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import { toast } from "react-hot-toast";
import { appraisalService } from "../../services/appraisalService";
import type { AppraisalAssignmentDetailDto } from "../../types/assignment";
import { AssignmentStatus } from "../../constants/enum/AssignmentStatus";
import { ReviewerStatus } from "../../constants/enum/ReviewerStatus";

const AssignmentDetailPage = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();

    const [assignment, setAssignment] = useState<AppraisalAssignmentDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            if (!assignmentId) return;

            setIsLoading(true);
            try {
                const assignmentData = await appraisalService.getAssignmentById(assignmentId);
                setAssignment(assignmentData);
            } catch (err) {
                toast.error("Khong the tai thong tin phan cong.");
                navigate("/appraisals/assignments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId, navigate]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusLabel = (status: AssignmentStatus) => {
        const labels: Record<number, string> = {
            [0]: "Pending",
            [1]: "In Progress",
            [2]: "Completed",
            [3]: "Cancelled"
        };
        return labels[status] || "Unknown";
    };

    const getStatusColor = (status: AssignmentStatus) => {
        const colors: Record<number, string> = {
            [0]: "text-yellow-400 bg-yellow-900/20",
            [1]: "text-blue-400 bg-blue-900/20",
            [2]: "text-green-400 bg-green-900/20",
            [3]: "text-red-400 bg-red-900/20"
        };
        return colors[status] || "text-gray-400 bg-gray-900/20";
    };

    const getReviewerStatusLabel = (status: ReviewerStatus) => {
        const labels: Record<number, string> = {
            [0]: "Pending",
            [1]: "In Progress",
            [2]: "Completed",
            [3]: "Rejected"
        };
        return labels[status] || "Unknown";
    };

    const getReviewerStatusColor = (status: ReviewerStatus) => {
        const colors: Record<number, string> = {
            [0]: "text-yellow-400 bg-yellow-900/20",
            [1]: "text-blue-400 bg-blue-900/20",
            [2]: "text-green-400 bg-green-900/20",
            [3]: "text-red-400 bg-red-900/20"
        };
        return colors[status] || "text-gray-400 bg-gray-900/20";
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500 mx-auto"></div>
                </div>
            </Layout>
        );
    }

    if (!assignment) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6 text-center">
                    <p className="text-primary-400">Khong tim thay thong tin phan cong.</p>
                    <Button variant="primary" onClick={() => navigate("/appraisals/assignments")} className="mt-4">
                        Quay lai danh sach
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Chi Tiet Phan Cong</h1>
                        <p className="text-primary-400 mt-2">
                            {assignment.documentTitle} - v{assignment.versionNumber}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => navigate("/appraisals/assignments")}>
                            Quay lai danh sach
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Block 1: Thong tin tai lieu */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Thong Tin Tai Lieu</h2>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-primary-400">Ten tai lieu:</span>
                                <p className="text-white font-medium">{assignment.documentTitle}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Ma tai lieu:</span>
                                <p className="text-white">{assignment.documentCode}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Phien ban:</span>
                                <p className="text-white">v{assignment.versionNumber}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Phong ban:</span>
                                <p className="text-white">{assignment.departmentName}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Phan cong boi:</span>
                                <p className="text-white">{assignment.assignedByName}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Quan ly trach nhiem:</span>
                                <p className="text-white">{assignment.responsibleManagerName}</p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Deadline:</span>
                                <p className="text-white">
                                    {assignment.deadline ? formatDate(assignment.deadline) : "Khong co deadline"}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-primary-400">Trang thai:</span>
                                <div className="mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                        {getStatusLabel(assignment.status)}
                                    </span>
                                </div>
                            </div>
                            {assignment.managerComment && (
                                <div>
                                    <span className="text-sm text-primary-400">Ghi chu manager:</span>
                                    <p className="text-white">{assignment.managerComment}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        {/* Block 2: Reviewers List */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Danh Sach Tham Dinh ({assignment.reviewers.length})</h2>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {assignment.reviewers.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">Chua co tham dinh viên nao.</p>
                                ) : (
                                    assignment.reviewers.map((reviewer) => (
                                        <div key={reviewer.id} className="border border-dark-700 rounded-lg p-4 bg-dark-800/30 flex justify-between items-start">
                                            <div>
                                                <p className="text-white font-medium">{reviewer.staffName}</p>
                                                <p className="text-xs text-gray-400">ID: {reviewer.id}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewerStatusColor(reviewer.status)}`}>
                                                {getReviewerStatusLabel(reviewer.status)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        {/* Block 3: Statistics */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Thong Ke</h2>
                            <div className="space-y-3">
                                <StatItem label="Tong so tham dinh viên:" value={assignment.reviewerCount.toString()} />
                                <StatItem label="So luong dinh kem:" value={assignment.attachmentCount.toString()} />
                                <StatItem label="So luong issues:" value={assignment.issueCount.toString()} />
                                <StatItem label="Ngay tao:" value={formatDate(assignment.createdAt)} />
                                {assignment.completedAt && (
                                    <StatItem label="Ngay hoan thanh:" value={formatDate(assignment.completedAt)} isSuccess />
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const StatItem = ({ label, value, isSuccess }: { label: string; value: string; isSuccess?: boolean }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`font-medium ${isSuccess ? "text-green-400" : "text-white"}`}>{value}</span>
    </div>
);

export default AssignmentDetailPage;