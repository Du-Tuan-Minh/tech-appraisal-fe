import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";
import { toast } from "react-hot-toast";
import { documentService } from "../../services/documentService";
import type { DocumentVersionDetailDto } from "../../types/version";
import type { TechnicalDocumentDetailDto } from "../../types/document";
import TechnicalSpecsEditor from "../../components/forms/TechnicalSpecsEditor";

const DocumentVersionDetailPage = () => {
    const navigate = useNavigate();
    const { documentId, versionId } = useParams();

    // States
    const [document, setDocument] = useState<TechnicalDocumentDetailDto | null>(null);
    const [version, setVersion] = useState<DocumentVersionDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [technicalSpecs, setTechnicalSpecs] = useState("{}");
    const [attachments, setAttachments] = useState<string[]>([]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (!documentId || !versionId) return;

            setIsLoading(true);
            try {
                const [documentData, versionData] = await Promise.all([
                    documentService.getDocumentById(documentId),
                    documentService.getVersionDetail(versionId)
                ]);

                setDocument(documentData);
                setVersion(versionData);
                setTechnicalSpecs(versionData.technicalSpecsJson || "{}");
                setAttachments(versionData.attachments?.map(a => a.id) || []);
            } catch (err) {
                toast.error("Khong the tai thong tin phien ban.");
                navigate(`/documents/${documentId}/versions`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [documentId, versionId, navigate, toast]);

    const handleSaveChanges = async () => {
        if (!version) return;

        try {
            await documentService.updateVersion(version.id, {
                technicalSpecsJson: JSON.parse(technicalSpecs)
            });

            toast.success("Cap nhat phien ban thanh cong!");
            setIsEditing(false);

            // Refresh data
            const versionData = await documentService.getVersionDetail(version.id);
            setVersion(versionData);
            setTechnicalSpecs(versionData.technicalSpecsJson || "{}");
        } catch (err) {
            toast.error("Cap nhat phien ban that bai.");
        }
    };

    const handleDownloadAttachment = (attachmentId: string, fileName: string) => {
        window.open(`/api/attachments/${attachmentId}/download`, '_blank');
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

    if (!document || !version) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto p-6">
                    <div className="text-center">
                        <p className="text-primary-400">Khong tim thay thong tin phien ban.</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/documents/${documentId}/versions`)}
                            className="mt-4"
                        >
                            Quay lai danh sach phien ban
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
                            <h1 className="text-3xl font-bold text-white">Chi Tiet Phien Ban</h1>
                            <p className="text-primary-400 mt-2">
                                {document.title} - v{version.versionNumber}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/documents/${documentId}/versions`)}
                            >
                                Quay lai danh sach
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/documents/${documentId}`)}
                            >
                                Chi tiet tai lieu
                            </Button>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={handleSaveChanges}
                                    >
                                        Luu thay doi
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTechnicalSpecs(version.technicalSpecsJson || "{}");
                                        }}
                                    >
                                        Huy
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Chinh sua
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Thong Tin Phien Ban</h2>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm text-primary-400">So phien ban:</span>
                                    <p className="text-white font-medium">v{version.versionNumber}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-primary-400">Trang thai:</span>
                                    <div className="mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.isCurrent)}`}>
                                            {getStatusLabel(version.isCurrent)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-primary-400">Ngay tao:</span>
                                    <p className="text-white">{formatDate(version.createdAt)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-primary-400">Ly do thay doi:</span>
                                    <p className="text-white">{version.changeReason || "Khong co ly do"}</p>
                                </div>
                                {version.sourceIssueId && (
                                    <div>
                                        <span className="text-sm text-primary-400">Nguon:</span>
                                        <p className="text-yellow-400">Tao tu Issue</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Tong Quan Issues</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Issues da bao cao:</span>
                                    <span className="text-white font-medium">{version.issuesReported.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Issues da giai quyet:</span>
                                    <span className="text-white font-medium">{version.issuesResolved.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Dinh kem:</span>
                                    <span className="text-white font-medium">{version.attachments?.length || 0}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Thong So Ky Thuat</h2>
                                {isEditing && (
                                    <span className="text-xs text-yellow-400">Dang chinh sua</span>
                                )}
                            </div>
                            <TechnicalSpecsEditor
                                value={technicalSpecs}
                                onChange={setTechnicalSpecs}
                                disabled={!isEditing}
                                className={isEditing ? "border-2 border-yellow-400/30" : ""}
                            />
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Dinh Kem</h2>
                            {version.attachments && version.attachments.length > 0 ? (
                                <div className="space-y-3">
                                    {version.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{attachment.fileName}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : "Unknown size"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm">Khong co dinh kem nao.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DocumentVersionDetailPage;