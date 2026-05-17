import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Layout } from "../../components/layout";

import { approvalWorkflowService } from "../../services/approvalWorkflowService";
import type { ApprovalWorkflowDetailDto } from "../../types/approvalWorkflow";

import { USER_ROLE_MAP } from "@/constants/enum/UserRole";
import { ASSIGNMENT_STATUS_MAP, AssignmentStatus } from "@/constants/enum/AssignmentStatus";

import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/date";

const ApprovalWorkflowDetailPage = () => {
    const navigate = useNavigate();
    const { workflowId } = useParams<{ workflowId: string }>();
    const { role, isManager } = useAuth();

    const [workflow, setWorkflow] = useState<ApprovalWorkflowDetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [note, setNote] = useState("");

    useEffect(() => {
        const fetchWorkflow = async () => {
            if (!workflowId) return;
            try {
                const data = await approvalWorkflowService.getWorkflowDetail(workflowId);
                setWorkflow(data);
            } catch (err) {
                toast.error("Không thể tải thông tin luồng ký.");
                navigate("/approval-workflows");
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkflow();
    }, [workflowId, navigate]);

    const workflowMeta = useMemo(() => {
        if (!workflow) return null;
        return {
            roleInfo: USER_ROLE_MAP[workflow.requiredRole],
            statusInfo: ASSIGNMENT_STATUS_MAP[workflow.status],
            canAction: workflow.isCurrentStep &&
                workflow.status === AssignmentStatus.Pending &&
                role === workflow.requiredRole
        };
    }, [workflow, role]);

    const handleAction = async (isApproved: boolean) => {
        if (!workflowId || isProcessing) return;

        setIsProcessing(true);
        try {
            setWorkflow(prev => prev ? {
                ...prev,
                status: isApproved ? AssignmentStatus.Completed : AssignmentStatus.AwaitingClarification,
                signedAt: new Date().toISOString(),
                note
            } : null);

            toast.success(isApproved ? "Phê duyệt thành công!" : "Đã từ chối.");
        } catch (err) {
            toast.error("Thao tác thất bại.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20 animate-pulse text-white">Đang tải...</div>;
    if (!workflow || !workflowMeta) return <div className="text-center p-20 text-white">Không tìm thấy dữ liệu.</div>;

    const { roleInfo, statusInfo, canAction } = workflowMeta;

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <Header
                    stepOrder={workflow.stepOrder}
                    roleLabel={roleInfo.label}
                    onBack={() => navigate(-1)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 bg-dark-900/50">
                            <h2 className="text-xl font-semibold text-white mb-4">Thông Tin Chi Tiết</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem label="Vai trò yêu cầu" value={roleInfo.label} badgeStyle={roleInfo.color} />
                                <InfoItem label="Trạng thái" value={statusInfo.label} badgeStyle={statusInfo.color} />
                                <InfoItem label="Người duyệt" value={workflow.approverName || "Chưa phân công"} subValue={`ID: ${workflow.approverId || "N/A"}`} />
                                <InfoItem label="Hạn chót" value={formatDate(workflow.deadline)} />
                            </div>

                            <div className="mt-6 space-y-4">
                                <CodeSnippet label="ID Tài liệu" code={workflow.documentId} />
                                {workflow.note && (
                                    <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                                        <span className="text-xs text-primary-400 block mb-1">Ghi chú trước đó:</span>
                                        <p className="text-gray-300 italic">"{workflow.note}"</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {canAction && (
                            <ApprovalForm
                                note={note}
                                onNoteChange={setNote}
                                onAction={handleAction}
                                isProcessing={isProcessing}
                            />
                        )}
                    </div>

                    <div className="space-y-6">
                        <SidebarStatus workflow={workflow} meta={workflowMeta} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const InfoItem = ({ label, value, subValue, badgeStyle }: any) => (
    <div>
        <span className="text-sm text-primary-400 block mb-1">{label}</span>
        {badgeStyle ? (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle}`}>{value}</span>
        ) : (
            <p className="text-white font-medium">{value}</p>
        )}
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
);

const CodeSnippet = ({ label, code }: { label: string, code: string }) => (
    <div>
        <span className="text-sm text-primary-400 block mb-1">{label}</span>
        <div className="bg-dark-800 p-2 rounded font-mono text-xs text-gray-400 border border-dark-700 select-all">
            {code}
        </div>
    </div>
);

const Header = ({ stepOrder, roleLabel, onBack }: any) => (
    <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white">Chi Tiết Luồng Ký</h1>
            <p className="text-primary-400">Bước {stepOrder} — {roleLabel}</p>
        </div>
        <Button variant="ghost" onClick={onBack}>
            Quay lại
        </Button>
    </div>
);

const ApprovalForm = ({ note, onNoteChange, onAction, isProcessing }: any) => (
    <Card className="p-6 border-primary-500/30 bg-primary-900/5">
        <h2 className="text-lg font-semibold text-white mb-4">Xử lý phê duyệt</h2>
        <textarea
            className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg text-white mb-4 focus:ring-1 focus:ring-primary-500 outline-none"
            rows={3}
            placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
        />
        <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onAction(true)} disabled={isProcessing}>
                {isProcessing ? "Đang xử lý..." : "Chấp thuận"}
            </Button>
            <Button variant="ghost" className="flex-1 text-red-400 border-red-500/20" onClick={() => onAction(false)} disabled={isProcessing}>
                Từ chối / Yêu cầu giải trình
            </Button>
        </div>
    </Card>
);

const SidebarStatus = ({ workflow, meta }: any) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-4">
            <Card className="p-4 bg-dark-900/50">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Liên kết</h3>
                <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate(`/documents/${workflow.documentId}`)}>
                        📄 Xem tài liệu gốc
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate(`/history/${workflow.documentId}`)}>
                        🕒 Lịch sử phiên bản
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ApprovalWorkflowDetailPage;