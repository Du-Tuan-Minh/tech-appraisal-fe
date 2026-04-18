import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

import { appraisalService } from "../../services/appraisalService";
import { departmentService } from "../../services/departmentService";
import type { DepartmentResponseDto } from "../../types/department";

const AssignmentCreatePage = () => {
    const navigate = useNavigate();
    const { versionId } = useParams<{ versionId: string }>();
    const [searchParams] = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deadline, setDeadline] = useState("");
    const [globalComment, setGlobalComment] = useState("");

    const context = useMemo(() => ({
        documentId: searchParams.get("documentId") || "",
        title: searchParams.get("title") || "N/A",
        code: searchParams.get("code") || "N/A",
        version: searchParams.get("v") || "0",
        parentId: searchParams.get("parentId") || "",
    }), [searchParams]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await departmentService.getDepartments(
                    1,
                    100,
                    searchTerm,
                    context.parentId || undefined
                );
                setDepartments(res.items);
            } catch (err) {
                toast.error("Không thể tải danh sách đơn vị thực hiện.");
            }
        };

        const debounceTimer = setTimeout(fetchDepartments, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, context.parentId]);

    const handleSubmit = async () => {
        if (!versionId) return toast.error("Thiếu thông tin tài liệu.");
        if (selectedDepartments.length === 0) return toast.error("Vui lòng chọn ít nhất 1 phòng ban.");
        if (!deadline) return toast.error("Vui lòng chọn hạn chót thẩm định.");

        const utcDeadline = new Date(deadline).toISOString();

        setIsSubmitting(true);
        try {
            await appraisalService.createParallelAssignments({
                documentId: context.documentId,
                requestVersionId: versionId,
                globalDeadline: utcDeadline,
                globalComment: globalComment || null,
                departmentAssignments: selectedDepartments.map(id => ({
                    departmentId: id,
                    deadline: utcDeadline,
                    managerComment: globalComment || null
                }))
            });

            toast.success("Đã phát hành phân công thẩm định song song.");
            navigate("/appraisals/director-assignments");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Lỗi khi tạo phân công.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Phân Công Thẩm Định</h1>
                        <p className="text-gray-400 text-sm">Thiết lập luồng thẩm định cho các phòng ban trực thuộc</p>
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
                                label="Hạn chót thẩm định (Toàn bộ)"
                                type="datetime-local"
                                value={deadline}
                                onChange={setDeadline}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-semibold text-primary-400 uppercase">
                                    {context.parentId ? "Danh sách Phòng Ban trực thuộc" : "Danh sách Trung tâm"}
                                </label>
                                <span className="text-xs text-gray-500">Đã chọn: {selectedDepartments.length}</span>
                            </div>

                            <Input
                                placeholder="Tên phòng ban..."
                                value={searchTerm}
                                onChange={setSearchTerm}
                            />

                            <div className="max-h-64 overflow-y-auto border border-dark-700 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-dark-950/50 shadow-inner">
                                {departments.length > 0 ? (
                                    departments.map(dept => {
                                        const isChecked = selectedDepartments.includes(dept.id);
                                        return (
                                            <label
                                                key={dept.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${isChecked
                                                    ? "bg-primary-500/10 border-primary-500/50 shadow-sm"
                                                    : "bg-dark-800/50 border-transparent hover:border-dark-600"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => setSelectedDepartments(prev =>
                                                        isChecked ? prev.filter(i => i !== dept.id) : [...prev, dept.id]
                                                    )}
                                                    className="w-4 h-4 rounded accent-primary-500"
                                                />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className={`text-sm truncate ${isChecked ? "text-primary-400 font-bold" : "text-gray-300"}`}>
                                                        {dept.nameDepartment}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                                        {dept.codeDepartment}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-10 text-center text-gray-500 italic text-sm">
                                        Không tìm thấy phòng ban nào khả dụng.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary-400 uppercase">Ghi chú từ Quản lý</label>
                            <textarea
                                className="w-full p-4 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none shadow-inner"
                                rows={3}
                                placeholder="Nhập hướng dẫn cho các đơn vị thẩm định..."
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
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận và Phát hành"}
                    </Button>
                </Card>
            </div>
        </Layout>
    );
};

export default AssignmentCreatePage;