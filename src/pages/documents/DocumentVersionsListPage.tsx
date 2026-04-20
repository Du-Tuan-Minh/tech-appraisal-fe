import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { Layout } from "../../components/layout";
import { toast } from "react-hot-toast";
import { documentService } from "../../services/documentService";
import type { DocumentVersionDto } from "../../types/version";
import type { TechnicalDocumentDetailDto } from "../../types/document";

const DocumentVersionsListPage = () => {
    const navigate = useNavigate();
    const { documentId } = useParams();

    const [document, setDocument] = useState<TechnicalDocumentDetailDto | null>(null);
    const [versions, setVersions] = useState<DocumentVersionDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    });

    const [filters, setFilters] = useState({
        searchTerm: "",
        isCurrent: undefined as boolean | undefined,
        sortBy: "createdAt" as "createdAt" | "versionNumber",
        sortOrder: "desc" as "asc" | "desc"
    });

    const currentVersionOptions = [
        { value: "", label: "Tat ca phien ban" },
        { value: "true", label: "Phien ban hien tai" },
        { value: "false", label: "Phien ban cu" }
    ];

    const sortOptions = [
        { value: "createdAt", label: "Ngay tao" },
        { value: "versionNumber", label: "So phien ban" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!documentId) return;

            setIsLoading(true);
            try {
                const [documentData, versionsData] = await Promise.all([
                    documentService.getDocumentById(documentId),
                    documentService.getDocumentVersions(documentId)
                ]);

                setDocument(documentData);
                setVersions(versionsData);
                setPagination({
                    page: 1,
                    pageSize: versionsData.length,
                    total: versionsData.length,
                    totalPages: 1
                });
            } catch (err) {
                toast.error("Khong the tai thong tin phien ban.");
                navigate("/documents/list");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [documentId, navigate, toast]);

    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        let filteredVersions = [...versions];

        if (filters.searchTerm) {
            filteredVersions = filteredVersions.filter(version =>
                version.changeReason?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                version.versionNumber.toString().includes(filters.searchTerm)
            );
        }

        if (filters.isCurrent !== undefined) {
            filteredVersions = filteredVersions.filter(version => version.isCurrent === filters.isCurrent);
        }

        filteredVersions.sort((a, b) => {
            let compareValue = 0;

            if (filters.sortBy === "versionNumber") {
                compareValue = a.versionNumber - b.versionNumber;
            } else {
                compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            return filters.sortOrder === "asc" ? compareValue : -compareValue;
        });

        setVersions(filteredVersions);
        setPagination({
            page: 1,
            pageSize: filteredVersions.length,
            total: filteredVersions.length,
            totalPages: 1
        });
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: "",
            isCurrent: undefined,
            sortBy: "createdAt",
            sortOrder: "desc"
        });
    };

    const handleVersionClick = (versionId: string) => {
        navigate(`/documents/${documentId}/versions/${versionId}`);
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

    const getStatusColor = (isCurrent: boolean) => {
        return isCurrent
            ? "text-green-400 bg-green-900/20"
            : "text-gray-400 bg-gray-900/20";
    };

    const getStatusLabel = (isCurrent: boolean) => {
        return isCurrent ? "Hien tai" : "Cu";
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!document) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6">
                    <div className="text-center">
                        <p className="text-primary-400">Khong tim thay thong tin tai lieu.</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/documents/list")}
                            className="mt-4"
                        >
                            Quay lai danh sach
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Phien Ban Tai Lieu</h1>
                            <p className="text-primary-400 mt-2">
                                {document.title} - {document.documentCode}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/documents/${documentId}`)}
                            >
                                Chi tiet tai lieu
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/documents/${documentId}/versions/create`)}
                            >
                                Tao phien ban moi
                            </Button>
                        </div>
                    </div>
                </div>

                <Card className="mb-6 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Bo Loc</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            label="Tim kiem"
                            placeholder="Nhap ly do thay doi..."
                            value={filters.searchTerm}
                            onChange={(value) => handleFilterChange("searchTerm", value)}
                        />

                        <Select
                            label="Loai phien ban"
                            value={filters.isCurrent?.toString() || ""}
                            onChange={(value) => handleFilterChange("isCurrent", value ? value === "true" : undefined)}
                            options={currentVersionOptions}
                        />

                        <Select
                            label="Sap xep theo"
                            value={filters.sortBy}
                            onChange={(value) => handleFilterChange("sortBy", value)}
                            options={sortOptions}
                        />

                        <Select
                            label="Thu tu sap xep"
                            value={filters.sortOrder}
                            onChange={(value) => handleFilterChange("sortOrder", value)}
                            options={[
                                { value: "asc", label: "Tang dan" },
                                { value: "desc", label: "Giam dan" }
                            ]}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                        >
                            Xoa bo loc
                        </Button>
                        <Button
                            variant="primary"
                            onClick={applyFilters}
                        >
                            Ap dung bo loc
                        </Button>
                    </div>
                </Card>

                <Card className="p-6">
                    {versions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-primary-400 mb-4">Khong co phien ban nao.</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/documents/${documentId}/versions/create`)}
                            >
                                Tao phien ban dau tien
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-700">
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">So phien ban</th>
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">Ly do thay doi</th>
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">Trang thai</th>
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">Nguoi tao</th>
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">Ngay tao</th>
                                        <th className="text-left py-3 px-4 text-primary-400 font-medium">Nguon</th>
                                        <th className="text-center py-3 px-4 text-primary-400 font-medium">Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {versions.map((version) => (
                                        <tr
                                            key={version.id}
                                            className="border-b border-dark-800 hover:bg-dark-800/50 cursor-pointer"
                                            onClick={() => handleVersionClick(version.id)}
                                        >
                                            <td className="py-3 px-4">
                                                <span className="text-primary-400 hover:text-primary-300 font-medium">
                                                    v{version.versionNumber}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-300">
                                                {version.changeReason || "Khong co ly do"}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.isCurrent)}`}>
                                                    {getStatusLabel(version.isCurrent)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                System
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {formatDate(version.createdAt)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {version.sourceIssueId ? (
                                                    <span className="text-yellow-400">Issue</span>
                                                ) : (
                                                    <span className="text-gray-400">Manual</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleVersionClick(version.id);
                                                        }}
                                                    >
                                                        Xem chi tiet
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
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

export default DocumentVersionsListPage;
