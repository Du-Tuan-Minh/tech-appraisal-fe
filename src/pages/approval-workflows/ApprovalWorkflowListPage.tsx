import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import { Layout } from "../../components/layout";

import { approvalWorkflowService } from "../../services/approvalWorkflowService";
import type { ApprovalWorkflowResponseDto } from "../../types/approvalWorkflow";
import { USER_ROLE_MAP } from "@/constants/enum/UserRole";
import { ASSIGNMENT_STATUS_MAP, AssignmentStatus } from "@/constants/enum/AssignmentStatus";
import { formatDate } from "@/utils/date";

const ApprovalWorkflowListPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const documentId = searchParams.get("documentId");
    const requestVersionId = searchParams.get("requestVersionId");

    const [workflows, setWorkflows] = useState<ApprovalWorkflowResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState("");

    const [filters, setFilters] = useState({
        status: "",
        role: "",
        sortBy: "stepOrder",
        sortOrder: "asc" as "asc" | "desc"
    });

    const fetchWorkflows = useCallback(async () => {
        if (!documentId) return;

        setIsLoading(true);
        try {
            // const response = await approvalWorkflowService.getDocumentWorkflow(documentId, requestVersionId);

            await new Promise(r => setTimeout(r, 400));

            setDocumentTitle("Tài liệu quy trình quản lý chất lượng v2.1");
            setWorkflows(MOCK_DATA);
        } catch (err) {
            toast.error("Không thể tải danh sách luồng ký.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId, requestVersionId]);

    useEffect(() => { fetchWorkflows(); }, [fetchWorkflows]);

    const processedWorkflows = useMemo(() => {
        let result = [...workflows];

        if (filters.status) result = result.filter(w => w.status.toString() === filters.status);
        if (filters.role) result = result.filter(w => w.requiredRole.toString() === filters.role);

        result.sort((a, b) => {
            let valA: any = a[filters.sortBy as keyof ApprovalWorkflowResponseDto];
            let valB: any = b[filters.sortBy as keyof ApprovalWorkflowResponseDto];

            if (filters.sortBy === "signedAt") {
                valA = a.signedAt ? new Date(a.signedAt).getTime() : 0;
                valB = b.signedAt ? new Date(b.signedAt).getTime() : 0;
            }

            if (typeof valA === "string") return filters.sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return filters.sortOrder === "asc" ? (valA - valB) : (valB - valA);
        });

        return result;
    }, [workflows, filters]);

    const filterOptions = {
        roles: [{ value: "", label: "Tất cả vai trò" }, ...Object.entries(USER_ROLE_MAP).map(([v, info]) => ({ value: v, label: info.label }))],
        statuses: [{ value: "", label: "Tất cả trạng thái" }, ...Object.entries(ASSIGNMENT_STATUS_MAP).map(([v, info]) => ({ value: v, label: info.label }))],
        sorting: [
            { value: "stepOrder", label: "Thứ tự bước" },
            { value: "approverName", label: "Người duyệt" },
            { value: "signedAt", label: "Ngày ký" }
        ]
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <Header title={documentTitle} onBack={() => navigate(-1)} />

                <FilterBar
                    filters={filters}
                    options={filterOptions}
                    onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
                />

                <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <TableHead />
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? <TableLoading /> :
                                    processedWorkflows.length > 0 ? (
                                        processedWorkflows.map(w => (
                                            <WorkflowRow
                                                key={w.id}
                                                workflow={w}
                                                onView={() => navigate(`/approval-workflows/${w.id}`)}
                                            />
                                        ))
                                    ) : <TableEmpty />}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {workflows.length > 0 && <ProgressBar workflows={workflows} />}
            </div>
        </Layout>
    );
};

const Header = ({ title, onBack }: any) => (
    <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Luồng Ký</h1>
            <p className="text-primary-400 mt-1">{title || "Quản lý quy trình phê duyệt"}</p>
        </div>
        <Button variant="ghost" onClick={onBack}>Quay lại</Button>
    </div>
);

const FilterBar = ({ filters, options, onFilterChange }: any) => (
    <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select label="Vai trò" value={filters.role} options={options.roles} onChange={(v) => onFilterChange("role", v)} />
            <Select label="Trạng thái" value={filters.status} options={options.statuses} onChange={(v) => onFilterChange("status", v)} />
            <Select label="Sắp xếp" value={filters.sortBy} options={options.sorting} onChange={(v) => onFilterChange("sortBy", v)} />
            <div className="flex items-end">
                <Button variant="ghost" className="text-red-400" onClick={() => onFilterChange("role", "")}>Xóa lọc</Button>
            </div>
        </div>
    </Card>
);

const WorkflowRow = ({ workflow, onView }: any) => {
    const roleInfo = USER_ROLE_MAP[workflow.requiredRole];
    const statusInfo = ASSIGNMENT_STATUS_MAP[workflow.status];

    return (
        <tr className={`hover:bg-primary-500/5 transition-colors cursor-pointer ${workflow.isCurrentStep ? "bg-primary-500/10" : ""}`} onClick={onView}>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${workflow.isCurrentStep ? "bg-primary-500 text-white" : "bg-dark-700 text-gray-400"}`}>
                        {workflow.stepOrder}
                    </div>
                    {workflow.isCurrentStep && <span className="text-xs text-primary-400 font-medium">(Hiện tại)</span>}
                </div>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.color}`}>
                    {roleInfo?.label || "N/A"}
                </span>
            </td>
            <td className="p-4 text-gray-300">
                <div className="font-medium">{workflow.approverName || "---"}</div>
                <div className="text-xs text-gray-500">{workflow.approverId}</div>
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
                    {statusInfo?.label}
                </span>
            </td>
            <td className="p-4 text-gray-300">{formatDate(workflow.signedAt)}</td>
            <td className="p-4 text-center">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onView(); }}>Xem</Button>
            </td>
        </tr>
    );
};

const TableHead = () => (
    <thead>
        <tr className="bg-dark-800/70 border-b border-dark-700 text-primary-300">
            {["Bước", "Vai trò", "Người duyệt", "Trạng thái", "Ngày ký", "Thao tác"].map(h => (
                <th key={h} className="p-4 font-semibold">{h}</th>
            ))}
        </tr>
    </thead>
);

const ProgressBar = ({ workflows }: { workflows: ApprovalWorkflowResponseDto[] }) => (
    <Card className="p-6 bg-dark-900/50 border-dark-700">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Tiến độ quy trình</h3>
        <div className="flex items-center">
            {workflows.map((w, i) => (
                <div key={w.id} className="flex items-center flex-1">
                    <div className={`flex-1 h-1.5 rounded-full ${w.status === AssignmentStatus.Completed ? "bg-green-500" :
                        w.isCurrentStep ? "bg-primary-500 animate-pulse" : "bg-dark-700"
                        }`} />
                    {i < workflows.length - 1 && <div className="w-2" />}
                </div>
            ))}
        </div>
    </Card>
);

const TableLoading = () => <tr><td colSpan={6} className="p-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></td></tr>;
const TableEmpty = () => <tr><td colSpan={6} className="p-20 text-center text-gray-500">Không tìm thấy luồng ký nào.</td></tr>;

const MOCK_DATA: any[] = []; // Chuyển mock data ra ngoài component để tránh khởi tạo lại

export default ApprovalWorkflowListPage;