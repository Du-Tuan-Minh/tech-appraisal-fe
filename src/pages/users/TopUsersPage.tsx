// import { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { toast } from "react-hot-toast";

// import Button from "../../components/ui/Button";
// import Card from "../../components/ui/Card";
// import Input from "../../components/ui/Input";
// import Pagination from "../../components/ui/Pagination";
// import { Layout } from "../../components/layout";

// import { getTopDocumentAuthors, getTopRejectedAuthors } from "../../services/userService";
// import type { DocumentTypeStatisticDto } from "../../types/user";

// const PAGE_SIZE = 10;

// const TopUsersPage = () => {
//     const navigate = useNavigate();
//     const [searchParams, setSearchParams] = useSearchParams();

//     const currentType = searchParams.get("type") === "rejected" ? "rejected" : "authors";
//     const currentPage = Number(searchParams.get("page")) || 1;
//     const urlSearch = searchParams.get("search") || "";

//     const [users, setUsers] = useState<DocumentTypeStatisticDto[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const [searchTerm, setSearchTerm] = useState(urlSearch);

//     const [pagination, setPagination] = useState({
//         page: currentPage,
//         pageSize: PAGE_SIZE,
//         totalCount: 0,
//         totalPages: 0
//     });

//     const abortControllerRef = useRef<AbortController | null>(null);

//     const loadUsers = useCallback(async () => {
//         if (abortControllerRef.current) {
//             abortControllerRef.current.abort();
//         }

//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         setIsLoading(true);

//         try {
//             const fetchApi = currentType === "authors" ? getTopDocumentAuthors : getTopRejectedAuthors;
//             const response = await fetchApi(currentPage, PAGE_SIZE, urlSearch.trim() || undefined);

//             if (!controller.signal.aborted) {
//                 setUsers(response.items || []);
//                 setPagination({
//                     page: response.page,
//                     pageSize: response.pageSize,
//                     totalCount: response.totalCount,
//                     totalPages: response.totalPages
//                 });
//             }
//         } catch (err: any) {
//             if (err.name === "CanceledError" || err.name === "AbortError") return;
//             console.error("[Fetch Top Users Error]:", err);
//             toast.error("Không thể tải danh sách thống kê người dùng.");
//         } finally {
//             if (!controller.signal.aborted) {
//                 setIsLoading(false);
//             }
//         }
//     }, [currentType, currentPage, urlSearch]);

//     useEffect(() => {
//         loadUsers();
//         return () => {
//             if (abortControllerRef.current) abortControllerRef.current.abort();
//         };
//     }, [loadUsers]);

//     useEffect(() => {
//         setSearchTerm(urlSearch);
//     }, [urlSearch]);

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             const cleanSearch = searchTerm.trim();
//             const newParams = new URLSearchParams(searchParams);

//             if (cleanSearch) {
//                 newParams.set("search", cleanSearch);
//             } else {
//                 newParams.delete("search");
//             }
//             newParams.set("page", "1");

//             if (newParams.toString() !== searchParams.toString()) {
//                 setSearchParams(newParams);
//             }
//         }, 300);

//         return () => clearTimeout(handler);
//     }, [searchTerm, searchParams, setSearchParams]);

//     const handleTabChange = (type: "authors" | "rejected") => {
//         setSearchTerm("");

//         const newParams = new URLSearchParams();
//         newParams.set("type", type);
//         newParams.set("page", "1");
//         setSearchParams(newParams);
//     };

//     const handlePageChange = (page: number) => {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.set("page", page.toString());
//         setSearchParams(newParams);
//     };

//     return (
//         <Layout>
//             <div className="max-w-7xl mx-auto p-6 space-y-6">
//                 <div className="flex justify-between items-end">
//                     <div>
//                         <h1 className="text-3xl font-bold text-white tracking-tight">
//                             {currentType === "authors" ? "Top Tác Giả Tài Liệu" : "Top Tác Giả Bị Từ Chối"}
//                         </h1>
//                         <p className="text-primary-400 mt-1">
//                             {currentType === "authors"
//                                 ? "Danh sách nhân viên đóng góp tài liệu hệ thống"
//                                 : "Danh sách nhân viên có nhiều tài liệu bị đánh giá không đạt"}
//                         </p>
//                     </div>
//                     <div className="flex gap-3">
//                         <Button variant="ghost" onClick={() => navigate("/manager/dashboard")}>
//                             Quay lại Dashboard
//                         </Button>
//                         <Button
//                             variant={currentType === "authors" ? "primary" : "ghost"}
//                             onClick={() => handleTabChange("authors")}
//                         >
//                             Top người tạo tài liệu nhiều nhất
//                         </Button>
//                         <Button
//                             variant={currentType === "rejected" ? "primary" : "ghost"}
//                             onClick={() => handleTabChange("rejected")}
//                         >
//                             Top người bị từ chối nhiều nhất
//                         </Button>
//                     </div>
//                 </div>

//                 <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
//                     <Input
//                         label="Tìm kiếm"
//                         placeholder="Nhập tên nhân viên hoặc mã nhân viên để lọc..."
//                         value={searchTerm}
//                         onChange={(val) => setSearchTerm(val)}
//                     />
//                 </Card>

//                 <Card className="overflow-hidden border-dark-700 bg-dark-900/20">
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="bg-dark-800/70 border-b border-dark-700">
//                                     <th className="p-4 text-primary-300 font-semibold text-sm w-24">Xếp hạng</th>
//                                     <th className="p-4 text-primary-300 font-semibold text-sm">Họ Tên</th>
//                                     <th className="p-4 text-primary-300 font-semibold text-sm">Số Lượng</th>
//                                     <th className="p-4 text-center text-primary-300 font-semibold w-24 text-sm">Thao Tác</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-dark-800">
//                                 {isLoading ? (
//                                     <tr>
//                                         <td colSpan={5} className="p-20 text-center">
//                                             <div className="animate-spin inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
//                                         </td>
//                                     </tr>
//                                 ) : users.length > 0 ? (
//                                     users.map((user, index) => {
//                                         const rankPosition = (pagination.page - 1) * pagination.pageSize + index + 1;
//                                         const isTopThree = rankPosition <= 3;

//                                         return (
//                                             <tr
//                                                 key={user.id}
//                                                 className="hover:bg-primary-500/5 transition-colors cursor-pointer"
//                                                 onClick={() => navigate(`/users/${user.id}`)}
//                                             >
//                                                 <td className="p-4">
//                                                     <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isTopThree
//                                                         ? currentType === "authors"
//                                                             ? "bg-primary-500/20 text-primary-400 border border-primary-500/40"
//                                                             : "bg-red-500/20 text-red-400 border border-red-500/40"
//                                                         : "bg-dark-700/50 text-gray-400"
//                                                         }`}>
//                                                         {rankPosition}
//                                                     </div>
//                                                 </td>
//                                                 <td className="p-4">
//                                                     <div className="font-mono text-white text-sm font-medium">{user.fullName}</div>
//                                                     <div className="text-xs text-gray-500">ID: {user.employeeCode}</div>
//                                                 </td>
//                                                 <td className="p-4">
//                                                     <div className={`font-bold text-base ${currentType === "authors" ? "text-primary-400" : "text-red-400"}`}>
//                                                         {user.totalDocuments}
//                                                     </div>
//                                                     <div className="text-xs text-gray-500">
//                                                         {currentType === "authors" ? "tài liệu" : "bị từ chối"}
//                                                     </div>
//                                                 </td>
//                                                 <td className="p-4">
//                                                     <div className="flex justify-center">
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="sm"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 navigate(`/users/${user.id}`);
//                                                             }}
//                                                         >
//                                                             Xem
//                                                         </Button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={5} className="p-20 text-center text-gray-500 text-sm">
//                                             Không có dữ liệu thống kê phù hợp.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </Card>

//                 {!isLoading && pagination.totalPages > 1 && (
//                     <div className="flex justify-center mt-6">
//                         <Pagination
//                             currentPage={pagination.page}
//                             totalPages={pagination.totalPages}
//                             onPageChange={handlePageChange}
//                         />
//                     </div>
//                 )}
//             </div>
//         </Layout>
//     );
// };

// export default TopUsersPage;

function TopUsersPage() {
    return (
        <div>
            <h1>Issued Documents Library</h1>
        </div>
    );
}

export default TopUsersPage;