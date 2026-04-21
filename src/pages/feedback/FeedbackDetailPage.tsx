import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Layout } from "../../components/layout";
import CommentSection from "../../components/forms/CommentSection";

import { feedbackService } from "../../services/feedbackService";
import type { FeedbackIssueDetailDto } from "../../types/feedback";
import type { IssueCategory } from "../../constants/enum/IssueCategory";
import type { IssueSeverity } from "../../constants/enum/IssueSeverity";
import type { IssueStatus } from "../../constants/enum/IssueStatus";

const FeedbackDetailPage = () => {
    const navigate = useNavigate();
    const { feedbackId } = useParams<{ feedbackId: string }>();

    const [feedback, setFeedback] = useState<FeedbackIssueDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form states for updating feedback
    const [updateForm, setUpdateForm] = useState({
        status: "" as string,
        assignedDepartmentId: "" as string,
        resolutionNote: ""
    });

    // Mock data for demonstration
    const mockFeedback: FeedbackIssueDetailDto = {
        id: "1",
        documentId: "doc-1",
        documentTitle: "Tai lieu ky thuat ABC",
        requestVersionId: "version-1",
        versionNumber: 1,
        reporterId: "user-1",
        reporterName: "Nguyen Van A",
        indicatorPath: "Section 3.2.1 - Technical Specifications",
        description: "Phan technical specifications chua duoc cap nhat theo phien ban moi nhat. Can kiem tra lai va cap nhat cac thong so ky thuat tuong ung.",
        issueCategory: 1, // Technical
        severity: 2, // Medium
        status: 0, // Pending
        assignedDepartmentId: "dept-1",
        assignedDepartmentName: "Phong CNTT",
        technicalKnowledgeBaseId: "kb-1",
        knowledgeBaseTitle: "Technical Specifications Guide",
        resolvedInVersionId: null,
        createdAt: "2024-01-15T10:30:00Z",
        attachmentCount: 2,
        attachments: [
            {
                id: "att-1",
                fileName: "technical_specs.pdf",
                fileSize: "2.5 MB",
                filePath: "/files/technical_specs.pdf"
            },
            {
                id: "att-2", 
                fileName: "screenshot.png",
                fileSize: "1.2 MB",
                filePath: "/files/screenshot.png"
            }
        ]
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!feedbackId) return;

            setIsLoading(true);
            try {
                // For now using mock data - replace with actual API call
                // const feedbackData = await feedbackService.getDetail(feedbackId);
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setFeedback(mockFeedback);
                setUpdateForm({
                    status: mockFeedback.status.toString(),
                    assignedDepartmentId: mockFeedback.assignedDepartmentId || "",
                    resolutionNote: ""
                });
            } catch (err) {
                toast.error("Không thể tải thông tin feedback.");
                navigate("/feedback");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, [feedbackId, navigate]);

    const handleUpdateFeedback = async () => {
        if (!feedbackId) return;

        setIsUpdating(true);
        try {
            // Replace with actual API call
            // await feedbackService.updateStatus(feedbackId, {
            //     status: Number(updateForm.status),
            //     assignedDepartmentId: updateForm.assignedDepartmentId || null,
            //     resolutionNote: updateForm.resolutionNote || null
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success("Cập nhật feedback thành công!");
            
            // Update local state
            if (feedback) {
                setFeedback({
                    ...feedback,
                    status: Number(updateForm.status),
                    assignedDepartmentId: updateForm.assignedDepartmentId || null
                });
            }
        } catch (err) {
            toast.error("Cập nhật feedback thất bại.");
        } finally {
            setIsUpdating(false);
        }
    };

    const getCategoryLabel = (category: IssueCategory) => {
        const labels: Record<number, string> = {
            [0]: "General",
            [1]: "Technical",
            [2]: "Process",
            [3]: "Documentation",
            [4]: "Performance"
        };
        return labels[category] || "Unknown";
    };

    const getSeverityLabel = (severity: IssueSeverity) => {
        const labels: Record<number, string> = {
            [0]: "Critical",
            [1]: "High",
            [2]: "Medium",
            [3]: "Low"
        };
        return labels[severity] || "Unknown";
    };

    const getSeverityColor = (severity: IssueSeverity) => {
        const colors: Record<number, string> = {
            [0]: "text-red-400 bg-red-900/20",
            [1]: "text-orange-400 bg-orange-900/20",
            [2]: "text-yellow-400 bg-yellow-900/20",
            [3]: "text-green-400 bg-green-900/20"
        };
        return colors[severity] || "text-gray-400 bg-gray-900/20";
    };

    const getStatusLabel = (status: IssueStatus) => {
        const labels: Record<number, string> = {
            [0]: "Pending",
            [1]: "In Progress",
            [2]: "Resolved",
            [3]: "Rejected"
        };
        return labels[status] || "Unknown";
    };

    const getStatusColor = (status: IssueStatus) => {
        const colors: Record<number, string> = {
            [0]: "text-yellow-400 bg-yellow-900/20",
            [1]: "text-blue-400 bg-blue-900/20",
            [2]: "text-green-400 bg-green-900/20",
            [3]: "text-red-400 bg-red-900/20"
        };
        return colors[status] || "text-gray-400 bg-gray-900/20";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleDownloadAttachment = (attachment: any) => {
        // Simulate download
        toast.success(`Đang tải xuống ${attachment.fileName}...`);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!feedback) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto p-6">
                    <div className="text-center">
                        <p className="text-primary-400">Không tìm thấy thông tin feedback.</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/feedback")}
                            className="mt-4"
                        >
                            Quay lại danh sách
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Chi Tiết Feedback</h1>
                        <p className="text-primary-400 mt-1">
                            {feedback.documentTitle} - v{feedback.versionNumber}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/feedback")}
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleUpdateFeedback}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Feedback Details */}
                        <Card className="p-6 bg-dark-900/50 border-dark-700">
                            <h2 className="text-xl font-semibold text-white mb-4">Thông Tin Feedback</h2>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-primary-400">Người báo cáo:</span>
                                        <p className="text-white font-medium">{feedback.reporterName}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-primary-400">Thời gian:</span>
                                        <p className="text-white">{formatDate(feedback.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-primary-400">Đường dẫn chỉ báo:</span>
                                    <p className="text-white bg-dark-800 p-3 rounded-lg font-mono text-sm">
                                        {feedback.indicatorPath}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm text-primary-400">Mô tả chi tiết:</span>
                                    <div className="text-gray-300 bg-dark-800 p-4 rounded-lg leading-relaxed">
                                        {feedback.description}
                                    </div>
                                </div>

                                {feedback.technicalKnowledgeBaseId && (
                                    <div>
                                        <span className="text-sm text-primary-400">Cơ sở kiến thức kỹ thuật:</span>
                                        <p className="text-primary-300">
                                            {feedback.knowledgeBaseTitle || "Không có tiêu đề"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Attachments */}
                        {feedback.attachments && feedback.attachments.length > 0 && (
                            <Card className="p-6 bg-dark-900/50 border-dark-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Tệp Đính Kèm ({feedback.attachmentCount})</h2>
                                <div className="space-y-3">
                                    {feedback.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-primary-400 text-sm">📄</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{attachment.fileName}</p>
                                                    <p className="text-xs text-gray-400">{attachment.fileSize}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownloadAttachment(attachment)}
                                            >
                                                Tải xuống
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Comments Section */}
                        <CommentSection feedbackIssueId={feedback.id} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status & Category */}
                        <Card className="p-6 bg-dark-900/50 border-dark-700">
                            <h2 className="text-lg font-semibold text-white mb-4">Trạng Thái</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-primary-400 block mb-2">Danh mục</label>
                                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getSeverityColor(feedback.severity)}`}>
                                        {getCategoryLabel(feedback.issueCategory)}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-primary-400 block mb-2">Mức độ</label>
                                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getSeverityColor(feedback.severity)}`}>
                                        {getSeverityLabel(feedback.severity)}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-primary-400 block mb-2">Trạng thái hiện tại</label>
                                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(feedback.status)}`}>
                                        {getStatusLabel(feedback.status)}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Update Form */}
                        <Card className="p-6 bg-dark-900/50 border-dark-700">
                            <h2 className="text-lg font-semibold text-white mb-4">Cập Nhật Feedback</h2>
                            
                            <div className="space-y-4">
                                <Select
                                    label="Trạng thái mới"
                                    value={updateForm.status}
                                    options={[
                                        { value: "0", label: "Pending" },
                                        { value: "1", label: "In Progress" },
                                        { value: "2", label: "Resolved" },
                                        { value: "3", label: "Rejected" }
                                    ]}
                                    onChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}
                                />

                                <Input
                                    label="Phòng ban xử lý"
                                    placeholder="Nhập ID phòng ban..."
                                    value={updateForm.assignedDepartmentId}
                                    onChange={(value) => setUpdateForm(prev => ({ ...prev, assignedDepartmentId: value }))}
                                />

                                <div>
                                    <label className="text-sm text-primary-400 block mb-2">Ghi chú giải quyết</label>
                                    <textarea
                                        className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none resize-none"
                                        rows={4}
                                        placeholder="Nhập ghi chú về cách giải quyết feedback..."
                                        value={updateForm.resolutionNote}
                                        onChange={(e) => setUpdateForm(prev => ({ ...prev, resolutionNote: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FeedbackDetailPage;
