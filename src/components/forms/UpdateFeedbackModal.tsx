import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { feedbackService } from "../../services/feedbackService";
import { ASSIGNMENT_STATUS_MAP } from "../../constants/enum/AssignmentStatus";
import type { FeedbackIssueDetailDto, FeedbackIssueUpdateDto } from "@/types/feedback";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: FeedbackIssueDetailDto;
    onSuccess: () => void;
}

const UpdateFeedbackModal = ({ isOpen, onClose, data, onSuccess }: Props) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FeedbackIssueUpdateDto>();

    // Sync dữ liệu cũ vào form khi mở modal
    useEffect(() => {
        if (isOpen) {
            reset({
                status: data.status,
                assignedDepartmentId: data.assignedDepartmentId || "",
                resolutionNote: "",
                severity: data.severity,
                issueCategory: data.issueCategory
            });
        }
    }, [isOpen, data, reset]);

    const onSubmit = async (payload: FeedbackIssueUpdateDto) => {
        try {
            await feedbackService.update(data.id, {
                ...payload,
                assignedDepartmentId: payload.assignedDepartmentId || null
            });
            toast.success("Cập nhật trạng thái thành công");
            onSuccess();
            onClose();
        } catch (err) {
            toast.error("Lỗi cập nhật dữ liệu");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-dark-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="border-b border-white/5 pb-4">
                        <h2 className="text-xl font-bold text-white">Điều phối xử lý phản hồi</h2>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">ID: {data.id.slice(0, 8)}</p>
                    </div>

                    <div className="space-y-4">
                        <Select
                            label="Trạng thái mới"
                            value={watch("status")?.toString()}
                            options={Object.entries(ASSIGNMENT_STATUS_MAP).map(([val, info]) => ({
                                value: val,
                                label: info.label
                            }))}
                            onChange={(v) => setValue("status", Number(v))}
                        />

                        <Input
                            label="Phòng ban phụ trách"
                            placeholder="Nhập mã phòng ban..."
                            {...register("assignedDepartmentId")}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] text-primary-400 uppercase font-bold tracking-widest">Ghi chú kết luận</label>
                            <textarea
                                {...register("resolutionNote")}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:border-primary-500 outline-none min-h-[120px] resize-none"
                                placeholder="Lý do thay đổi hoặc hướng dẫn xử lý..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" type="button" onClick={onClose} className="flex-1">Hủy bỏ</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? "Đang lưu..." : "Xác nhận cập nhật"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateFeedbackModal;