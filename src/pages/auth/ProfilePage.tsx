import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/userService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Form from "../../components/ui/Form";
import { useToast } from "../../components/ui/ToastContext";
import ChangePasswordPopUp from "../../components/popups/ChangePasswordPopUp";
import { UserRole } from "../../constants/enum/UserRole";
import type { UserResponseDto, UpdateProfileDto } from "../../types/user";

const ProfilePage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    // States
    const [userData, setUserData] = useState<UserResponseDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [profileForm, setProfileForm] = useState<UpdateProfileDto>({
        firstName: "", lastName: "", phoneNumber: "", avatarUrl: ""
    });

    // Fetch data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setUserData(data);
                setProfileForm({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phoneNumber: data.phoneNumber || "",
                    avatarUrl: data.avatarUrl || ""
                });
            } catch (err) {
                toast.error("Không thể tải thông tin hồ sơ.");
            }
        };
        fetchProfile();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!profileForm.firstName?.trim()) newErrors.firstName = "Họ là bắt buộc";
        if (!profileForm.lastName?.trim()) newErrors.lastName = "Tên là bắt buộc";
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        setIsLoading(true);
        try {
            const updated = await updateProfile(profileForm);
            setUserData(updated);
            setIsEditing(false);
            toast.success("Cập nhật thông tin thành công!");
        } catch (err) {
            toast.error("Cập nhật thông tin thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper
    const getRoleLabel = (role: UserRole) => {
        const labels: Record<number, string> = {
            [UserRole.Admin]: "Quản trị viên",
            [UserRole.CnlStaff]: "C&L Staff",
            [UserRole.CnlManager]: "C&L Manager"
        };
        return labels[role] || "Nhân viên";
    };

    // Loading Guard: Giải quyết lỗi "userData is possibly null"
    if (!userData) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 p-6">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
                    ← Quay lại Dashboard
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Thông Tin Cá Nhân</h2>
                            {!isEditing ? (
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                            ) : (
                                <div className="space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Hủy</Button>
                                    <Button variant="primary" size="sm" onClick={handleProfileSubmit} disabled={isLoading}>Lưu</Button>
                                </div>
                            )}
                        </div>
                        <Form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Họ" value={profileForm.firstName} error={errors.firstName} disabled={!isEditing} onChange={v => setProfileForm(p => ({ ...p, firstName: v }))} />
                                <Input label="Tên" value={profileForm.lastName} error={errors.lastName} disabled={!isEditing} onChange={v => setProfileForm(p => ({ ...p, lastName: v }))} />
                                <Input label="Email" value={userData.email} disabled className="opacity-60 col-span-2" />
                                <Input label="Số điện thoại" value={profileForm.phoneNumber} disabled={!isEditing} onChange={v => setProfileForm(p => ({ ...p, phoneNumber: v }))} />
                            </div>
                        </Form>
                    </Card>

                    <Card className="p-6 h-fit">
                        <h2 className="text-xl font-bold text-white mb-6">Tài Khoản</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between"><span className="text-primary-400">Vai trò:</span> <span className="text-white">{getRoleLabel(userData.role)}</span></div>
                            <div className="flex justify-between"><span className="text-primary-400">Trạng thái:</span> <span className="text-green-400">Đang hoạt động</span></div>
                        </div>
                        <Button variant="outline" className="w-full mt-8" onClick={() => setIsPopUpOpen(true)}>Đổi mật khẩu</Button>
                    </Card>
                </div>
            </div>

            <ChangePasswordPopUp
                isOpen={isPopUpOpen}
                onClose={() => setIsPopUpOpen(false)}
                onSuccess={() => toast.success("Đổi mật khẩu thành công!")}
                onError={() => toast.error("Đổi mật khẩu thất bại!")}
            />
        </div>
    );
};

export default ProfilePage;