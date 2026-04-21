import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";

import { feedbackService } from "../../services/feedbackService";
import type { FeedbackIssueResponseDto } from "../../types/feedback";
import type { IssueCategory } from "../../constants/enum/IssueCategory";
import type { IssueSeverity } from "../../constants/enum/IssueSeverity";
import type { IssueStatus } from "../../constants/enum/IssueStatus";

const FeedbackListPage = () => {
    const navigate = useNavigate();

    const INITIAL_FILTERS = {
        searchTerm: "",
        category: "" as string,
        severity: "" as string,
        status: "" as string,
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc"
    };

    const [feedback, setFeedback] = useState<FeedbackIssueResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    // Mock data for demonstration - in real app, this would be fetched from API
    const mockFeedback: FeedbackIssueResponseDto[] = [
        {
            id: "1",
            documentId: "doc-1",
            documentTitle: "Tai lieu ky thuat ABC",
            requestVersionId: "version-1",
            versionNumber: 1,
            reporterId: "user-1",
            reporterName: "Nguyen Van A",
            issueCategory: 1, // Technical
            severity: 2, // Medium
            status: 0, // Pending
            assignedDepartmentId: "dept-1",
            assignedDepartmentName: "Phong CNTT"
        },
        {
            id: "2",
            documentId: "doc-2",
            documentTitle: "Quy trinh bao tri",
            requestVersionId: "version-2",
            versionNumber: 2,
            reporterId: "user-2",
            reporterName: "Tran Thi B",
            issueCategory: 2, // Process
            severity: 1, // Low
            status: 1, // In Progress
            assignedDepartmentId: "dept-2",
            assignedDepartmentName: "Phong QLCL"
        }
    ];

    const loadData = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            // For now using mock data - replace with actual API call
            // const response = await feedbackService.getByDocument(documentId, page, pagination.pageSize);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const filteredData = mockFeedback.filter(item => {
                const matchesSearch = !filters.searchTerm || 
                    item.documentTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                    item.reporterName.toLowerCase().includes(filters.searchTerm.toLowerCase());
                
                const matchesCategory = !filters.category || item.issueCategory.toString() === filters.category;
                const matchesSeverity = !filters.severity || item.severity.toString() === filters.severity;
                const matchesStatus = !filters.status || item.status.toString() === filters.status;
                
                return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
            });

            // Sort data
            filteredData.sort((a, b) => {
                let compareValue = 0;
                
                if (filters.sortBy === "documentTitle") {
                    compareValue = a.documentTitle.localeCompare(b.documentTitle);
                } else if (filters.sortBy === "reporterName") {
                    compareValue = a.reporterName.localeCompare(b.reporterName);
                } else {
                    compareValue = new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
                }

                return filters.sortOrder === "asc" ? compareValue : -compareValue;
            });

            const startIndex = (page - 1) * pagination.pageSize;
            const endIndex = startIndex + pagination.pageSize;
            const paginatedData = filteredData.slice(startIndex, endIndex);

            setFeedback(paginatedData);
            setPagination(prev => ({
                ...prev,
                page,
                totalCount: filteredData.length,
                totalPages: Math.ceil(filteredData.length / pagination.pageSize)
            }));
        } catch (err) {
            toast.error("Không thể tải danh sách feedback.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => loadData(1), 300);
        return () => clearTimeout(handler);
    }, [filters.searchTerm, filters.category, filters.severity, filters.status, filters.sortBy, filters.sortOrder, loadData]);

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

    const handleFeedbackClick = (feedbackId: string) => {
        navigate(`/feedback/${feedbackId}`);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Danh Sách Feedback</h1>
                        <p className="text-primary-400 mt-1">Quản lý các vấn đề phản hồi từ người dùng</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/feedback/create")}
                    >
                        Tạo Feedback Mới
                    </Button>
                </div>

                {/* Filters */}
                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Tên tài liệu, người báo cáo..."
                            value={filters.searchTerm}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val }))}
                        />
                        
                        <Select
                            label="Danh mục"
                            value={filters.category}
                            options={[
                                { value: "", label: "Tất cả danh mục" },
                                { value: "0", label: "General" },
                                { value: "1", label: "Technical" },
                                { value: "2", label: "Process" },
                                { value: "3", label: "Documentation" },
                                { value: "4", label: "Performance" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, category: val }))}
                        />
                        
                        <Select
                            label="Mức độ"
                            value={filters.severity}
                            options={[
                                { value: "", label: "Tất cả mức độ" },
                                { value: "0", label: "Critical" },
                                { value: "1", label: "High" },
                                { value: "2", label: "Medium" },
                                { value: "3", label: "Low" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, severity: val }))}
                        />
                        
                        <Select
                            label="Trạng thái"
                            value={filters.status}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                { value: "0", label: "Pending" },
                                { value: "1", label: "In Progress" },
                                { value: "2", label: "Resolved" },
                                { value: "3", label: "Rejected" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, status: val }))}
                        />
                        
                        <div className="flex items-end gap-2">
                            <Button variant="ghost" onClick={() => setFilters(INITIAL_FILTERS)} className="text-red-400">
                                Xóa lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Feedback List */}
                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-800/70 border-b border-dark-700">
                                    <th className="p-4 text-primary-300 font-semibold">Tài Liệu</th>
                                    <th className="p-4 text-primary-300 font-semibold">Phiên Bản</th>
                                    <th className="p-4 text-primary-300 font-semibold">Người Báo Cáo</th>
                                    <th className="p-4 text-primary-300 font-semibold">Danh Mục</th>
                                    <th className="p-4 text-primary-300 font-semibold">Mức Độ</th>
                                    <th className="p-4 text-primary-300 font-semibold">Trạng Thái</th>
                                    <th className="p-4 text-primary-300 font-semibold">Phòng Ban</th>
                                    <th className="p-4 text-center text-primary-300 font-semibold w-24">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="p-20 text-center">
                                            <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                                        </td>
                                    </tr>
                                ) : feedback.length > 0 ? (
                                    feedback.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-primary-500/5 transition-colors cursor-pointer"
                                            onClick={() => handleFeedbackClick(item.id)}
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{item.documentTitle}</div>
                                                <div className="text-xs text-gray-500">ID: {item.documentId}</div>
                                            </td>
                                            <td className="p-4 text-center text-gray-300">
                                                <span className="bg-dark-700 px-2 py-0.5 rounded text-xs">v{item.versionNumber}</span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                <div className="font-medium">{item.reporterName}</div>
                                                <div className="text-xs text-gray-500">ID: {item.reporterId}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-gray-400">
                                                    {getCategoryLabel(item.issueCategory)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${getSeverityColor(item.severity)}`}>
                                                    {getSeverityLabel(item.severity)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${getStatusColor(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {item.assignedDepartmentName || "---"}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFeedbackClick(item.id);
                                                        }}
                                                    >
                                                        Xem
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-20 text-center text-gray-500">
                                            Không tìm thấy feedback nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                {!isLoading && pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => loadData(page)}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FeedbackListPage;
