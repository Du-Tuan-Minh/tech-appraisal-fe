import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { DocumentVersionDetailDto } from "@/types/version";
import type { TechnicalDocumentDetailDto } from "@/types/document";
import NestedTechnicalSpecsEditor from "@/components/forms/NestedTechnicalSpecsEditor";
import { ArrowLeft, Save, Send, Edit3, X, FileText, CheckCircle } from "lucide-react";
import FileUploadComponent from "@/components/forms/FileUploadComponent";

const DocumentVersionDetailPage = () => {
    const navigate = useNavigate();
    const { id: documentId, versionId } = useParams();

    const [document, setDocument] = useState<TechnicalDocumentDetailDto | null>(null);
    const [version, setVersion] = useState<DocumentVersionDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [technicalSpecs, setTechnicalSpecs] = useState<Record<string, any>>({});

    const fetchData = useCallback(async () => {
        if (!documentId || !versionId) return;
        setIsLoading(true);
        try {
            const [docData, verData] = await Promise.all([
                documentService.getDocumentById(documentId),
                documentService.getVersionDetail(versionId)
            ]);
            setDocument(docData);
            setVersion(verData);
            const specs = typeof verData.technicalSpecsJson === 'string'
                ? JSON.parse(verData.technicalSpecsJson || "{}")
                : (verData.technicalSpecsJson || {});
            setTechnicalSpecs(specs);
        } catch (err) {
            toast.error("Không thể tải thông tin phiên bản");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [documentId, versionId, navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaveVersion = async () => {
        if (!version) return;
        setIsActionLoading(true);
        try {
            await documentService.updateDocument(documentId!, {
                title: document!.title,
                description: document!.description,
                type: document!.type,
                priority: document!.priority,
                technicalSpecs: technicalSpecs
            });
            toast.success("Đã cập nhật nội dung kỹ thuật");
            setIsEditing(false);
            await fetchData();
        } catch (err) {
            toast.error("Cập nhật thất bại");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSendToAppraisal = async () => {
        if (!documentId || !window.confirm("Gửi phiên bản hiện tại đi thẩm định?")) return;
        setIsActionLoading(true);
        try {
            await documentService.submitForAppraisal(documentId);
            toast.success("Hồ sơ đã được gửi đi thẩm định");
            navigate("/documents");
        } catch (err: any) {
            toast.error(err.response?.data?.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) return <LoadingPlaceholder />;

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-800 pb-6">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
                        </button>
                        <h1 className="text-2xl font-bold text-white italic">
                            Chi tiết phiên bản: <span className="text-primary-400 not-italic">v{version?.versionNumber}</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{document?.title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa
                                </Button>
                                <Button variant="primary" onClick={handleSendToAppraisal} isLoading={isActionLoading}>
                                    <Send className="w-4 h-4 mr-2" /> Gửi Thẩm Định
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => { setIsEditing(false); setTechnicalSpecs(version?.technicalSpecsJson); }}>
                                    <X className="w-4 h-4 mr-2" /> Hủy
                                </Button>
                                <Button variant="primary" onClick={handleSaveVersion} isLoading={isActionLoading}>
                                    <Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Card className={`p-6 bg-dark-900/40 transition-all ${isEditing ? 'ring-1 ring-primary-500/50' : ''}`}>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <FileText className="text-primary-500 w-5 h-5" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Thông số kỹ thuật</h2>
                                </div>
                                {isEditing && (
                                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded animate-pulse">
                                        Chế độ chỉnh sửa
                                    </span>
                                )}
                            </div>

                            <NestedTechnicalSpecsEditor
                                value={technicalSpecs}
                                onChange={(newSpecs) => setTechnicalSpecs(newSpecs)}
                                readOnly={!isEditing}
                                className={!isEditing ? "opacity-80 pointer-events-none" : ""}
                            />
                        </Card>

                        <Card className="p-6 bg-dark-950/20 border-dark-800">
                            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">Tài liệu đính kèm</h3>
                            <FileUploadComponent
                                technicalDocumentId={documentId}
                                disabled={!isEditing}
                                initialAttachments={document?.attachments || []}
                                onChange={fetchData}
                            />
                        </Card>
                    </div>

                    <aside className="space-y-6">
                        <Card className="p-5 bg-dark-900/60 border-none shadow-xl space-y-4">
                            <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest border-b border-dark-700 pb-2">Hệ thống</h3>
                            <MetaItem label="Trạng thái" value={version?.isCurrent ? "Hiện tại" : "Lịch sử"} isBadge />
                            <MetaItem label="Ngày tạo" value={new Date(version?.createdAt || "").toLocaleDateString('vi-VN')} />
                            <MetaItem label="Nguồn" value={version?.sourceIssueId ? "Từ Sự cố" : "Tạo mới"} />
                            <div className="pt-2">
                                <label className="text-[10px] text-gray-500 uppercase">Lý do thay đổi</label>
                                <p className="text-xs text-gray-300 mt-1 italic">"{version?.changeReason || "Không có ghi chú"}"</p>
                            </div>
                        </Card>

                        {version?.isCurrent && (
                            <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-primary-200">
                                    Đây là phiên bản kỹ thuật mới nhất. Bạn có thể chỉnh sửa trực tiếp thông số trước khi gửi đi phê duyệt chính thức.
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const MetaItem = ({ label, value, isBadge }: any) => (
    <div className="flex justify-between items-center text-[11px]">
        <span className="text-gray-500">{label}:</span>
        <span className={isBadge ? "bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded" : "text-gray-300 font-medium"}>
            {value}
        </span>
    </div>
);

const LoadingPlaceholder = () => (
    <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
    </div>
);

export default DocumentVersionDetailPage;