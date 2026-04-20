import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { attachmentService } from "@/services/attachmentService";
import { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import type { AttachmentResponseDto } from "@/types/attachment";

export const useAttachments = (
    docId: string,
    category: AttachmentCategory,
    initialData: AttachmentResponseDto[],
    onChange: (files: AttachmentResponseDto[]) => void
) => {
    const [isUploading, setIsUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState<AttachmentResponseDto[]>(initialData);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    useEffect(() => {
        setSavedFiles(initialData);
    }, [initialData]);

    const formatFileSize = (bytes: number) => {
        if (!bytes) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const handleUploadAll = async () => {
        if (!pendingFiles.length || isUploading) return;
        setIsUploading(true);
        try {
            const promises = pendingFiles.map(file =>
                attachmentService.upload(file, docId, category)
            );
            const newFiles = await Promise.all(promises);
            const updated = [...savedFiles, ...newFiles];

            setSavedFiles(updated);
            setPendingFiles([]);
            onChange(updated);
            toast.success(`Đã tải lên ${newFiles.length} tệp thành công`);
        } catch (error) {
            toast.error("Quá trình tải lên gặp lỗi");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tệp này vĩnh viễn?")) return;
        try {
            await attachmentService.delete(id);
            const updated = savedFiles.filter(f => f.id !== id);
            setSavedFiles(updated);
            onChange(updated);
            toast.success("Đã xóa tệp");
        } catch {
            toast.error("Không thể xóa tệp vào lúc này");
        }
    };

    const handleDownload = async (id: string, name: string) => {
        try {
            const blob = await attachmentService.getFile(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Tải xuống thất bại");
        }
    };

    return {
        isUploading,
        savedFiles,
        pendingFiles,
        setPendingFiles,
        handleUploadAll,
        handleDelete,
        handleDownload,
        formatFileSize
    };
};