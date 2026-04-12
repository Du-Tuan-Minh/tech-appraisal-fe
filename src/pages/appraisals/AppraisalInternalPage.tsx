import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "@/components/layout";
import { Button, Card, Input } from "@/components/ui";
import TechnicalSpecsEditor from "@/components/forms/TechnicalSpecsEditor";
import AssignStaffPopUp from "@/components/popups/AssignStaffPopUp";
import { appraisalService } from "@/services/appraisalService";
import { documentService } from "@/services/documentService";
import { ReviewerStatus } from "@/constants/enum/ReviewerStatus";
import type { AppraisalAssignmentDto } from "@/types/assignment";
import type { TechnicalDocumentDetailDto } from "@/types/document";
import type { UserResponseDto } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";

const AppraisalInternalPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [searchParams] = useSearchParams();
    const { isManager } = useAuth();
    const { assignmentId: urlId } = useParams<{ assignmentId: string }>();

    const [assignment, setAssignment] = useState<AppraisalAssignmentDto | null>(null);
    const [document, setDocument] = useState<TechnicalDocumentDetailDto | null>(null);
    const [departmentUsers, setDepartmentUsers] = useState<UserResponseDto[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssignPopUpOpen, setIsAssignPopUpOpen] = useState(false);

    const [comment, setComment] = useState("");
    const [technicalSpecs, setTechnicalSpecs] = useState("{}");
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

    const fetchData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [assignmentData, documentData] = await Promise.all([
                appraisalService.getAssignmentById(id),
                appraisalService.getAssignmentById(id).then(res => documentService.getDocumentById(res.documentId))
            ]);

            setAssignment(assignmentData);
            setDocument(documentData);

            if (documentData.currentVersion?.technicalSpecsJson) {
                setTechnicalSpecs(documentData.currentVersion.technicalSpecsJson);
            }


            const users = await appraisalService.getDepartmentUsers(assignmentData.departmentId);
            setDepartmentUsers(users);

        } catch (err: any) {
            toast.error("Lỗi tải dữ liệu thẩm định kỹ thuật.");
            navigate("/appraisals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleAction = async (action: () => Promise<void>, successMsg: string, targetPath?: string) => {
        setIsSubmitting(true);
        try {
            await action();
            toast.success(successMsg);
            if (targetPath) {
                navigate(targetPath);
            } else {
                navigate("/appraisals/my-tasks");
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Thao tác thất bại.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Layout><LoadingSkeleton /></Layout>;
    if (!assignment || !document) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
                <header className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white italic tracking-tight uppercase">
                            Quyết định Thẩm định && Phân công Nội bộ
                        </h1>
                        <p className="text-primary-400 mt-1 italic text-sm">
                            Hồ sơ: <span className="text-white font-bold">{document.title}</span> — v{assignment.versionNumber}
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="border-dark-700">← Quay lại</Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="p-6 border-t-2 border-primary-500 bg-dark-900/40 shadow-2xl">
                            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                                Cấu hình Thông số Thẩm định
                            </h2>
                            <TechnicalSpecsEditor value={technicalSpecs} onChange={setTechnicalSpecs} />
                        </Card>

                        <Card className="p-6 bg-dark-900/40 border-dark-800">
                            <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Ghi chú & Nhận xét chuyên môn</h2>
                            <textarea
                                className="w-full bg-dark-800 border border-dark-700 rounded-lg p-4 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none min-h-[200px] transition-all placeholder:text-gray-600 font-sans"
                                placeholder="Ghi chú hướng dẫn cho các thẩm định viên..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Card>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <Card className="p-5 bg-primary-950/10 border-primary-900/20 sticky top-6">
                            <h3 className="text-[10px] font-bold text-primary-400 uppercase mb-4 tracking-tighter">Trạng thái & Thao tác</h3>
                            <div className="space-y-3 text-xs mb-8">
                                <div className="flex justify-between border-b border-dark-800 pb-2">
                                    <span className="text-gray-500">Mã định danh:</span>
                                    <span className="text-white font-mono">{assignment.documentCode}</span>
                                </div>
                                <div className="flex justify-between border-b border-dark-800 pb-2">
                                    <span className="text-gray-500">Hạn chót:</span>
                                    <span className={assignment.deadline ? "text-red-400 font-bold" : "text-gray-300"}>
                                        {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString("vi-VN") : 'Chưa thiết lập'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tạo bởi:</span>
                                    <span className="text-white">{assignment.assignedByName}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {
                                    <>
                                        <Button
                                            className="w-full shadow-lg shadow-primary-500/20"
                                            onClick={() => handleAction(
                                                () => appraisalService.confirmDepartment({
                                                    documentId: document.id,
                                                    requestVersionId: assignment.requestVersionId,
                                                    isApproved: true,
                                                    technicalSpecsJson: technicalSpecs,
                                                    comment
                                                }),
                                                "Duyệt nội bộ thành công!",
                                                `/appraisals/assignment/create?documentId=${document.id}`
                                            )}
                                            isLoading={isSubmitting}
                                        >Xác nhận duyệt</Button>

                                        <Button
                                            variant="outline"
                                            className="w-full text-red-400 border-red-900/50 hover:bg-red-500/10"
                                            onClick={() => handleAction(
                                                () => appraisalService.confirmDepartment({
                                                    documentId: document.id,
                                                    requestVersionId: assignment.requestVersionId,
                                                    isApproved: false,
                                                    comment
                                                }),
                                                "Đã từ chối thẩm định hồ sơ",
                                                "/documents"
                                            )}
                                        >Từ chối & Trả về</Button>
                                    </>
                                }

                                {
                                    <Button
                                        className="w-full"
                                        onClick={() => setIsAssignPopUpOpen(true)}
                                        isLoading={isSubmitting}
                                    >
                                        {selectedStaffIds.length > 0 ? `Thay đổi (${selectedStaffIds.length})` : 'Chọn Thẩm định viên'}
                                    </Button>
                                }

                                {
                                    <>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleAction(
                                                () => appraisalService.submitReview(assignment.id, { status: ReviewerStatus.Accepted, comment, issues: null, attachmentIds: null }),
                                                "Đã gửi đánh giá Chấp thuận"
                                            )}
                                            isLoading={isSubmitting}
                                        >Duyệt (Accepted)</Button>

                                        <Button
                                            variant="outline"
                                            className="w-full border-yellow-700/50 text-yellow-500"
                                            onClick={() => handleAction(
                                                () => appraisalService.submitReview(assignment.id, { status: ReviewerStatus.Submitted, comment, issues: null, attachmentIds: null }),
                                                "Đã yêu cầu chỉnh sửa"
                                            )}
                                        >Yêu cầu Chỉnh sửa</Button>
                                    </>
                                }
                            </div>
                        </Card>

                        <Card className="p-5 border-dark-800 bg-dark-900/20">
                            <h3 className="text-xs font-bold text-white uppercase mb-4 tracking-widest">Tiến độ nhân sự ({assignment.reviewers.length})</h3>
                            <div className="space-y-4">
                                {assignment.reviewers.length === 0 ? (
                                    <p className="text-[11px] text-gray-500 italic">Chưa có thẩm định viên nào được giao.</p>
                                ) : (
                                    assignment.reviewers.map(r => (
                                        <div key={r.id} className="flex items-center justify-between group">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-300 group-hover:text-primary-400 transition-colors font-medium">{r.staffName}</span>
                                                <span className="text-[10px] text-gray-600">{r.status}</span>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${r.status === ReviewerStatus.Accepted ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {r.status === ReviewerStatus.Accepted ? 'Xong' : 'Đang đánh giá'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </aside>
                </div>
            </div>

            <AssignStaffPopUp
                isOpen={isAssignPopUpOpen}
                onClose={() => setIsAssignPopUpOpen(false)}
                users={departmentUsers}
                selectedIds={selectedStaffIds}
                onConfirm={(ids) => {
                    setSelectedStaffIds(ids);
                    handleAction(
                        () => appraisalService.assignStaff({ assignmentId: assignment.id, staffIds: ids, managerNote: comment }),
                        "Phân công thành công!"
                    );
                }}
                isLoading={isSubmitting}
            />
        </Layout>
    );
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="h-12 bg-dark-800 rounded w-1/2 animate-pulse" />
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
                <div className="h-64 bg-dark-800 rounded animate-pulse" />
                <div className="h-48 bg-dark-800 rounded animate-pulse" />
            </div>
            <div className="col-span-4 h-96 bg-dark-800 rounded animate-pulse" />
        </div>
    </div>
);

export default AppraisalInternalPage;