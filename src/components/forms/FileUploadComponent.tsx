import { useRef, useState, type ChangeEvent, useMemo } from "react";
import { Button, Card, Select } from "../ui";
import { toast } from "react-hot-toast";
import { useAttachments } from "@/hooks/useAttachments";
import {
    AttachmentCategory,
    ATTACHMENT_CATEGORY_MAP
} from "@/constants/enum/AttachmentCategory";
import type { AttachmentResponseDto } from "@/types/attachment";
import { X, CloudUpload, Paperclip, FileText, Download } from "lucide-react";

type PendingAttachment = {
    file: File;
    category: AttachmentCategory;
};

const EMPTY_ATTACHMENTS: AttachmentResponseDto[] = [];

interface Props {
    technicalDocumentId?: string;
    onChange?: (files: AttachmentResponseDto[]) => void;
    onPendingChange?: (files: PendingAttachment[]) => void;
    initialAttachments?: AttachmentResponseDto[];
    maxFiles?: number;
    maxSize?: number;
    acceptTypes?: string;
    disabled?: boolean;
}

const FileUploadComponent = ({
    technicalDocumentId,
    onChange,
    onPendingChange,
    initialAttachments = EMPTY_ATTACHMENTS,
    maxFiles = 10,
    maxSize = 10,
    acceptTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png",
    disabled = false,
}: Props) => {
    const isEditMode = !!technicalDocumentId;

    const [selectedCategory, setSelectedCategory] = useState<AttachmentCategory>(
        AttachmentCategory.IssueEvidence
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        isUploading,
        savedFiles,
        pendingFiles: editPendingFiles,
        setPendingFiles: setEditPendingFiles,
        handleUploadAll,
        handleDelete,
        handleDownload,
        formatFileSize
    } = useAttachments(technicalDocumentId, selectedCategory, initialAttachments, onChange);

    const [createFiles, setCreateFiles] = useState<PendingAttachment[]>([]);

    const displayFiles = useMemo(() => {
        if (isEditMode) {
            return editPendingFiles.map(f => ({
                name: f.name,
                size: f.size,
                isPending: true,
                status: "Chờ xác nhận lưu..."
            }));
        }
        return createFiles.map(f => ({
            name: f.file.name,
            size: f.file.size,
            isPending: true,
            status: "Chưa upload"
        }));
    }, [isEditMode, editPendingFiles, createFiles]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const currentCount = isEditMode
            ? savedFiles.length + editPendingFiles.length
            : createFiles.length;

        if (currentCount + files.length > maxFiles) {
            return toast.error(`Tối đa ${maxFiles} tệp.`);
        }

        if (files.some(f => f.size > maxSize * 1024 * 1024)) {
            return toast.error(`Tệp vượt quá ${maxSize}MB.`);
        }

        if (isEditMode) {
            setEditPendingFiles(prev => [...prev, ...files]);
        } else {
            const updated = [...createFiles, ...files.map(f => ({ file: f, category: selectedCategory }))];
            setCreateFiles(updated);
            onPendingChange?.(updated);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveFile = (index: number) => {
        if (isEditMode) {
            setEditPendingFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            const updated = createFiles.filter((_, i) => i !== index);
            setCreateFiles(updated);
            onPendingChange?.(updated);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Card className="p-4 bg-dark-900/40 border-dark-800 space-y-4 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                    <div className="flex-1">
                        <Select
                            label="Loại minh chứng"
                            options={Object.entries(ATTACHMENT_CATEGORY_MAP).map(([value, info]) => ({
                                value: String(value),
                                label: info.label
                            }))}
                            value={String(selectedCategory)}
                            onChange={(v) => setSelectedCategory(Number(v) as AttachmentCategory)}
                            disabled={isUploading || disabled}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input ref={fileInputRef} type="file" multiple accept={acceptTypes} onChange={handleFileSelect} className="hidden" />
                        <Button type="button" variant="secondary" size="sm" className="h-9" onClick={() => fileInputRef.current?.click()} disabled={disabled || isUploading}>
                            Chọn tệp
                        </Button>

                        {isEditMode && editPendingFiles.length > 0 && (
                            <Button type="button" variant="primary" size="sm" className="h-9" onClick={handleUploadAll} isLoading={isUploading}>
                                <CloudUpload className="w-3.5 h-3.5 mr-1.5" />
                                Lưu {editPendingFiles.length} tệp
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-dark-800 pt-3 text-gray-500">
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            {isEditMode ? `Tài liệu (${savedFiles.length}/${maxFiles})` : `Đã chọn (${createFiles.length}/${maxFiles})`}
                        </span>
                    </div>
                </div>
            </Card>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto custom-scrollbar">
                {displayFiles.map((f, i) => (
                    <div key={`pending-${i}`} className="flex items-center justify-between p-2 bg-primary-500/5 border border-primary-500/10 rounded-lg border-dashed animate-pulse">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-primary-400 shrink-0" />
                            <div className="truncate">
                                <p className="text-[11px] text-primary-200 truncate font-medium">{f.name}</p>
                                <p className="text-[9px] text-primary-400/60 uppercase font-bold tracking-tighter">{f.status}</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => handleRemoveFile(i)} className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-md">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {isEditMode && savedFiles.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-2 bg-dark-900/60 border border-dark-800 rounded-lg group">
                        <div className="flex items-center gap-3 truncate cursor-pointer" onClick={() => handleDownload(f.id, f.fileName)}>
                            <div className="w-8 h-8 flex items-center justify-center bg-dark-800 rounded border border-dark-700">
                                <FileText className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="truncate">
                                <p className="text-[11px] text-gray-200 truncate font-medium">{f.fileName}</p>
                                <div className="flex gap-2 items-center mt-0.5">
                                    <span className="text-[9px] text-gray-500 font-mono">{formatFileSize(f.fileSize)}</span>
                                    <span className="text-[8px] px-1.5 py-0.5 bg-dark-700 text-gray-400 rounded-sm uppercase font-semibold">
                                        {ATTACHMENT_CATEGORY_MAP[f.contentCategory]?.label || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                            <button type="button" onClick={() => handleDownload(f.id, f.fileName)} className="p-1.5 text-gray-400 hover:text-primary-400"><Download className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => handleDelete(f.id)} className="p-1.5 text-gray-400 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                ))}

                {!displayFiles.length && !savedFiles.length && (
                    <div className="py-12 border-dashed border border-dark-800 bg-dark-900/20 rounded-xl flex flex-col items-center justify-center gap-3 opacity-40">
                        <Paperclip className="w-6 h-6 text-gray-500" />
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Chưa có minh chứng</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadComponent;