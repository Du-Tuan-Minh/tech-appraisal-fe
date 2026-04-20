import { useRef, useState, type ChangeEvent } from "react";
import { Button, Card, Select } from "../ui";
import { toast } from "react-hot-toast";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentCategory, ATTACHMENT_CATEGORY_LABELS } from "@/constants/enum/AttachmentCategory";
import type { AttachmentResponseDto } from "@/types/attachment";
import { X, CloudUpload, Paperclip, FileText, Download } from "lucide-react";

interface Props {
    technicalDocumentId: string;
    onChange: (files: AttachmentResponseDto[]) => void;
    initialAttachments?: AttachmentResponseDto[];
    maxFiles?: number;
    maxSize?: number;
    acceptTypes?: string;
    disabled?: boolean;
}

const FileUploadComponent = ({
    technicalDocumentId,
    onChange,
    initialAttachments = [],
    maxFiles = 10,
    maxSize = 10,
    acceptTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png",
    disabled = false
}: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<AttachmentCategory>(AttachmentCategory.IssueEvidence);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        isUploading,
        savedFiles,
        pendingFiles,
        setPendingFiles,
        handleUploadAll,
        handleDelete,
        handleDownload,
        formatFileSize
    } = useAttachments(technicalDocumentId, selectedCategory, initialAttachments, onChange);

    const categoryOptions = Object.entries(ATTACHMENT_CATEGORY_LABELS).map(([value, label]) => ({
        value: value,
        label: label
    }));

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (savedFiles.length + pendingFiles.length + files.length > maxFiles) {
            return toast.error(`Tối đa cho phép ${maxFiles} tệp.`);
        }

        const oversized = files.filter(f => f.size > maxSize * 1024 * 1024);
        if (oversized.length) {
            return toast.error(`Phát hiện tệp vượt quá ${maxSize}MB.`);
        }

        setPendingFiles(prev => [...prev, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-3">
            <Card className="p-4 bg-dark-900/40 border-dark-800 space-y-4 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                        <Select
                            label="Loại minh chứng sẽ tải lên"
                            options={categoryOptions}
                            value={String(selectedCategory)}
                            onChange={(v) => setSelectedCategory(Number(v) as AttachmentCategory)}
                            disabled={isUploading || disabled}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={acceptTypes}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-9 px-4 text-[11px] font-semibold"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled || isUploading}
                        >
                            Chọn tệp
                        </Button>

                        {pendingFiles.length > 0 && (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                className="h-9 px-4 text-[11px] shadow-lg shadow-primary-500/20"
                                onClick={handleUploadAll}
                                isLoading={isUploading}
                            >
                                <CloudUpload className="w-3.5 h-3.5 mr-1.5" />
                                Lưu {pendingFiles.length} tệp
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-dark-800 pt-3 text-gray-500">
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            Tài liệu đã lưu ({savedFiles.length}/{maxFiles})
                        </span>
                    </div>
                    <span className="text-[9px] font-mono italic">
                        Dung lượng tối đa: {maxSize}MB/tệp
                    </span>
                </div>
            </Card>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {pendingFiles.map((f, i) => (
                    <div key={`pending-${i}`} className="flex items-center justify-between p-2 bg-primary-500/5 border border-primary-500/10 rounded-lg border-dashed animate-pulse">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-primary-400 shrink-0" />
                            <div className="truncate">
                                <p className="text-[11px] text-primary-200 truncate font-medium">{f.name}</p>
                                <p className="text-[9px] text-primary-400/60 uppercase font-bold tracking-tighter">Đang chờ xác nhận lưu...</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPendingFiles(p => p.filter((_, idx) => idx !== i))}
                            className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-md transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {savedFiles.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-2 bg-dark-900/60 border border-dark-800 rounded-lg group hover:border-dark-700 transition-all">
                        <div
                            className="flex items-center gap-3 truncate cursor-pointer"
                            onClick={() => handleDownload(f.id, f.fileName)}
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-dark-800 rounded shrink-0 border border-dark-700 group-hover:border-primary-500/30">
                                <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                            </div>
                            <div className="truncate">
                                <p className="text-[11px] text-gray-200 truncate group-hover:text-white transition-colors font-medium">{f.fileName}</p>
                                <div className="flex gap-2 items-center mt-0.5">
                                    <span className="text-[9px] text-gray-500 font-mono">{formatFileSize(f.fileSize)}</span>
                                    <span className="text-[8px] px-1.5 py-0.5 bg-dark-700 text-gray-400 rounded-sm uppercase font-semibold">
                                        {ATTACHMENT_CATEGORY_LABELS[f.contentCategory] || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => handleDownload(f.id, f.fileName)}
                                className="p-1.5 text-gray-400 hover:text-primary-400 rounded-md hover:bg-primary-500/10"
                                title="Tải xuống"
                            >
                                <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(f.id)}
                                disabled={disabled || isUploading}
                                className="p-1.5 text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/10"
                                title="Xóa tệp"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {!pendingFiles.length && !savedFiles.length && (
                    <div className="py-12 border-dashed border border-dark-800 bg-dark-900/20 rounded-xl flex flex-col items-center justify-center gap-3 opacity-40">
                        <div className="p-3 bg-dark-800 rounded-full">
                            <Paperclip className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                            Chưa có minh chứng đính kèm
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadComponent; 