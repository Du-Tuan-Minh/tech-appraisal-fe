import { useRef, type ChangeEvent } from "react";
import { Button, Card } from "../ui";
import { toast } from "react-hot-toast";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import type { AttachmentResponseDto } from "@/types/attachment";
import { X, CloudUpload, Paperclip, FileText, Download } from "lucide-react";

interface Props {
    technicalDocumentId: string;
    category: AttachmentCategory;
    onChange: (files: AttachmentResponseDto[]) => void;
    initialAttachments?: AttachmentResponseDto[];
    maxFiles?: number;
    maxSize?: number;
    acceptTypes?: string;
    disabled?: boolean;
}

const FileUploadComponent = ({
    technicalDocumentId,
    category,
    onChange,
    initialAttachments = [],
    maxFiles = 10,
    maxSize = 10,
    acceptTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png",
    disabled = false
}: Props) => {
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
    } = useAttachments(technicalDocumentId, category, initialAttachments, onChange);

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
            <Card className="p-4 bg-dark-900/40 border-dark-800 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-primary-500" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                            Tài liệu đính kèm ({savedFiles.length + pendingFiles.length}/{maxFiles})
                        </span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono italic">
                        {acceptTypes} | Max {maxSize}MB
                    </span>
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
                        className="flex-1 text-[11px] h-8"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isUploading}
                    >
                        Chọn tệp mới
                    </Button>

                    {pendingFiles.length > 0 && (
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            className="flex-1 text-[11px] h-8 shadow-lg shadow-primary-500/20"
                            onClick={handleUploadAll}
                            isLoading={isUploading}
                        >
                            <CloudUpload className="w-3.5 h-3.5 mr-1.5" />
                            Lưu {pendingFiles.length} tệp
                        </Button>
                    )}
                </div>
            </Card>

            <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {pendingFiles.map((f, i) => (
                    <div key={`pending-${i}`} className="flex items-center justify-between p-2 bg-primary-500/5 border border-primary-500/20 rounded-lg animate-pulse">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-primary-400 shrink-0" />
                            <div className="truncate">
                                <p className="text-[11px] text-primary-200 truncate font-medium">{f.name}</p>
                                <p className="text-[9px] text-primary-400/60 uppercase">Chờ tải lên...</p>
                            </div>
                        </div>
                        <button
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
                            className="flex items-center gap-2 truncate cursor-pointer"
                            onClick={() => handleDownload(f.id, f.fileName)}
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-dark-800 rounded shrink-0">
                                <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                            </div>
                            <div className="truncate">
                                <p className="text-[11px] text-gray-200 truncate group-hover:text-white transition-colors">{f.fileName}</p>
                                <p className="text-[9px] text-gray-500 font-mono tracking-tighter">{formatFileSize(f.fileSize)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDownload(f.id, f.fileName)}
                                className="p-1.5 text-gray-400 hover:text-primary-400 rounded-md hover:bg-primary-500/10"
                            >
                                <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => handleDelete(f.id)}
                                disabled={disabled || isUploading}
                                className="p-1.5 text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/10"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {!pendingFiles.length && !savedFiles.length && (
                    <Card className="py-8 border-dashed border-2 border-dark-800 bg-transparent flex flex-col items-center justify-center gap-2 opacity-40">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-center">Chưa có tệp đính kèm</span>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FileUploadComponent;