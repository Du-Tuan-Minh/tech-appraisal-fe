// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Layout } from "@/components/layout";
// import { Button, Card } from "@/components/ui";
// import { toast } from "react-hot-toast";
// import { documentService } from "@/services/documentService";
// import type { TechnicalDocumentDetailDto } from "@/types/document";
// import type { DocumentVersionDto } from "@/types/version";

// const DocumentVersionsPage = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     // States
//     const [doc, setDoc] = useState<TechnicalDocumentDetailDto | null>(null);
//     const [versions, setVersions] = useState<DocumentVersionDto[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const loadData = useCallback(async () => {
//         if (!id) return;
//         setIsLoading(true);
//         try {
//             const [docDetail, versionList] = await Promise.all([
//                 documentService.getDocumentById(id),
//                 documentService.getDocumentVersions(id)
//             ]);
//             setDoc(docDetail);
//             // Sắp xếp phiên bản mới nhất lên đầu
//             setVersions(versionList.sort((a, b) => b.versionNumber - a.versionNumber));
//         } catch (err) {
//             toast.error("Lỗi tải thông tin phiên bản.");
//         } finally {
//             setIsLoading(false);
//         }
//     }, [id]);

//     useEffect(() => { loadData(); }, [loadData]);

//     // Thống kê phiên bản
//     const stats = useMemo(() => {
//         if (!versions.length) return { current: "N/A", lastUpdate: "N/A" };
//         const currentV = versions.find(v => v.isCurrent)?.versionNumber || "N/A";
//         const latestDate = versions[0]?.createdAt;
//         return { 
//             current: currentV, 
//             lastUpdate: latestDate ? new Date(latestDate).toLocaleDateString("vi-VN") : "N/A" 
//         };
//     }, [versions]);

//     const handleRestore = async (vId: string, vNum: number) => {
//         if (!id || !window.confirm(`Xác nhận khôi phục về phiên bản v${vNum}?`)) return;

//         setIsSubmitting(true);
//         try {
//             // Giả định service có hàm restore, nếu chưa có bạn hãy cập nhật documentService
//             await documentService.restoreVersion?.(id, vId);
//             toast.success(`Đã khôi phục về phiên bản v${vNum}`);
//             loadData();
//         } catch (err) {
//             toast.error("Khôi phục phiên bản thất bại.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) return <Layout><LoadingState /></Layout>;
//     if (!doc) return <Layout><EmptyState navigate={navigate} /></Layout>;

//     return (
//         <Layout>
//             <div className="max-w-7xl mx-auto p-6 space-y-8">
//                 <header className="flex justify-between items-end">
//                     <div>
//                         <h1 className="text-3xl font-bold text-white tracking-tight italic">Lịch Sử Phiên Bản</h1>
//                         <p className="text-primary-400 mt-1 text-sm italic">
//                             {doc.title} • <span className="text-white font-medium">{versions.length} bản ghi hiệu chỉnh</span>
//                         </p>
//                     </div>
//                     <Button variant="ghost" onClick={() => navigate(-1)}>← Quay lại</Button>
//                 </header>

//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     {/* DANH SÁCH PHIÊN BẢN */}
//                     <div className="lg:col-span-3 space-y-4 relative">
//                         {/* Đường kẻ trục thời gian (Visual Timeline) */}
//                         <div className="absolute left-[26px] top-4 bottom-4 w-0.5 bg-dark-700 hidden md:block"></div>

//                         {versions.map((v, index) => (
//                             <VersionItem
//                                 key={v.id}
//                                 version={v}
//                                 onRestore={handleRestore}
//                                 isSubmitting={isSubmitting}
//                                 // So sánh với phiên bản liền kề dưới nó trong mảng đã sort
//                                 prevVersionId={versions[index + 1]?.id}
//                                 onCompare={(v1, v2) => navigate(`/documents/${id}/compare?v1=${v1}&v2=${v2}`)}
//                             />
//                         ))}
//                     </div>

//                     {/* PANEL THÔNG TIN PHỤ */}
//                     <aside className="space-y-6">
//                         <Card className="p-5 space-y-4 bg-dark-900/50 border-dark-700 shadow-xl">
//                             <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest">Tổng quan mã hiệu</h3>
//                             <div className="space-y-3">
//                                 <StatRow label="Phiên bản hiện tại" value={`v${stats.current}`} isHighlight />
//                                 <StatRow label="Lần cuối hiệu chỉnh" value={stats.lastUpdate} />
//                                 <StatRow label="Tổng số bản ghi" value={versions.length.toString()} />
//                             </div>
//                             <hr className="border-dark-700" />
//                             <Button 
//                                 variant="primary" 
//                                 className="w-full shadow-lg shadow-primary-500/10" 
//                                 onClick={() => navigate(`/documents/${id}/editor`)}
//                             >
//                                 ✍️ Soạn thảo bản mới
//                             </Button>
//                         </Card>

//                         <Card className="p-5 bg-primary-950/10 border-primary-900/20">
//                             <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-tighter">Xuất bản hồ sơ</h3>
//                             <div className="grid grid-cols-2 gap-2">
//                                 <Button variant="ghost" size="sm" className="text-[10px] border border-dark-700">XUẤT PDF</Button>
//                                 <Button variant="ghost" size="sm" className="text-[10px] border border-dark-700">XUẤT WORD</Button>
//                             </div>
//                         </Card>
//                     </aside>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// const VersionItem = ({ version: v, onRestore, isSubmitting, prevVersionId, onCompare }: {
//     version: DocumentVersionDto;
//     onRestore: (id: string, num: number) => void;
//     isSubmitting: boolean;
//     prevVersionId?: string;
//     onCompare: (v1: string, v2: string) => void;
// }) => (
//     <Card className={`p-5 ml-0 md:ml-10 relative transition-all border-none ${v.isCurrent ? 'bg-primary-900/20 ring-1 ring-primary-500/50 shadow-lg' : 'bg-dark-800/40 hover:bg-dark-800'}`}>
//         {/* Dot timeline */}
//         <div className={`absolute -left-[19px] top-7 w-3 h-3 rounded-full border-2 border-dark-950 hidden md:block z-10 ${v.isCurrent ? 'bg-primary-500 animate-pulse' : 'bg-dark-600'}`}></div>

//         <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//             <div className="space-y-2">
//                 <div className="flex items-center gap-3">
//                     <span className="text-xl font-black text-white tracking-tighter">v{v.versionNumber}</span>
//                     {v.isCurrent && (
//                         <span className="px-2 py-0.5 text-[9px] bg-primary-500 text-white rounded font-bold uppercase tracking-widest">
//                             Đang hoạt động
//                         </span>
//                     )}
//                 </div>
//                 <div className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">
//                     Ngày tạo: <span className="text-gray-300 font-mono">{new Date(v.createdAt).toLocaleString("vi-VN")}</span>
//                 </div>
//                 {v.changeReason ? (
//                     <p className="text-gray-300 text-sm italic leading-relaxed bg-dark-900/50 p-2 rounded border-l-2 border-primary-500">
//                         "{v.changeReason}"
//                     </p>
//                 ) : (
//                     <p className="text-gray-500 text-xs italic italic">Không có mô tả thay đổi.</p>
//                 )}
//             </div>

//             <div className="flex gap-2 w-full md:w-auto">
//                 {prevVersionId && (
//                     <Button variant="ghost" size="sm" className="flex-1 md:flex-none text-[11px]" onClick={() => onCompare(v.id, prevVersionId)}>
//                         ⚖️ So sánh
//                     </Button>
//                 )}
//                 {!v.isCurrent && (
//                     <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="flex-1 md:flex-none text-[11px] border-dark-600 text-gray-400" 
//                         disabled={isSubmitting} 
//                         onClick={() => onRestore(v.id, v.versionNumber)}
//                     >
//                         🔄 Khôi phục
//                     </Button>
//                 )}
//             </div>
//         </div>
//     </Card>
// );

// const StatRow = ({ label, value, isHighlight }: { label: string; value: string; isHighlight?: boolean }) => (
//     <div className="flex justify-between items-center text-[11px]">
//         <span className="text-gray-500 font-medium uppercase">{label}:</span>
//         <span className={isHighlight ? "text-primary-400 font-black text-sm" : "text-gray-200 font-mono"}>{value}</span>
//     </div>
// );

// const LoadingState = () => (
//     <div className="flex flex-col items-center justify-center h-96 space-y-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
//         <p className="text-primary-400 text-xs font-bold uppercase animate-pulse">Đang nạp lịch sử phiên bản...</p>
//     </div>
// );

// const EmptyState = ({ navigate }: any) => (
//     <div className="text-center p-20 bg-dark-900/30 rounded-3xl border border-dashed border-dark-700">
//         <p className="text-gray-500 text-lg italic">Không tìm thấy dữ liệu tài liệu này.</p>
//         <Button variant="primary" className="mt-6 px-8" onClick={() => navigate("/documents")}>Quay về danh sách</Button>
//     </div>
// );

// export default DocumentVersionsPage;

function DocumentVersionsPage() {
    return (
        <div>
            <h1>Document Versions</h1>
        </div>
    );
}

export default DocumentVersionsPage;