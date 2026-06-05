import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Input, Select } from "@/components/ui";
import { toast } from "react-hot-toast";
import { documentService } from "@/services/documentService";
import { departmentService } from "@/services/departmentService";
import { DocumentType, DOCUMENT_TYPE_MAP } from "@/constants/enum/DocumentType";
import { IssueSeverity, ISSUE_SEVERITY_MAP } from "@/constants/enum/IssueSeverity";
import NestedTechnicalSpecsEditor from "@/components/forms/NestedTechnicalSpecsEditor";
import FileUploadComponent from "@/components/forms/FileUploadComponent";

import type { TechnicalDocumentCreateDto } from "@/types/document";
import type { DepartmentResponseDto } from "@/types/department";
import type { UserResponseDto } from "@/types/user";
import { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import { attachmentService } from "@/services/attachmentService";
import { getSeniorCenter } from "@/services/userService";
import SpellEditor from "@/spellcheck/SpellEditor";

type PendingAttachment = {
    file: File;
    category: AttachmentCategory;
};

const CreateDocumentPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [centers, setCenters] = useState<DepartmentResponseDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [seniorCenters, setSeniorCenters] = useState<UserResponseDto[]>([]);
    const [seniorSearchTerm, setSeniorSearchTerm] = useState("");

    const [pendingFiles, setPendingFiles] = useState<PendingAttachment[]>([]);

    const [formData, setFormData] = useState<TechnicalDocumentCreateDto>({
        title: "",
        documentCode: "",
        description: "",
        type: DocumentType.TechnicalSpecifications,
        priority: IssueSeverity.Minor,
        attachmentIds: [],
        technicalSpecs: {},
        externalDepartmentIds: [],
        approvalProposerIds: [],
    });

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const result = await departmentService.getDepartments(
                    1,
                    100,
                    searchTerm || undefined
                );
                setCenters(result.items);
            } catch (err) {
                toast.error("Không thể tải danh sách đơn vị.");
            }
        };

        const debounce = setTimeout(fetchCenters, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    useEffect(() => {
        const fetchSenior = async () => {
            try {
                const result = await getSeniorCenter(1, 50, seniorSearchTerm || undefined);
                setSeniorCenters(result.items);
            } catch (err) {
                console.error(err);
            }
        };
        const debounce = setTimeout(fetchSenior, 300);
        return () => clearTimeout(debounce);
    }, [seniorSearchTerm]);

    const toggleCenter = (id: string) => {
        setFormData(prev => {
            const currentIds = prev.externalDepartmentIds || [];
            const isExist = currentIds.includes(id);
            return {
                ...prev,
                externalDepartmentIds: isExist
                    ? currentIds.filter(itemId => itemId !== id)
                    : [...currentIds, id]
            };
        });
    };

    const selectSeniorCenter = (id: string) => {
        setFormData(prev => ({
            ...prev,
            approvalProposerIds: prev.approvalProposerIds?.includes(id) ? [] : [id]
        }));
    };

    const typeOptions = useMemo(() =>
        Object.values(DocumentType).map((v) => ({
            value: String(v),
            label: DOCUMENT_TYPE_MAP[v as DocumentType]?.label || "N/A"
        })), []);

    const priorityOptions = useMemo(() =>
        Object.values(IssueSeverity).map((v) => ({
            value: String(v),
            label: ISSUE_SEVERITY_MAP[v as IssueSeverity]?.label || "N/A"
        })), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.title.trim() || !formData.documentCode.trim()) {
            setIsLoading(false);
            return toast.error("Vui lòng điền đầy đủ Tiêu đề và Mã tài liệu.");
        }
        if (!formData.description?.trim()) {
            setIsLoading(false);
            return toast.error("Vui lòng nhập Mô tả mục tiêu.");
        }

        try {
            const payload: TechnicalDocumentCreateDto = {
                ...formData,
                description: formData.description?.trim() || null,
                externalDepartmentIds:
                    formData.externalDepartmentIds && formData.externalDepartmentIds.length > 0
                        ? formData.externalDepartmentIds
                        : null,
                approvalProposerIds: formData.approvalProposerIds?.length ? formData.approvalProposerIds : null,
                attachmentIds:
                    formData.attachmentIds && formData.attachmentIds.length > 0
                        ? formData.attachmentIds
                        : null,
                technicalSpecs: formData.technicalSpecs ?? {},
            };

            const newDoc = await documentService.createDocument(payload);
            if (pendingFiles.length > 0) {
                const toastId = toast.loading("Đang tải tệp lên hệ thống...");
                await Promise.allSettled(
                    pendingFiles.map(item =>
                        attachmentService.upload(
                            item.file,
                            newDoc.id,
                            item.category
                        )
                    )
                );
                toast.dismiss(toastId);
            }

            toast.success("Khởi tạo tài liệu thành công");
            navigate(`/documents/${newDoc.id}/editor`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi khi tạo tài liệu mới.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Tạo Tài Liệu Mới</h1>
                    <p className="text-primary-400 mt-1 text-sm italic">Khởi tạo quy trình thẩm định kỹ thuật hệ thống</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                        <Card className="p-6 space-y-5 border-t-2 border-primary-500 bg-dark-900/40 shadow-2xl">
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
                                {/* <textarea
                                    className="w-full bg-dark-950/50 border border-dark-700 rounded-lg p-3 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none min-h-[80px] transition-all"
                                    placeholder="Nội dung tóm tắt phạm vi kỹ thuật..."
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                /> */}

                                <SpellEditor
                                    value={formData.description || ""}
                                    onChange={(value) =>
                                        setFormData(p => ({
                                            ...p,
                                            description: value
                                        }))
                                    }
                                />
                            </div>

                            <NestedTechnicalSpecsEditor
                                value={formData.technicalSpecs || {}}
                                onChange={(val) => setFormData(p => ({ ...p, technicalSpecs: val }))}
                            />

                            <div className="pt-4 border-t border-dark-800">
                                <FileUploadComponent
                                    onPendingChange={setPendingFiles}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                                    Đơn vị thẩm định phối hợp ({(formData.externalDepartmentIds || []).length})
                                </label>

                                <Input
                                    placeholder="Tìm kiếm phòng ban..."
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                />

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 bg-dark-950/80 rounded-lg border border-dark-700 custom-scrollbar">
                                    {centers.map((center) => {
                                        const isSelected = formData.externalDepartmentIds?.includes(center.id);
                                        return (
                                            <div
                                                key={center.id}
                                                onClick={() => toggleCenter(center.id)}
                                                className={`
                                                    cursor-pointer p-2 rounded border transition-all flex items-center justify-between
                                                    ${isSelected
                                                        ? 'bg-primary-500/20 border-primary-500 text-white shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
                                                        : 'bg-dark-800/50 border-dark-700 text-gray-400 hover:border-dark-500'}
                                                `}
                                            >
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-[11px] font-bold truncate">{center.codeDepartment}</span>
                                                    <span className="text-[9px] opacity-60 truncate">{center.nameDepartment}</span>
                                                </div>
                                                {isSelected && <span className="text-primary-400 text-xs">✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-dark-800">
                                <label className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                                    Cấp phê duyệt đề xuất (Chọn 1)
                                </label>
                                <Input
                                    placeholder="Tìm kiếm cấp phê duyệt..."
                                    value={seniorSearchTerm}
                                    onChange={setSeniorSearchTerm}
                                />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto p-2 bg-dark-950/80 rounded-lg border border-dark-700 custom-scrollbar">
                                    {seniorCenters.map((center) => {
                                        const isSelected = formData.approvalProposerIds?.includes(center.id);
                                        return (
                                            <div
                                                key={center.id}
                                                onClick={() => selectSeniorCenter(center.id)}
                                                className={`cursor-pointer p-2 rounded border transition-all flex items-center justify-between
                        ${isSelected ? 'bg-yellow-500/20 border-yellow-500 text-white' : 'bg-dark-800/50 border-dark-700 text-gray-400 hover:border-dark-500'}`}
                                            >
                                                <div className="flex flex-col overflow-hidden text-[10px]">
                                                    <span className="font-bold truncate">{center.lastName} {center.firstName}</span>
                                                    <span className="opacity-60 truncate">{center.employeeCode} - {center.role}</span>
                                                </div>
                                                {isSelected && <span className="text-yellow-500">✓</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => navigate("/documents")} disabled={isLoading}>Hủy bỏ</Button>
                            <Button
                                variant="primary"
                                type="submit"
                                isLoading={isLoading}
                                className="px-10"
                                disabled={
                                    isLoading ||
                                    !formData.title.trim() ||
                                    !formData.documentCode.trim() ||
                                    !formData.description?.trim()
                                }
                            >
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
                <strong className="text-primary-300 block mb-1 uppercase">Mã tài liệu</strong>
                Dùng mã duy nhất (VD: Project_Year_No) để đồng bộ với hệ thống quản lý văn bản tập đoàn.
            </li>
            <li className="text-[11px] text-gray-400 leading-relaxed">
                <strong className="text-primary-300 block mb-1 uppercase">Phối hợp đơn vị</strong>
                Việc chọn đơn vị phối hợp sẽ tự động gửi thông báo đến Manager của đơn vị đó khi hồ sơ được gửi đi.
            </li>
        </ul>
    </Card>
);

export default CreateDocumentPage;