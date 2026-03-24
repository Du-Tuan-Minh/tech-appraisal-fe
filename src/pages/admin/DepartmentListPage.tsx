import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Pagination from "../../components/ui/Pagination";
import { toast } from "react-hot-toast";
import CreateDepartmentPopUp from "../../components/popups/CreateDepartmentPopUp";
import InviteMemberPopUp from "../../components/popups/InviteMemberPopUp";
import JoinDepartmentPopUp from "../../components/popups/JoinDepartmentPopUp";
import { departmentService } from "../../services/departmentService";
import type { DepartmentResponseDto } from "../../types/department";
import type { PagedResult } from "../../types/paginationResult";

const DepartmentListPage = () => {
  const navigate = useNavigate();

  // States
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponseDto | null>(null);

  // Fetch departments
  const fetchDepartments = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response: PagedResult<DepartmentResponseDto> =
        await departmentService.getDepartments(page, pagination.limit);

      setDepartments(response.items);
      setPagination({
        page: response.page,
        limit: response.pageSize,
        total: response.totalCount,
        totalPages: response.totalPages
      });
    } catch (err) {
      toast.error("Không thể tải danh sách phòng ban.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (data: any) => {
    setIsSubmitting(true);
    try {
      await departmentService.createDepartment(data);
      toast.success("Thành công!");
      fetchDepartments();
      setIsCreateOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteMember = async (data: { email: string }) => {
    if (!selectedDepartment) return;

    try {
      //  await departmentService.createInvitation(selectedDepartment.id, data.email);
      toast.success("Gửi lời mời thành công!");
    } catch (err) {
      toast.error("Gửi lời mời thất bại.");
      throw err;
    }
  };

  const handleJoinDepartment = async (invitationCode: string) => {
    try {
      await departmentService.joinDepartment(invitationCode);
      toast.success("Tham gia phòng ban thành công!");
      fetchDepartments(pagination.page);
    } catch (err) {
      toast.error("Tham gia phòng ban thất bại.");
      throw err;
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;

    try {
      await departmentService.deleteDepartment(id);
      toast.success("Xóa phòng ban thành công!");
      fetchDepartments(pagination.page);
    } catch (err) {
      toast.error("Xóa phòng ban thất bại.");
    }
  };

  const handlePageChange = (page: number) => {
    fetchDepartments(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            ← Quay lại Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Danh Sách Phòng Ban</h1>
              <p className="text-primary-400 mt-2">Quản lý phòng ban và thành viên</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsJoinOpen(true)}
              >
                Tham Gia Phòng Ban
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
              >
                Tạo Phòng Ban Mới
              </Button>
            </div>
          </div>
        </div>

        {/* Department List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-dark-700 rounded mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded w-2/3"></div>
                </div>
              </Card>
            ))
          ) : departments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-primary-400">Chưa có phòng ban nào.</p>
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4"
              >
                Tạo Phòng Ban Đầu Tiên
              </Button>
            </div>
          ) : (
            departments.map((department) => (
              <Card key={department.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{department.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setIsInviteOpen(true);
                      }}
                    >
                      Mời
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>

                {department.description && (
                  <p className="text-primary-400 text-sm mb-3 line-clamp-2">
                    {department.description}
                  </p>
                )}

                {department.managerName && (
                  <div className="flex items-center text-sm">
                    <span className="text-primary-400">Quản lý:</span>
                    <span className="text-white ml-2">{department.managerName}</span>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && departments.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Popups */}
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
          departmentName={selectedDepartment?.name || ""}
        />

        <JoinDepartmentPopUp
          isOpen={isJoinOpen}
          onClose={() => setIsJoinOpen(false)}
          onSubmit={handleJoinDepartment}
        />
      </div>
    </div>
  );
};

export default DepartmentListPage;
