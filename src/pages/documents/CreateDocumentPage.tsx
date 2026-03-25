import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { TechnicalDocumentCreateDto } from "@/types/document";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";

const CreateDocumentPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<TechnicalDocumentCreateDto>({
        title: "",
        description: "",
        type: DocumentType.TechnicalSpecifications,
        priority: IssueSeverity.Medium,
        technicalSpecsJson: "{}"
    });

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).map((v) => ({
            value: String(v),
            label: DOCUMENT_TYPE_LABELS[v as DocumentType]
        })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity).map((v) => ({
            value: String(v),
            label: ISSUE_SEVERITY_LABELS[v as IssueSeverity]
        })), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            return toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
        }

        try {
            JSON.parse(formData.technicalSpecsJson);
        } catch {
            return toast.error("Cấu trúc JSON thông số kỹ thuật không hợp lệ.");
        }

        setIsLoading(true);
        try {
            const newDoc = await documentService.createDocument(formData);
            toast.success("Khởi tạo tài liệu thành công");
            navigate(`/documents/${newDoc.id}/editor`);
        } catch (err) {
            toast.error("Lỗi khi tạo tài liệu mới.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight italic">Tạo Tài Liệu Mới</h1>
                        <p className="text-primary-400 mt-1 text-sm italic">Khởi tạo quy trình thẩm định kỹ thuật hệ thống</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate("/documents")}>← Danh sách</Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                        <Card className="p-6 space-y-5 border-t-2 border-primary-500 bg-dark-900/40">
                            <Input
                                label="Tiêu đề dự án/tài liệu"
                                placeholder="VD: Hệ thống quản lý tài liệu kỹ thuật - Viettel"
                                value={formData.title}
                                onChange={(v) => setFormData(p => ({ ...p, title: v }))}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Phân loại tài liệu"
                                    options={typeOptions}
                                    value={String(formData.type)}
                                    onChange={(v) => setFormData(p => ({ ...p, type: Number(v) as DocumentType }))}
                                />
                                <Select
                                    label="Mức độ ưu tiên"
                                    options={priorityOptions}
                                    value={String(formData.priority)}
                                    onChange={(v) => setFormData(p => ({ ...p, priority: Number(v) as IssueSeverity }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-primary-400 uppercase tracking-wider">Mô tả mục tiêu</label>
                                <textarea
                                    className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none min-h-[120px] transition-all"
                                    placeholder="Nội dung tóm tắt và phạm vi của tài liệu..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-accent-green mb-2 uppercase tracking-widest flex justify-between">
                                    Cấu trúc Kỹ thuật (JSON)
                                    <span className="text-[10px] lowercase font-normal opacity-50">phải đúng định dạng chuẩn</span>
                                </label>
                                <textarea
                                    className="w-full bg-dark-950 border border-dark-700 rounded-lg p-4 text-accent-green font-mono text-xs focus:border-accent-green outline-none min-h-[350px] transition-all shadow-inner"
                                    value={formData.technicalSpecsJson}
                                    onChange={(e) => setFormData(p => ({ ...p, technicalSpecsJson: e.target.value }))}
                                />
                            </div>
                        </Card>

                        <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
                            <Button variant="ghost" onClick={() => navigate("/documents")} disabled={isLoading}>Hủy bỏ</Button>
                            <Button variant="primary" type="submit" isLoading={isLoading}>Khởi tạo & Soạn thảo</Button>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <GuidelineCard />
                        <TemplateCard />
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const GuidelineCard = () => (
    <Card className="p-5 bg-dark-900/50 border-none shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 uppercase border-b border-dark-700 pb-2 flex items-center gap-2">
            <span>💡</span> Hướng dẫn
        </h3>
        <ul className="space-y-4">
            <li className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-primary-300 block mb-1 uppercase tracking-tighter">Tiêu đề</strong>
                Phải bao gồm tên hệ thống và mã định danh dự án. Tránh đặt tên quá ngắn.
            </li>
            <li className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-primary-300 block mb-1 uppercase tracking-tighter">Cấu trúc JSON</strong>
                Cung cấp các thông số kỹ thuật cốt lõi. AI sẽ dựa vào cấu trúc này để tính toán rủi ro.
            </li>
        </ul>
    </Card>
);

const TemplateCard = () => (
    <Card className="p-5 bg-primary-950/10 border-primary-900/20">
        <h3 className="text-sm font-bold text-primary-400 mb-3 uppercase flex items-center gap-2">
            <span>📄</span> Mẫu JSON cơ bản
        </h3>
        <pre className="text-[10px] text-gray-500 bg-dark-950 p-3 rounded-lg overflow-x-auto font-mono leading-tight">
            {`{
  "version": "1.0",
  "specs": {
    "cpu": "4 cores",
    "ram": "16GB",
    "storage": "SSD 512GB"
  }
}`}
        </pre>
    </Card>
);

export default CreateDocumentPage;