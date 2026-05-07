import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, requestPromotion } from "@/services/userService";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import ChangePasswordPopUp from "@/components/popups/ChangePasswordPopUp";
import UpdateProfilePopUp from "@/components/popups/UpdateProfilePopUp";
import RequestPromotionPopUp from "@/components/popups/RequestPromotionPopUp";
import type { UserResponseDto } from "@/types/user";
import { UserRole, USER_ROLE_MAP } from "@/constants/enum/UserRole";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserResponseDto | null>(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isPassOpen, setIsPassOpen] = useState(false);
    const [isPromotionOpen, setIsPromotionOpen] = useState(false);
    const [isPromotionLoading, setIsPromotionLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setUserData(data);
            } catch (err) {
                toast.error("Không thể tải hồ sơ.");
            }
        };
        fetchProfile();
    }, [toast]);

    const handleRequestPromotion = async (data: { currentRole: UserRole; requestedRole: UserRole; reason: string }) => {
        setIsPromotionLoading(true);
        try {
            await requestPromotion(data);
            toast.success("Gửi yêu cầu thăng cấp thành công!");
            setIsPromotionOpen(false);
        } catch (err) {
            toast.error("Gửi yêu cầu thăng cấp thất bại.");
        } finally {
            setIsPromotionLoading(false);
        }
    };

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
                <Button variant="ghost" onClick={() => navigate("/documents")} className="mb-6">
                    ← Quay lại Documents
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 p-8 border-dark-700 bg-dark-900/50 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-dark-800">
                            <h2 className="text-2xl font-bold text-white">Thông Tin Cá Nhân</h2>
                            <Button variant="outline" size="sm" onClick={() => setIsUpdateOpen(true)}>
                                Chỉnh sửa hồ sơ
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6">
                            <div><p className="text-primary-400 text-sm">Họ và Tên</p><p className="text-white text-lg font-medium">{userData.firstName} {userData.lastName}</p></div>
                            <div><p className="text-primary-400 text-sm">Mã nhân viên</p><p className="text-white text-lg font-medium">{userData.employeeCode}</p></div>
                            <div><p className="text-primary-400 text-sm">Số điện thoại</p><p className="text-white text-lg font-medium">{userData.phoneNumber || "Chưa cập nhật"}</p></div>
                        </div>
                    </Card>

                    <Card className="p-6 h-fit border-dark-700">
                        <h2 className="text-xl font-bold text-white mb-6">Tài Khoản</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center"><span className="text-primary-400">Vai trò</span><span className="text-white font-medium">{USER_ROLE_MAP[userData.role]?.label}</span></div>
                            <div className="flex justify-between items-center"><span className="text-primary-400">Trạng thái</span><span className="text-green-400 font-medium">{userData.isActive ? "Hoạt động" : "Không hoạt động"}</span></div>
                        </div>
                        <div className="space-y-3 mt-10">
                            <Button variant="outline" className="w-full" onClick={() => setIsPassOpen(true)}>Đổi mật khẩu</Button>
                            {userData.role < UserRole.Admin && (
                                <Button variant="primary" className="w-full" onClick={() => setIsPromotionOpen(true)}>
                                    Yêu cầu thăng cấp
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <UpdateProfilePopUp
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                userData={userData}
                onSuccess={(updated) => {
                    setUserData(updated);
                    toast.success("Cập nhật thành công!");
                }}
                onError={toast.error}
            />

            <ChangePasswordPopUp
                isOpen={isPassOpen}
                onClose={() => setIsPassOpen(false)}
                onSuccess={() => toast.success("Đổi mật khẩu thành công!")}
                onError={toast.error}
            />

            <RequestPromotionPopUp
                isOpen={isPromotionOpen}
                onClose={() => setIsPromotionOpen(false)}
                onSubmit={handleRequestPromotion}
                currentRole={userData.role}
                isLoading={isPromotionLoading}
            />
        </div>
    );
};

export default ProfilePage;