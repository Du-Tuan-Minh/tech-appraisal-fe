import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import { Button, Card, Input, Pagination } from "../../components/ui";
import FormField from "../../components/ui/FormField";

import { appraisalService } from "../../services/appraisalService";
import { departmentService } from "../../services/departmentService";
import type { AppraisalAssignmentDetailDto, AssignStaffRequest } from "../../types/assignment";
import type { DepartmentResponseDto } from "../../types/department";

const StaffAssignmentPage = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams<{ assignmentId: string }>();

    const [assignment, setAssignment] = useState<AppraisalAssignmentDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [managerNote, setManagerNote] = useState("");

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
            toast.error("Không thể tải thông tin phân công.");
            navigate("/appraisals/staff-reviewer-list");
        }
    }, [assignmentId, navigate]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const deptRes = await departmentService.getDepartments(
                pagination.page,
                pagination.pageSize,
                searchTerm
            );
            setDepartments(deptRes.items);
            setPagination(prev => ({
                ...prev,
                totalCount: deptRes.totalCount,
                totalPages: deptRes.totalPages
            }));

            await fetchAssignmentDetail();
        } catch (err) {
            toast.error("Lỗi khi tải dữ liệu hệ thống.");
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.pageSize, searchTerm, fetchAssignmentDetail]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStaffSelect = (staffId: string) => {
        setSelectedStaff(prev =>
            prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
        );
    };

    // Hành động Submit dựa trên appraisalService.assignStaff
    const handleSubmit = async () => {
        if (!assignmentId || selectedStaff.length === 0) {
            return toast.error("Vui lòng chọn ít nhất một nhân viên.");
        }

        setIsSubmitting(true);
        try {
            const request: AssignStaffRequest = {
                assignmentId,
                staffIds: selectedStaff,
                managerNote: managerNote.trim() || null
            };

            await appraisalService.assignStaff(request);
            toast.success("Phân công nhân sự thành công!");
            navigate("/appraisals/staff-reviewer-list");
        } catch (err: any) {
            toast.error(err.message || "Lỗi xử lý phân công.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <Layout>
            <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end border-b border-dark-700 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase">Phân Công Nhân Sự</h1>
                        <p className="text-gray-400 text-sm">Quản lý và điều phối nhân viên tham gia thẩm định</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Quay lại</Button>
                </div>

                {assignment && (
                    <Card className="bg-dark-900/40 border-primary-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                            <FormField label="Tài liệu"><Input value={assignment.documentTitle} readOnly disabled /></FormField>
                            <FormField label="Mã hiệu"><Input value={assignment.documentCode} readOnly disabled /></FormField>
                            <FormField label="Phiên bản"><Input value={`v${assignment.versionNumber}`} readOnly disabled /></FormField>
                            <FormField label="Người quản lý"><Input value={assignment.responsibleManagerName} readOnly disabled /></FormField>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card title="Danh sách nhân sự theo phòng ban">
                            <div className="mb-4">
                                <Input
                                    placeholder="Tìm kiếm phòng ban hoặc nhân viên..."
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                />
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {departments.map(dept => (
                                    <div key={dept.id} className="border border-dark-700 rounded-lg p-4 bg-dark-800/30">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-primary-400 font-bold uppercase text-xs tracking-widest">
                                                {dept.nameDepartment}
                                            </span>
                                            <span className="text-[10px] text-gray-500">{dept.codeDepartment}</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <p className="text-gray-500 text-xs italic italic">Tính năng liệt kê nhân viên theo phòng ban...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
                                />
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card title="Thông tin phân công" className="sticky top-6">
                            <div className="space-y-4">
                                <div className="p-3 bg-primary-500/5 border border-primary-500/20 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300">Nhân sự đã chọn:</span>
                                        <span className="text-xl font-bold text-primary-500">{selectedStaff.length}</span>
                                    </div>
                                </div>

                                <FormField label="Ghi chú điều phối">
                                    <textarea
                                        className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary-500 outline-none min-h-[120px] resize-none"
                                        placeholder="Nhập hướng dẫn cụ thể cho nhóm thẩm định..."
                                        value={managerNote}
                                        onChange={e => setManagerNote(e.target.value)}
                                    />
                                </FormField>

                                <div className="pt-4 space-y-2">
                                    <Button
                                        variant="primary"
                                        className="w-full py-4 font-bold"
                                        onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                        disabled={selectedStaff.length === 0}
                                    >
                                        XÁC NHẬN PHÂN CÔNG
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                    >
                                        Hủy bỏ
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StaffAssignmentPage;