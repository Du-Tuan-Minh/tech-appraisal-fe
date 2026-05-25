import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import { Button, Card, Input, Pagination } from "../../components/ui";
import FormField from "../../components/ui/FormField";

import { appraisalService } from "../../services/appraisalService";
import { getUsers } from "../../services/userService";
import type { AppraisalAssignmentDetailDto, AssignStaffRequest } from "../../types/assignment";
import type { UserResponseDto, UserFilterDto } from "../../types/user";

const CreateStaffAssignmentPage = () => {
    const navigate = useNavigate();
    const { departmentId, assignmentId } = useParams<{ departmentId: string; assignmentId: string }>();

    const [assignment, setAssignment] = useState<AppraisalAssignmentDetailDto | null>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [managerNote, setManagerNote] = useState("");
    const [deadline, setDeadline] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const fetchAssignmentDetail = useCallback(async () => {
        if (!assignmentId) return;
        try {
            const data = await appraisalService.getAssignmentById(assignmentId);
            setAssignment(data);
        } catch (err) {
            toast.error("Không thể tải thông tin hồ sơ.");
            navigate("/appraisals/staff-reviewer-list");
        }
    }, [assignmentId, navigate]);

    const fetchStaffList = useCallback(async (page: number, search: string) => {
        if (!departmentId) return;

        setIsLoadingUsers(true);
        try {
            const filters: UserFilterDto = {
                page,
                pageSize: pagination.pageSize,
                departmentId: departmentId,
                searchTerm: search || null,
                isActive: true,
                role: null
            };

            const res = await getUsers(filters);
            setUsers(res.items);
            setPagination(prev => ({
                ...prev,
                page,
                totalCount: res.totalCount,
                totalPages: res.totalPages
            }));
        } catch (err) {
            toast.error("Lỗi khi tải danh sách nhân sự.");
        } finally {
            setIsLoadingUsers(false);
        }
    }, [departmentId, pagination.pageSize]);

    useEffect(() => {
        const init = async () => {
            setIsLoadingInitial(true);
            await fetchAssignmentDetail();
            await fetchStaffList(1, "");
            setIsLoadingInitial(false);
        };
        init();
    }, [fetchAssignmentDetail, fetchStaffList]);

    useEffect(() => {
        if (isLoadingInitial) return;
        const delayDebounce = setTimeout(() => {
            fetchStaffList(1, searchTerm);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, fetchStaffList, isLoadingInitial]);

    const handleToggleUser = (userId: string) => {
        setSelectedStaffIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        if (!assignmentId || selectedStaffIds.length === 0) {
            return toast.error("Vui lòng chọn ít nhất một nhân sự thẩm định.");
        }

        setIsSubmitting(true);
        try {
            const request: AssignStaffRequest = {
                assignmentId,
                staffIds: selectedStaffIds,
                managerNote: managerNote.trim() || null,
                deadline: deadline ? new Date(deadline).toISOString() : null
            };

            await appraisalService.assignStaff(request);
            toast.success("Đã phân công nhân sự thành công!");
            navigate("/appraisals/listAssignments");
        } catch (err: any) {
            toast.error(err.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingInitial) return (
        <Layout>
            <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="w-full px-6 py-6 space-y-6">
                <div className="flex justify-between items-center border-b border-dark-700 pb-4">
                    <h1 className="text-2xl font-black text-white uppercase">Phân công Reviewers</h1>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Quay lại</Button>
                </div>

                {assignment && (
                    <Card className="bg-dark-900/40 border-primary-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                            <FormField label="Tài liệu"><Input value={assignment.documentTitle} readOnly disabled /></FormField>
                            <FormField label="Mã hiệu"><Input value={assignment.documentCode} readOnly disabled /></FormField>
                            <FormField label="Phiên bản"><Input value={`v${assignment.versionNumber}`} readOnly disabled /></FormField>
                            <FormField label="Phòng ban phụ trách"><Input value={assignment.departmentName || "N/A"} readOnly disabled /></FormField>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-4">
                        <Card title="Danh sách nhân sự khả dụng">
                            <div className="mb-4">
                                <Input
                                    placeholder="Tìm theo tên hoặc mã nhân viên..."
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                />
                            </div>

                            <div className="space-y-2 min-h-[400px]">
                                {isLoadingUsers ? (
                                    <div className="text-center py-20 text-primary-500 animate-pulse">Đang tải dữ liệu nhân sự...</div>
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleToggleUser(user.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedStaffIds.includes(user.id)
                                                ? "bg-primary-500/10 border-primary-500"
                                                : "bg-dark-800/40 border-dark-700 hover:border-gray-500"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedStaffIds.includes(user.id) ? "bg-primary-500 border-primary-500" : "border-gray-600"
                                                    }`}>
                                                    {selectedStaffIds.includes(user.id) && <span className="text-white text-xs">✓</span>}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{user.employeeCode} • {user.departmentName}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] bg-dark-700 px-2 py-1 rounded text-gray-400 font-bold">{user.role}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-gray-500 italic">Không tìm thấy nhân sự nào trong đơn vị này.</div>
                                )}
                            </div>

                            <div className="mt-4 border-t border-dark-700 pt-4">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(p) => fetchStaffList(p, searchTerm)}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4">
                        <Card className="sticky top-6 border-primary-500/30">
                            <div className="space-y-6">
                                <div className="text-center p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Đã chọn</p>
                                    <p className="text-4xl font-black text-primary-500">{selectedStaffIds.length}</p>
                                    <p className="text-[10px] text-gray-500 uppercase mt-1">Nhân sự thực hiện</p>
                                </div>

                                <FormField label="Hạn chót hoàn thành">
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-sm text-white outline-none focus:ring-1 focus:ring-primary-500 [color-scheme:dark]"
                                        value={deadline}
                                        min={new Date().toISOString().slice(0, 16)}
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Ghi chú phân công">
                                    <textarea
                                        className="w-full bg-dark-950 border-dark-700 rounded-xl p-4 text-sm text-white outline-none focus:ring-1 focus:ring-primary-500 min-h-[150px] resize-none"
                                        placeholder="Nhập yêu cầu cụ thể..."
                                        value={managerNote}
                                        onChange={(e) => setManagerNote(e.target.value)}
                                    />
                                </FormField>

                                <Button
                                    variant="primary"
                                    className="w-full py-4 font-black uppercase tracking-widest"
                                    onClick={handleSubmit}
                                    isLoading={isSubmitting}
                                    disabled={selectedStaffIds.length === 0}
                                >
                                    Xác nhận giao việc
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateStaffAssignmentPage;