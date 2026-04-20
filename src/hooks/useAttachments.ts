import { useState, useEffect, useCallback } from "react";
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

    const formatFileSize = useCallback((bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }, []);

    const handleUploadAll = useCallback(async () => {
        if (!pendingFiles.length || isUploading) return;

        setIsUploading(true);
        try {
            const promises = pendingFiles.map(file =>
                attachmentService.upload(file, docId, category)
            );

            const newFiles = await Promise.all(promises);
            const updatedList = [...savedFiles, ...newFiles];

            setSavedFiles(updatedList);
            setPendingFiles([]);

            onChange(updatedList);

            toast.success(`Đã tải lên ${newFiles.length} tệp thành công`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Quá trình tải lên gặp lỗi, vui lòng thử lại");
        } finally {
            setIsUploading(false);
        }
    }, [pendingFiles, isUploading, docId, category, savedFiles, onChange]);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tệp này vĩnh viễn?")) return;

        try {
            await attachmentService.delete(id);
            const updatedList = savedFiles.filter(f => f.id !== id);

            setSavedFiles(updatedList);
            onChange(updatedList);

            toast.success("Đã xóa tệp khỏi hệ thống");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Không thể xóa tệp vào lúc này");
        }
    }, [savedFiles, onChange]);

    const handleDownload = useCallback(async (id: string, name: string) => {
        try {
            const blob = await attachmentService.getFile(id);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
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