import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button, Card, Pagination } from "@/components/ui";
import { toast } from "react-hot-toast";
import CreateDepartmentPopUp from "@/components/popups/CreateDepartmentPopUp";
import InviteMemberPopUp from "@/components/popups/InviteMemberPopUp";
import JoinDepartmentPopUp from "@/components/popups/JoinDepartmentPopUp";
import { departmentService } from "@/services/departmentService";
import type { DepartmentResponseDto } from "@/types/department";
import { useAuth } from "@/hooks/useAuth";
import type { UserDetailResponseDto } from "@/types/user";
import { getProfile } from "@/services/userService";

const CenterListPage = () => {
    const navigate = useNavigate();
    const { parentId } = useParams<{ parentId: string }>();
    const { isCoordinator } = useAuth();

    const [userProfile, setUserProfile] = useState<UserDetailResponseDto | null>(null);
    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponseDto | null>(null);

    const isSubLevel = !!parentId;
    const pageTitle = isSubLevel ? "Danh Sách Phòng Ban" : "Danh Sách Trung Tâm";
    const pageDescription = isSubLevel
        ? "Quản lý không gian làm việc và thẩm định nội bộ"
        : "Quản lý các đơn vị cấp cao và cấu trúc tổ chức tổng thể";
    const createButtonText = isSubLevel ? "+ Tạo Phòng Ban" : "+ Tạo Trung Tâm";

    useEffect(() => {
        getProfile()
            .then(setUserProfile)
            .catch((err) => console.error("Lỗi lấy profile:", err));
    }, []);

    const fetchDepartments = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = isSubLevel
                ? await departmentService.getDepartments(page, pagination.limit, "", parentId)
                : await departmentService.getDepartments(page, pagination.limit);

            setDepartments(response.items);
            setPagination(prev => ({
                ...prev,
                page: response.page,
                total: response.totalCount,
                totalPages: response.totalPages
            }));
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Không thể tải danh sách.");
        } finally {
            setIsLoading(false);
        }
    }, [pagination.limit, parentId, isSubLevel]);

    useEffect(() => {
        fetchDepartments(1);
    }, [fetchDepartments]);

    const handleCreateDepartment = async (data: any) => {
        setIsSubmitting(true);
        try {
            const payload = isSubLevel ? { ...data, parentId } : data;
            await departmentService.createDepartment(payload);
            toast.success("Tạo thành công!");
            fetchDepartments(1);
            setIsCreateOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Tạo thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInviteMember = async (data: { employeeCode: string }) => {
        if (!selectedDepartment) return;
        try {
            await departmentService.createInvitation({
                employeeCode: data.employeeCode,
            });
            toast.success(`Đã gửi lời mời đến ${data.employeeCode}`);
            setIsInviteOpen(false);
        } catch (err) {
            toast.error("Gửi lời mời thất bại.");
            throw err;
        }
    };

    const handleJoinDepartment = async (invitationCode: string) => {
        try {
            await departmentService.joinDepartment(invitationCode);
            toast.success("Tham gia phòng ban thành công!");
            fetchDepartments(1);
            setIsJoinOpen(false);
        } catch (err) {
            toast.error("Mã mời không hợp lệ hoặc đã hết hạn.");
            throw err;
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;
        try {
            await departmentService.deleteDepartment(id);
            toast.success("Đã xóa phòng ban.");
            fetchDepartments(pagination.page);
        } catch (err) {
            toast.error("Xóa thất bại.");
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white italic tracking-tight">{pageTitle}</h1>
                        <p className="text-primary-400 mt-1 italic text-sm">{pageDescription}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsJoinOpen(true)}>Tham gia bằng mã</Button>
                        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>{createButtonText}</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : departments.length === 0 ? (
                        <EmptyState onCreate={() => setIsCreateOpen(true)} />
                    ) : (
                        departments.map((dept) => {
                            const isMyDepartment = userProfile?.departmentId === dept.id;

                            return (
                                <Card key={dept.id} className="p-6 bg-dark-900/40 border-t-2 border-primary-500 hover:shadow-2xl transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                            {dept.nameDepartment}
                                        </h3>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedDepartment(dept); setIsInviteOpen(true); }}>Mời</Button>
                                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDeleteDepartment(dept.id)}>Xóa</Button>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-xs leading-relaxed mb-6 min-h-[40px] line-clamp-2 italic">
                                        {dept.description || "Không có mô tả cho phòng ban này."}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-dark-800">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Quản lý</span>
                                            <span className="text-sm text-primary-300 font-medium">{dept.managerName || "N/A"}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            {isMyDepartment && (
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/users`)}>
                                                    Danh sách nhân sự {!isSubLevel && "→"}
                                                </Button>
                                            )}

                                            {!isSubLevel && (
                                                <Button variant="ghost" size="sm" onClick={() => navigate(isCoordinator ? `/users/department-workloads` : `/centers/${dept.id}/departments`)}>
                                                    Vào phòng
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>

                {!isLoading && pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={fetchDepartments}
                        />
                    </div>
                )}

                <CreateDepartmentPopUp
                    isOpen={isCreateOpen}
                    isLoading={isSubmitting}
                    onSubmit={handleCreateDepartment}
                    onClose={() => setIsCreateOpen(false)}
                />
                <InviteMemberPopUp
                    isOpen={isInviteOpen}
                    onClose={() => setIsInviteOpen(false)}
                    onSubmit={handleInviteMember}
                    departmentName={selectedDepartment?.nameDepartment || ""}
                    departmentId={selectedDepartment?.id || ""}
                />
                <JoinDepartmentPopUp
                    isOpen={isJoinOpen}
                    onClose={() => setIsJoinOpen(false)}
                    onSubmit={handleJoinDepartment}
                />
            </div>
        </Layout>
    );
};

const LoadingSkeleton = () => (
    <>
        {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 h-48 bg-dark-800/20 animate-pulse border-none">
                <div />
            </Card>
        ))}
    </>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
    <div className="col-span-full py-20 text-center bg-dark-900/20 rounded-3xl border border-dashed border-dark-700">
        <p className="text-primary-400 italic">Hệ thống chưa ghi nhận phòng ban nào của bạn.</p>
        <Button variant="primary" className="mt-6" onClick={onCreate}>Khởi tạo ngay</Button>
    </div>
);

export default CenterListPage;