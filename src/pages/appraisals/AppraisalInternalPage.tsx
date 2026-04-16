import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Layout } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import TechnicalSpecsEditor from "@/components/forms/TechnicalSpecsEditor";
import AssignStaffPopUp from "@/components/popups/AssignStaffPopUp";
import { appraisalService } from "@/services/appraisalService";
import { documentService } from "@/services/documentService";
import { ReviewerStatus } from "@/constants/enum/ReviewerStatus";
import { useAuth } from "@/hooks/useAuth";

// --- Types ---
import type { AppraisalAssignmentDetailDto } from "@/types/assignment";
import type { TechnicalDocumentDetailDto } from "@/types/document";
import type { UserResponseDto } from "@/types/user";

const AppraisalInternalPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isManager } = useAuth();

    // Data State
    const [data, setData] = useState<{
        assignment: AppraisalAssignmentDetailDto;
        document: TechnicalDocumentDetailDto;
        users: UserResponseDto[];
    } | null>(null);

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssignPopUpOpen, setIsAssignPopUpOpen] = useState(false);

    // Form State
    const [comment, setComment] = useState("");
    const [technicalSpecs, setTechnicalSpecs] = useState("{}");

    // --- Logic Fetch Data ---
    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const assignmentData = await appraisalService.getAssignmentById(id);
            const [documentData, userData] = await Promise.all([
                documentService.getDocumentById(assignmentData.documentId),
                appraisalService.getDepartmentUsers(assignmentData.departmentId)
            ]);

            setData({ assignment: assignmentData, document: documentData, users: userData });
            if (documentData.currentVersion?.technicalSpecsJson) {
                setTechnicalSpecs(documentData.currentVersion.technicalSpecsJson);
            }
        } catch (err) {
            toast.error("Không thể tải dữ liệu thẩm định");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- Action Handler ---
    const handleAction = async (action: () => Promise<any>, msg: string, path?: string) => {
        setIsSubmitting(true);
        try {
            await action();
            toast.success(msg);
            navigate(path || "/appraisals/my-tasks");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Thao tác thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Layout><LoadingSkeleton /></Layout>;
    if (!data) return null;

    const { assignment, document, users } = data;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn text-sm">
                {/* Header Section */}
                <header className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                            Quyết định Thẩm định & Phân công
                        </h1>
                        <p className="text-primary-400 mt-1 italic">
                            Hồ sơ: <span className="text-white font-semibold">{document.title}</span> — v{assignment.versionNumber}
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="border-dark-700">← Quay lại</Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Editor & Comments */}
                    <div className="lg:col-span-8 space-y-6">
                        <ContentSection title="Cấu hình Thông số Thẩm định" pulse>
                            <TechnicalSpecsEditor value={technicalSpecs} onChange={setTechnicalSpecs} />
                        </ContentSection>

                        <ContentSection title="Ghi chú & Nhận xét chuyên môn">
                            <textarea
                                className="w-full bg-dark-800 border border-dark-700 rounded-lg p-4 text-white min-h-[180px] focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-600"
                                placeholder="Nhập hướng dẫn hoặc lý do từ chối..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </ContentSection>
                    </div>

                    {/* Right: Actions & Progress */}
                    <aside className="lg:col-span-4 space-y-6">
                        <Card className="p-5 bg-primary-950/10 border-primary-900/20 sticky top-6 space-y-6">
                            <div>
                                <h3 className="text-[10px] font-bold text-primary-400 uppercase mb-3 tracking-widest">Thông tin chung</h3>
                                <InfoRow label="Mã hồ sơ" value={assignment.documentCode} mono />
                                <InfoRow
                                    label="Hạn chót"
                                    value={assignment.deadline ? new Date(assignment.deadline).toLocaleDateString("vi-VN") : "Chưa có"}
                                    highlight={!!assignment.deadline}
                                />
                            </div>

                            <div className="space-y-3">
                                {isManager && (
                                    <>
                                        <Button
                                            className="w-full bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-900/20"
                                            isLoading={isSubmitting}
                                            onClick={() => handleAction(
                                                () => appraisalService.confirmDepartment({
                                                    documentId: document.id,
                                                    requestVersionId: assignment.requestVersionId,
                                                    isApproved: true,
                                                    technicalSpecsJson: technicalSpecs,
                                                    comment
                                                }),
                                                "Duyệt nội bộ thành công",
                                                `/appraisals/assignment/create?documentId=${document.id}`
                                            )}
                                        >Xác nhận Duyệt</Button>

                                        <Button
                                            variant="outline"
                                            className="w-full text-red-400 border-red-900/30 hover:bg-red-500/10"
                                            isLoading={isSubmitting}
                                            onClick={() => handleAction(
                                                () => appraisalService.confirmDepartment({
                                                    documentId: document.id,
                                                    requestVersionId: assignment.requestVersionId,
                                                    isApproved: false,
                                                    comment
                                                }),
                                                "Đã từ chối hồ sơ",
                                                "/documents"
                                            )}
                                        >Từ chối & Trả về</Button>

                                        <div className="h-px bg-dark-800 my-2" />

                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => setIsAssignPopUpOpen(true)}
                                        >
                                            {assignment.reviewers.length > 0 ? `Thay đổi nhân sự (${assignment.reviewers.length})` : "Chọn Thẩm định viên"}
                                        </Button>
                                    </>
                                )}

                                {!isManager && (
                                    <Button
                                        className="w-full"
                                        isLoading={isSubmitting}
                                        onClick={() => handleAction(
                                            () => appraisalService.submitReview(assignment.id, { status: ReviewerStatus.Accepted, comment, issues: null, attachmentIds: null }),
                                            "Đã gửi đánh giá"
                                        )}
                                    >Gửi đánh giá Accepted</Button>
                                )}
                            </div>
                        </Card>

                        <ReviewerStatusList reviewers={assignment.reviewers} />
                    </aside>
                </div>
            </div>

            <AssignStaffPopUp
                isOpen={isAssignPopUpOpen}
                onClose={() => setIsAssignPopUpOpen(false)}
                users={users}
                selectedIds={assignment.reviewers.map(r => r.staffId)}
                onConfirm={(ids) => handleAction(
                    () => appraisalService.assignStaff({ assignmentId: assignment.id, staffIds: ids, managerNote: comment }),
                    "Phân công thành công"
                )}
                isLoading={isSubmitting}
            />
        </Layout>
    );
};

// --- Internal Sub-components (Re-usable within this context) ---

const ContentSection = ({ title, children, pulse }: { title: string; children: React.ReactNode; pulse?: boolean }) => (
    <Card className="p-6 border-t-2 border-primary-500 bg-dark-900/40 shadow-xl">
        <h2 className="text-xs font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
            {pulse && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />}
            {title}
        </h2>
        {children}
    </Card>
);

const InfoRow = ({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) => (
    <div className="flex justify-between py-2 border-b border-dark-800/50 last:border-0 text-[11px]">
        <span className="text-gray-500">{label}:</span>
        <span className={`${mono ? 'font-mono' : ''} ${highlight ? 'text-red-400 font-bold' : 'text-gray-200'}`}>{value}</span>
    </div>
);

const ReviewerStatusList = ({ reviewers }: { reviewers: any[] }) => (
    <Card className="p-5 border-dark-800 bg-dark-900/20">
        <h3 className="text-[10px] font-bold text-white uppercase mb-4 tracking-widest">Tiến độ nhân sự</h3>
        <div className="space-y-3">
            {reviewers.length === 0 ? (
                <p className="text-[10px] text-gray-500 italic text-center">Chưa phân công</p>
            ) : (
                reviewers.map(r => (
                    <div key={r.id} className="flex justify-between items-center group">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-300 group-hover:text-primary-400 transition-colors font-medium">{r.staffName}</span>
                            <span className="text-[9px] text-gray-600 uppercase italic">{r.status}</span>
                        </div>
                        <div className={`h-1.5 w-1.5 rounded-full ${r.status === ReviewerStatus.Pending ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`} />
                    </div>
                ))
            )}
        </div>
    </Card>
);

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse">
        <div className="h-10 bg-dark-800 rounded w-1/3" />
        <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
                <div className="h-64 bg-dark-800 rounded" />
                <div className="h-40 bg-dark-800 rounded" />
            </div>
            <div className="col-span-4 h-80 bg-dark-800 rounded" />
        </div>
    </div>
);

export default AppraisalInternalPage;