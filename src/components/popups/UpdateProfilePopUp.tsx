import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Form from "@/components/ui/Form";
import PopUp from "@/components/ui/PopUp";
import { updateProfile } from "@/services/userService";
import type { UserResponseDto, UpdateProfileDto } from "@/types/user";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    userData: UpdateProfileDto;
    onSuccess: (updatedData: UpdateProfileDto) => void;
    onError: (msg: string) => void;
};

const UpdateProfilePopUp = ({ isOpen, onClose, userData, onSuccess, onError }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState<UpdateProfileDto>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        avatarUrl: ""
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                phoneNumber: userData.phoneNumber || "",
                avatarUrl: userData.avatarUrl || ""
            });
            setErrors({});
        }
    }, [isOpen, userData]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.firstName?.trim()) newErrors.firstName = "Họ là bắt buộc";
        if (!form.lastName?.trim()) newErrors.lastName = "Tên là bắt buộc";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const updated = await updateProfile(form);
            onSuccess(updated);
            onClose();
        } catch (err: any) {
            onError(err.response?.data?.message || "Cập nhật thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PopUp isOpen={isOpen} onClose={onClose} title="Cập Nhật Thông Tin">
            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Họ" value={form.firstName}
                        onChange={v => setForm(p => ({ ...p, firstName: v }))}
                        error={errors.firstName} required
                    />
                    <Input
                        label="Tên" value={form.lastName}
                        onChange={v => setForm(p => ({ ...p, lastName: v }))}
                        error={errors.lastName} required
                    />
                    <Input
                        label="Số điện thoại" className="col-span-2"
                        value={form.phoneNumber}
                        onChange={v => setForm(p => ({ ...p, phoneNumber: v }))}
                    />
                    <Input
                        label="Avatar URL" className="col-span-2"
                        value={form.avatarUrl}
                        onChange={v => setForm(p => ({ ...p, avatarUrl: v }))}
                    />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
};

export default UpdateProfilePopUp;