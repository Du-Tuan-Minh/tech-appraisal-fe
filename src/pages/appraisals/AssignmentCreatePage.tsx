import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data States
    const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const [form, setForm] = useState({
        documentTitle: "",
        documentCode: "",
        versionNumber: 1,
        deadline: "",
        globalComment: ""
    });

    // Load Departments
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await departmentService.getDepartments(pagination.page, 10, searchTerm);
                setDepartments(res.items);
                setPagination(prev => ({ ...prev, totalPages: res.totalPages }));
            } catch {
                toast.error("Không thể tải danh sách trung tâm.");
            }
        };
        fetchDepts();
    }, [pagination.page, searchTerm]);

    const handleSubmit = async () => {
        if (!form.documentTitle || !form.documentCode || selectedDepartments.length === 0) {
            return toast.error("Vui lòng nhập đầy đủ thông tin và chọn ít nhất 1 trung tâm.");
        }

        setIsSubmitting(true);
        try {
            await appraisalService.createParallelAssignments({
                documentId: "", // Logic Backend handle
                requestVersionId: "",
                globalDeadline: form.deadline || null,
                globalComment: form.globalComment || null,
                departmentAssignments: selectedDepartments.map(id => ({
                    departmentId: id,
                    deadline: form.deadline || null,
                    managerComment: form.globalComment || null
                }))
            });
            toast.success("Tạo phân công thành công!");
            navigate("/appraisals/assignments");
        } catch {
            toast.error("Tạo phân công thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Tạo Phân Công Thẩm Định Mới</h1>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Hủy</Button>
                </div>

                <div className="grid gap-6">
                    <Card className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Tên tài liệu" value={form.documentTitle} onChange={v => setForm({ ...form, documentTitle: v })} />
                            <Input label="Mã tài liệu" value={form.documentCode} onChange={v => setForm({ ...form, documentCode: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Phiên bản" type="number" value={form.versionNumber.toString()} onChange={v => setForm({ ...form, versionNumber: Number(v) })} />
                            <Input label="Deadline" type="datetime-local" value={form.deadline} onChange={v => setForm({ ...form, deadline: v })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary-400 mb-2">Chọn Trung Tâm Tiếp Nhận</label>
                            <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={v => { setSearchTerm(v); setPagination(p => ({ ...p, page: 1 })) }} className="mb-3" />
                            <div className="max-h-60 overflow-y-auto border border-dark-700 rounded-lg p-2 grid grid-cols-2 gap-2">
                                {departments.map(dept => (
                                    <label key={dept.id} className="flex items-center gap-3 p-2 hover:bg-dark-800 rounded cursor-pointer border border-transparent has-[:checked]:border-primary-500">
                                        <input
                                            type="checkbox"
                                            checked={selectedDepartments.includes(dept.id)}
                                            onChange={() => setSelectedDepartments(prev => prev.includes(dept.id) ? prev.filter(i => i !== dept.id) : [...prev, dept.id])}
                                            className="w-4 h-4 accent-primary-500"
                                        />
                                        <span className="text-sm text-white">{dept.nameDepartment}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <textarea
                            className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg text-white"
                            rows={3}
                            placeholder="Ghi chú quản lý..."
                            value={form.globalComment}
                            onChange={e => setForm({ ...form, globalComment: e.target.value })}
                        />

                        <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận Phân Công"}
                        </Button>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AssignmentCreatePage;