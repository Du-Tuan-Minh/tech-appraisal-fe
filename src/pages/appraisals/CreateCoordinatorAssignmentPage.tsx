import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";

import { appraisalService } from "../../services/appraisalService";
import { departmentService } from "../../services/departmentService";
import { getUsers } from "../../services/userService";

import type { UserResponseDto, UserFilterDto } from "@/types/user";
import type { DepartmentResponseDto } from "../../types/department";
import type { CoordinatorAssignRequest } from "../../types/assignment";

const CreateCoordinatorAssignmentPage = () => {
    const navigate = useNavigate();
    const { versionId } = useParams<{ versionId: string }>();
    const [searchParams] = useSearchParams();

    const [deadline, setDeadline] = useState("");
    const [globalComment, setGlobalComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<"staff" | "department">("staff");

    const [seniors, setSeniors] = useState<UserResponseDto[]>([]);
    const [selectedSeniors, setSelectedSeniors] = useState<UserResponseDto[]>([]);
    const [searchStaffTerm, setSearchStaffTerm] = useState("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [staffPagination, setStaffPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<DepartmentResponseDto[]>([]);
    const [searchDeptTerm, setSearchDeptTerm] = useState("");
    const [isLoadingDepts, setIsLoadingDepts] = useState(false);
    const [deptPagination, setDeptPagination] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
    });

    const context = useMemo(() => ({
        documentId: searchParams.get("documentId") || "",
        title: searchParams.get("title") || "N/A",
        code: searchParams.get("code") || "N/A",
        version: searchParams.get("v") || "0",
        versionId: versionId || "",
        parentId: searchParams.get("parentId") || "",
    }), [searchParams, versionId]);

    const selectedSeniorIds = useMemo(() => selectedSeniors.map(s => s.id), [selectedSeniors]);
    const selectedDeptIds = useMemo(() => selectedDepartments.map(d => d.id), [selectedDepartments]);
    const selectedDeptManagerIds = useMemo(
        () => Array.from(new Set(selectedDepartments
            .map(d => d.managerId)
            .filter((id): id is string => Boolean(id)))),
        [selectedDepartments]
    );

    const fetchStaffList = useCallback(async (page: number, search: string) => {
        setIsLoadingUsers(true);
        try {
            const filters: UserFilterDto = {
                page,
                pageSize: staffPagination.pageSize,
                departmentId: null,
                searchTerm: search || null,
                isActive: true,
                role: null
            };
            const res = await getUsers(filters);
            setSeniors(res.items);
            setStaffPagination(prev => ({
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
    }, [staffPagination.pageSize]);

    const fetchDepartmentList = useCallback(async (page: number, search: string) => {
        setIsLoadingDepts(true);
        try {
            const res = await departmentService.getDepartments(
                page,
                deptPagination.pageSize,
                search || undefined,
                context.parentId || undefined
            );
            setDepartments(res.items);
            setDeptPagination(prev => ({
                ...prev,
                page,
                totalCount: res.totalCount,
                totalPages: res.totalPages
            }));
        } catch (err) {
            toast.error("Lỗi khi tải danh sách phòng ban thẩm định.");
        } finally {
            setIsLoadingDepts(false);
        }
    }, [deptPagination.pageSize, context.parentId]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchStaffList(1, searchStaffTerm);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchStaffTerm, fetchStaffList]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchDepartmentList(1, searchDeptTerm);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchDeptTerm, fetchDepartmentList]);

    const handleSelectStaff = (user: UserResponseDto) => {
        setSelectedSeniors(prev =>
            prev.some(item => item.id === user.id)
                ? prev.filter(item => item.id !== user.id)
                : [...prev, user]
        );
    };

    const handleSelectDept = (dept: DepartmentResponseDto) => {
        setSelectedDepartments(prev =>
            prev.some(item => item.id === dept.id)
                ? prev.filter(item => item.id !== dept.id)
                : [...prev, dept]
        );
    };

    const handleSubmit = async () => {
        if (!context.documentId) return toast.error("Thiếu thông tin ID tài liệu.");

        const hasSelection = selectedSeniors.length > 0 || selectedDepartments.length > 0;
        if (!hasSelection) {
            return toast.error("Vui lòng chọn ít nhất 1 cán bộ hoặc 1 phòng ban để phân công.");
        }
        if (!deadline) return toast.error("Vui lòng chọn hạn chót thẩm định.");

        if (selectedDepartments.length > 0 && selectedDeptManagerIds.length === 0) {
            return toast.error("Một số phòng ban chưa có quản lý. Vui lòng chọn phòng ban khác hoặc chọn cán bộ trực tiếp.");
        }

        const utcDeadline = new Date(deadline).toISOString();
        setIsSubmitting(true);

        try {
            const payload: CoordinatorAssignRequest = {
                documentId: context.documentId,
                versionId: context.versionId,
                staffIds: selectedSeniorIds.length > 0 ? selectedSeniorIds : undefined,
                managerIds: selectedDeptManagerIds.length > 0 ? selectedDeptManagerIds : undefined,
                deadline: utcDeadline,
                comment: globalComment || null,
            };

            await appraisalService.coordinatorAssign(payload);

            toast.success("Đã phân công điều phối thẩm định thành công.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi khi tạo phân công điều phối.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Điều Phối Thẩm Định</h1>
                        <p className="text-gray-400 text-sm">Giao việc cho cán bộ chuyên trách, trưởng phòng ban</p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Quay lại</Button>
                </div>

                <Card className="p-6 space-y-8 bg-dark-900/50 border-dark-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-dark-800/40 rounded-xl border border-dark-700/50">
                        <Input label="Tài liệu" value={context.title} readOnly className="opacity-70" />
                        <Input label="Mã số" value={context.code} readOnly className="opacity-70" />
                        <Input label="Phiên bản" value={`v${context.version}`} readOnly className="opacity-70" />
                    </div>

                    <div className="space-y-6">
                        <div className="w-full md:w-1/2">
                            <Input
                                label="Hạn chót thẩm định"
                                type="datetime-local"
                                value={deadline}
                                onChange={setDeadline}
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex border-b border-dark-700 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("staff")}
                                    className={`py-2 px-4 font-semibold text-sm transition-all border-b-2 ${activeTab === "staff"
                                        ? "border-yellow-500 text-yellow-500"
                                        : "border-transparent text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Cán bộ thẩm định ({selectedSeniors.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("department")}
                                    className={`py-2 px-4 font-semibold text-sm transition-all border-b-2 ${activeTab === "department"
                                        ? "border-primary-500 text-primary-400"
                                        : "border-transparent text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Phòng ban / Đơn vị ({selectedDepartments.length})
                                </button>
                            </div>

                            {activeTab === "staff" ? (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Tìm kiếm cán bộ theo tên, mã nhân viên..."
                                        value={searchStaffTerm}
                                        onChange={setSearchStaffTerm}
                                    />
                                    <div className="max-h-64 min-h-[160px] overflow-y-auto border border-dark-700 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-dark-950/50 shadow-inner">
                                        {isLoadingUsers ? (
                                            <div className="col-span-full text-center py-12 text-yellow-500 animate-pulse">
                                                Đang tải danh sách nhân sự...
                                            </div>
                                        ) : seniors.length > 0 ? (
                                            seniors.map(user => {
                                                const isChecked = selectedSeniorIds.includes(user.id);
                                                return (
                                                    <label key={user.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${isChecked ? "bg-yellow-500/10 border-yellow-500/50" : "bg-dark-800/50 border-transparent hover:border-dark-600"}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleSelectStaff(user)}
                                                            className="w-4 h-4 rounded accent-yellow-500"
                                                        />
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className={`text-sm truncate ${isChecked ? "text-yellow-500 font-bold" : "text-gray-300"}`}>
                                                                {user.lastName} {user.firstName}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 uppercase">{user.employeeCode}</span>
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-gray-500 italic">Không tìm thấy cán bộ phù hợp.</div>
                                        )}
                                    </div>
                                    {staffPagination.totalPages > 1 && (
                                        <div className="mt-2 pt-2 border-t border-dark-800 flex justify-end">
                                            <Pagination
                                                currentPage={staffPagination.page}
                                                totalPages={staffPagination.totalPages}
                                                onPageChange={(page) => fetchStaffList(page, searchStaffTerm)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Tìm kiếm theo tên phòng ban, mã đơn vị..."
                                        value={searchDeptTerm}
                                        onChange={setSearchDeptTerm}
                                    />
                                    <div className="max-h-64 min-h-[160px] overflow-y-auto border border-dark-700 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-dark-950/50 shadow-inner">
                                        {isLoadingDepts ? (
                                            <div className="col-span-full text-center py-12 text-primary-500 animate-pulse">
                                                Đang tải danh sách phòng ban...
                                            </div>
                                        ) : departments.length > 0 ? (
                                            departments.map(dept => {
                                                const isChecked = selectedDeptIds.includes(dept.id);
                                                return (
                                                    <label key={dept.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${isChecked ? "bg-primary-500/10 border-primary-500/50" : "bg-dark-800/50 border-transparent hover:border-dark-600"}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleSelectDept(dept)}
                                                            className="w-4 h-4 rounded accent-primary-500"
                                                        />
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className={`text-sm truncate ${isChecked ? "text-primary-400 font-bold" : "text-gray-300"}`}>
                                                                {dept.nameDepartment}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 uppercase">{dept.codeDepartment}</span>
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-gray-500 italic">Không tìm thấy phòng ban nào.</div>
                                        )}
                                    </div>
                                    {deptPagination.totalPages > 1 && (
                                        <div className="mt-2 pt-2 border-t border-dark-800 flex justify-end">
                                            <Pagination
                                                currentPage={deptPagination.page}
                                                totalPages={deptPagination.totalPages}
                                                onPageChange={(page) => fetchDepartmentList(page, searchDeptTerm)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(selectedSeniors.length > 0 || selectedDepartments.length > 0) && (
                            <div className="p-4 bg-dark-950/40 border border-dark-700/60 rounded-xl space-y-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đối tượng nhận phân công thực tế (Tổng hợp):</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeniors.map(u => (
                                        <span key={u.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 animate-fadeIn">
                                            👨‍💼 {u.lastName} {u.firstName}
                                            <button type="button" onClick={() => handleSelectStaff(u)} className="hover:text-red-400 ml-1 font-bold transition-colors">×</button>
                                        </span>
                                    ))}
                                    {selectedDepartments.map(d => (
                                        <span key={d.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/30 animate-fadeIn">
                                            🏢 {d.nameDepartment}
                                            <button type="button" onClick={() => handleSelectDept(d)} className="hover:text-red-400 ml-1 font-bold transition-colors">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary-400 uppercase">Ghi chú / Hướng dẫn nhiệm vụ</label>
                            <textarea
                                className="w-full p-4 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none shadow-inner"
                                rows={3}
                                placeholder="Nhập nội dung ghi chú gửi đến cán bộ hoặc phòng ban tiếp nhận..."
                                value={globalComment}
                                onChange={e => setGlobalComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg font-bold shadow-lg shadow-primary-500/10"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý phân công..." : "Xác nhận và Phát hành"}
                    </Button>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateCoordinatorAssignmentPage;