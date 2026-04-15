import { useState, useRef, useCallback, type ChangeEvent } from "react";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";
import type { AttachmentResponseDto } from "../../types/attachment";
import { attachmentService } from "../../services/attachmentService";

interface FileUploadComponentProps {
    technicalDocumentId: string;
    value: string[];
    onChange: (fileIds: string[]) => void;
    className?: string;
    maxFiles?: number;
    acceptTypes?: string;
    maxSize?: number;
    disabled?: boolean;
}

const FileUploadComponent = ({
    technicalDocumentId,
    value = [],
    onChange,
    className = "",
    maxFiles = 10,
    acceptTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png",
    maxSize = 10,
    disabled = false
}: FileUploadComponentProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [attachmentDetails, setAttachmentDetails] = useState<AttachmentResponseDto[]>([]);

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        if (value.length + files.length > maxFiles) {
            toast.error(`Chỉ được phép tải lên tối đa ${maxFiles} tập tin.`);
            return;
        }

        const oversized = files.some(f => f.size > maxSize * 1024 * 1024);
        if (oversized) {
            toast.error(`Kích thước file không được vượt quá ${maxSize}MB.`);
            return;
        }

        setIsUploading(true);
        const newUploadedDetails: AttachmentResponseDto[] = [];
        const newIds: string[] = [];

        try {
            await Promise.all(files.map(async (file) => {
                const result = await attachmentService.upload({
                    technicalDocumentId,
                    file: file,
                    entityId: technicalDocumentId,
                    category: 0,
                });

                newUploadedDetails.push(result);
                newIds.push(result.id);
            }));

            setAttachmentDetails(prev => [...prev, ...newUploadedDetails]);
            onChange([...value, ...newIds]);
            toast.success(`Đã tải lên ${files.length} tập tin.`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Tải lên thất bại. Vui lòng kiểm tra lại kết nối.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = async (id: string) => {
        if (disabled) return;
        try {
            await attachmentService.delete(id);
            setAttachmentDetails(prev => prev.filter(f => f.id !== id));
            onChange(value.filter(v => v !== id));
            toast.success("Đã xóa tập tin.");
        } catch (error) {
            toast.error("Xóa tập tin thất bại.");
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Tài liệu đính kèm ({value.length}/{maxFiles})
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">
                        Định dạng: {acceptTypes.replace(/\./g, ' ')} | Tối đa: {maxSize}MB
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading || value.length >= maxFiles}
                    isLoading={isUploading}
                >
                    Tải lên ngay
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <div className="grid gap-3">
                {attachmentDetails.length === 0 && value.length === 0 ? (
                    <div className="py-10 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-600 italic text-sm">
                        Chưa có tập tin nào được chọn.
                    </div>
                ) : (
                    attachmentDetails.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg group hover:border-primary-500/50 transition-all"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 bg-primary-500/10 rounded flex items-center justify-center text-[10px] font-black text-primary-400">
                                    {file.fileType.split('/').pop()?.toUpperCase() || 'FILE'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-200 font-medium truncate max-w-[200px] lg:max-w-md">
                                        {file.fileName}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        {formatFileSize(file.fileSize)} • {file.uploaderName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleRemoveFile(file.id)}
                                    disabled={disabled}
                                >
                                    ✕
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FileUploadComponent;