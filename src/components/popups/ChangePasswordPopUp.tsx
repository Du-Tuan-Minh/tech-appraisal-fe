import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Form from "../../components/ui/Form";
import PopUp from "../../components/ui/PopUp";
import type { ChangePasswordDto } from "../../types/user";
import { changePassword } from "../../services/userService";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
};

const ChangePasswordPopUp = ({ isOpen, onClose, onSuccess, onError }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!passwordForm.oldPassword) newErrors.oldPassword = "Mật khẩu cũ là bắt buộc";
        if (passwordForm.newPassword.length < 6) newErrors.newPassword = "Tối thiểu 6 ký tự";
        if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await changePassword(passwordForm);
            onSuccess("Đổi mật khẩu thành công!");
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            onClose();
        } catch (err) {
            onError("Đổi mật khẩu thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PopUp isOpen={isOpen} onClose={onClose} title="Đổi Mật Khẩu">
            <Form onSubmit={handleSubmit}>
                <Input
                    type="password"
                    label="Mật khẩu cũ"
                    value={passwordForm.oldPassword}
                    onChange={(v) => setPasswordForm(p => ({ ...p, oldPassword: v }))}
                    error={errors.oldPassword}
                    required
                />
                <Input
                    type="password"
                    label="Mật khẩu mới"
                    value={passwordForm.newPassword}
                    onChange={(v) => setPasswordForm(p => ({ ...p, newPassword: v }))}
                    error={errors.newPassword}
                    required
                />
                <Input
                    type="password"
                    label="Xác nhận mật khẩu mới"
                    value={passwordForm.confirmPassword}
                    onChange={(v) => setPasswordForm(p => ({ ...p, confirmPassword: v }))}
                    error={errors.confirmPassword}
                    required
                />
                <div className="flex justify-end space-x-3 mt-4">
                    <Button variant="ghost" onClick={onClose} type="button">Hủy</Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Xác nhận đổi"}
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
};

export default ChangePasswordPopUp;