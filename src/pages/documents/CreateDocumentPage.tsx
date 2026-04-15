import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import type { TechnicalDocumentCreateDto } from "@/types/document";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/constants/enum/DocumentType";
import { IssueSeverity, ISSUE_SEVERITY_LABELS } from "@/constants/enum/IssueSeverity";
import NestedTechnicalSpecsEditor from "@/components/forms/NestedTechnicalSpecsEditor";
import { departmentService } from "@/services/departmentService";
import type { DepartmentResponseDto } from "@/types/department";

const CreateDocumentPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [centers, setCenters] = useState<DepartmentResponseDto[]>([]);

    const [formData, setFormData] = useState<TechnicalDocumentCreateDto & { departmentIds: string[] }>({
        title: "",
        documentCode: "",
        description: "",
        type: DocumentType.TechnicalSpecifications,
        priority: IssueSeverity.Minor,
        attachmentIds: [],
        technicalSpecs: {},
        departmentIds: []
    });

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const result = await departmentService.getDepartments(1, 100);
                setCenters(result.items);
            } catch (err) {
                toast.error("Không thể tải danh sách đơn vị.");
            }
        };
        fetchCenters();
    }, []);

    const toggleCenter = (id: string) => {
        setFormData(prev => ({
            ...prev,
            departmentIds: prev.departmentIds.includes(id)
                ? prev.departmentIds.filter(itemId => itemId !== id)
                : [...prev.departmentIds, id]
        }));
    };

    const typeOptions = useMemo(() =>
        Object.values(DocumentType)
            .filter(v => typeof v === 'number')
            .map((v) => ({
                value: String(v),
                label: DOCUMENT_TYPE_LABELS[v as DocumentType]
            })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity)
            .filter(v => typeof v === 'number')
            .map((v) => ({
                value: String(v),
                label: ISSUE_SEVERITY_LABELS[v as IssueSeverity]
            })), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) return toast.error("Tiêu đề không được để trống.");
        if (!formData.documentCode.trim()) return toast.error("Mã tài liệu không được để trống.");

        setIsLoading(true);
        try {
            const payload: TechnicalDocumentCreateDto = {
                title: formData.title,
                documentCode: formData.documentCode,
                description: formData.description,
                type: formData.type,
                priority: formData.priority,
                attachmentIds: formData.attachmentIds,
                technicalSpecs: formData.technicalSpecs
            };

            const newDoc = await documentService.createDocument(payload);
            toast.success("Khởi tạo tài liệu thành công");

            navigate(`/documents/${newDoc.id}/editor`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lỗi khi tạo tài liệu mới.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Tạo Tài Liệu Mới</h1>
                    <p className="text-primary-400 mt-1 text-sm italic">Khởi tạo quy trình thẩm định kỹ thuật hệ thống</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                        <Card className="p-6 space-y-5 border-t-2 border-primary-500 bg-dark-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Tiêu đề dự án/tài liệu"
                                        placeholder="VD: Hệ thống Core Banking"
                                        value={formData.title}
                                        onChange={(v) => setFormData(p => ({ ...p, title: v }))}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Mã tài liệu"
                                    placeholder="VD: DOC-2026-001"
                                    value={formData.documentCode}
                                    onChange={(v) => setFormData(p => ({ ...p, documentCode: v }))}
                                    required
                                />
                            </div>

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
                                <label className="block text-[10px] font-bold text-primary-400 uppercase tracking-widest">Mô tả mục tiêu</label>
                                <textarea
                                    className="w-full bg-dark-950/50 border border-dark-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none min-h-[100px] transition-all"
                                    placeholder="Nội dung tóm tắt phạm vi kỹ thuật..."
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                />
                            </div>

                            <div className="pt-4">
                                <NestedTechnicalSpecsEditor
                                    value={JSON.stringify(formData.technicalSpecs || {})}
                                    onChange={(jsonValue) => setFormData(p => ({ ...p, technicalSpecs: JSON.parse(jsonValue) }))}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                                    Đơn vị thẩm định phối hợp ({formData.departmentIds.length})
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {centers.map((center) => {
                                        const isSelected = formData.departmentIds.includes(center.id);
                                        return (
                                            <button
                                                key={center.id}
                                                type="button"
                                                onClick={() => toggleCenter(center.id)}
                                                className={`p-3 rounded-lg border text-left transition-all ${isSelected
                                                    ? "border-primary-500 bg-primary-500/10 text-white shadow-[0_0_10px_rgba(var(--color-primary-500),0.1)]"
                                                    : "border-dark-700 bg-dark-950/30 text-gray-400 hover:border-dark-600"
                                                    }`}
                                            >
                                                <div className="text-[10px] font-mono opacity-60">{center.codeDepartment}</div>
                                                <div className="text-xs font-bold truncate">{center.nameDepartment}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </Card>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => navigate("/documents")} disabled={isLoading}>
                                Hủy bỏ
                            </Button>
                            <Button variant="primary" type="submit" isLoading={isLoading} className="px-8 shadow-lg shadow-primary-900/20">
                                Khởi tạo hệ thống
                            </Button>
                        </div>
                    </form>

                    <aside>
                        <GuidelineCard />
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

const GuidelineCard = () => (
    <Card className="p-5 bg-dark-900/50 border-dark-800 shadow-xl sticky top-6">
        <h3 className="text-xs font-bold text-white mb-4 uppercase border-b border-dark-700 pb-2 flex items-center gap-2">
            <span className="text-primary-500">⚡</span> Quy chuẩn tài liệu
        </h3>
        <ul className="space-y-4">
            <li className="text-[11px] text-gray-400 leading-relaxed">
                <strong className="text-primary-300 block mb-1">MÃ TÀI LIỆU</strong>
                Sử dụng mã định danh duy nhất của dự án để AI và Manager có thể truy xuất lịch sử thẩm định.
            </li>
            <li className="text-[11px] text-gray-400 leading-relaxed">
                <strong className="text-primary-300 block mb-1">THÔNG SỐ CẤU TRÚC</strong>
                Các thông số kỹ thuật (Specs) nên được chia theo cụm (Ví dụ: Infrastructure, Database) để hệ thống phân tích rủi ro chính xác.
            </li>
        </ul>
    </Card>
);

export default CreateDocumentPage;