import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { attachmentService } from "@/services/attachmentService";
import { AttachmentCategory } from "@/constants/enum/AttachmentCategory";
import type { AttachmentResponseDto } from "@/types/attachment";

const areSameAttachments = (a: AttachmentResponseDto[], b: AttachmentResponseDto[]) => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        // Compare minimal stable fields to avoid update loops
        if (a[i]?.id !== b[i]?.id) return false;
        if (a[i]?.fileName !== b[i]?.fileName) return false;
        if (a[i]?.fileSize !== b[i]?.fileSize) return false;
        if (a[i]?.contentCategory !== b[i]?.contentCategory) return false;
    }
    return true;
};

export const useAttachments = (
    docId: string | undefined,
    category: AttachmentCategory,
    initialData: AttachmentResponseDto[] = [],
    onChange?: (files: AttachmentResponseDto[]) => void
) => {
    const [isUploading, setIsUploading] = useState(false);
    const [savedFiles, setSavedFiles] = useState<AttachmentResponseDto[]>(initialData);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);

    useEffect(() => {
        setSavedFiles(prev => (areSameAttachments(prev, initialData) ? prev : initialData));
    }, [initialData]);

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }, []);

    const handleUploadAll = useCallback(async () => {
        if (!docId || !pendingFiles.length || isUploading) return;

        setIsUploading(true);
        try {
            const promises = pendingFiles.map(file =>
                attachmentService.upload(file, docId, category)
            );

            const newFiles = await Promise.all(promises);

            setSavedFiles(prev => {
                const updated = [...prev, ...newFiles];
                onChange?.(updated);
                return updated;
            });

            setPendingFiles([]);
            toast.success(`Đã tải lên ${newFiles.length} tệp thành công`);
        } catch (error) {
            toast.error("Quá trình tải lên gặp lỗi");
        } finally {
            setIsUploading(false);
        }
    }, [pendingFiles, isUploading, docId, category, onChange]);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tệp này?")) return;

        try {
            await attachmentService.delete(id);
            setSavedFiles(prev => {
                const updated = prev.filter(f => f.id !== id);
                onChange?.(updated);
                return updated;
            });
            toast.success("Đã xóa tệp");
        } catch (error) {
            toast.error("Không thể xóa tệp");
        }
    }, [onChange]);

    const handleDownload = useCallback(async (id: string, name: string) => {
        try {
            const blob = await attachmentService.getFile(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Tải xuống thất bại");
        }
    }, []);

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