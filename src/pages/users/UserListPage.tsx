import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, RotateCcw, UserCheck, UserX, Eye } from "lucide-react";
import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { getUsers, updateAccountStatus } from "../../services/userService";
import { UserRole, USER_ROLE_LABELS } from "../../constants/enum/UserRole";
import type { UserResponseDto } from "@/types/user";
import UpdateAccountStatusPopUp from "../../components/popups/UpdateAccountStatusPopUp";

const UserListPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalData, setTotalData] = useState({ totalPages: 0, totalItems: 0 });
    const [searchQuery, setSearchQuery] = useState("");

    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: "",
        role: undefined as UserRole | undefined,
        isActive: undefined as boolean | undefined,
        fromDate: "",
        toDate: ""
    });

    const [statusPopup, setStatusPopup] = useState({
        isOpen: false,
        user: null as UserResponseDto | null
    });

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getUsers(filters);
            setUsers(res.items || []);
            setTotalData({
                totalPages: res.totalPages || 0,
                totalItems: res.totalItems || 0
            });
        } catch (err) {
            toast.error("Không thể tải danh sách nhân sự.");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters(prev => ({ ...prev, searchTerm: searchQuery, page: 1 }));
        }, 600);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const handleUpdateStatus = async (data: { isActive: boolean; reason?: string }) => {
        if (!statusPopup.user) return;
        try {
            await updateAccountStatus(statusPopup.user.id, data);
            toast.success("Cập nhật trạng thái thành công!");
            setStatusPopup({ isOpen: false, user: null });
            loadData();
        } catch (err) {
            toast.error("Thao tác thất bại.");
        }
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({
            page: 1,
            pageSize: 10,
            searchTerm: "",
            role: undefined,
            isActive: undefined,
            fromDate: "",
            toDate: ""
        });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fadeIn">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Quản Lý Nhân Sự</h1>
                        <p className="text-primary-400 font-medium">Hệ thống thẩm định và phân quyền tài khoản</p>
                    </div>
                </header>

                <Card className="p-6 border-primary-500/10 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="relative">
                            <Input
                                label="Tìm kiếm nhanh"
                                placeholder="Tên, mã nhân viên..."
                                value={searchQuery}
                                onChange={(v) => setSearchQuery(v)}
                            />
                            <Search className="absolute right-3 top-10 w-4 h-4 text-gray-500" />
                        </div>

                        <Select
                            label="Vai trò hệ thống"
                            value={filters.role?.toString() || ""}
                            options={[
                                { value: "", label: "Tất cả vai trò" },
                                ...Object.entries(USER_ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))
                            ]}
                            onChange={(v) => setFilters(p => ({ ...p, role: v ? (Number(v) as UserRole) : undefined, page: 1 }))}
                        />

                        <Select
                            label="Trạng thái tài khoản"
                            value={filters.isActive?.toString() || ""}
                            options={[
                                { value: "", label: "Tất cả trạng thái" },
                                { value: "true", label: "Đang hoạt động" },
                                { value: "false", label: "Đã bị khóa" }
                            ]}
                            onChange={(v) => setFilters(p => ({ ...p, isActive: v === "" ? undefined : v === "true", page: 1 }))}
                        />

                        <Input
                            label="Ngày tham gia từ"
                            type="date"
                            value={filters.fromDate}
                            onChange={(v) => setFilters(p => ({ ...p, fromDate: v, page: 1 }))}
                        />

                        <Input
                            label="Đến ngày"
                            type="date"
                            value={filters.toDate}
                            onChange={(v) => setFilters(p => ({ ...p, toDate: v, page: 1 }))}
                        />

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="w-full border-dark-700 hover:bg-dark-800 text-gray-400"
                                onClick={resetFilters}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Làm mới bộ lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden border-dark-800 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-dark-800/80 text-primary-400 text-xs uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="p-4 border-b border-dark-700">Thông tin nhân sự</th>
                                    <th className="p-4 border-b border-dark-700">Vai trò</th>
                                    <th className="p-4 border-b border-dark-700 text-center">Trạng thái</th>
                                    <th className="p-4 border-b border-dark-700">Ngày tạo</th>
                                    <th className="p-4 border-b border-dark-700 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800 bg-dark-900/20">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-primary-400 animate-pulse font-medium">Đang truy xuất dữ liệu...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-gray-500 italic bg-dark-900/50">
                                            Không có dữ liệu nhân sự phù hợp với điều kiện lọc.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-primary-500/5 transition-all group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-primary-400 font-bold border border-dark-600 group-hover:border-primary-500/50 transition-colors">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">{user.firstName} {user.lastName}</div>
                                                        <div className="text-xs text-gray-500">{user.employeeCode}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-md bg-dark-800 text-xs font-semibold text-gray-300 border border-dark-700">
                                                    {USER_ROLE_LABELS[user.role]}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${user.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.isActive ? "bg-green-400" : "bg-red-400"}`}></span>
                                                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400 font-mono">
                                                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="hover:bg-primary-500/10 hover:text-primary-400"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => setStatusPopup({ isOpen: true, user })}
                                                        className={user.isActive ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-green-500/10 hover:text-green-400"}
                                                    >
                                                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-dark-900/20 p-4 rounded-xl border border-dark-800">
                    <Pagination
                        currentPage={filters.page}
                        totalPages={totalData.totalPages}
                        onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
                    />
                </div>
            </div>

            <UpdateAccountStatusPopUp
                isOpen={statusPopup.isOpen}
                onClose={() => setStatusPopup({ isOpen: false, user: null })}
                onSubmit={handleUpdateStatus}
                currentStatus={statusPopup.user?.isActive ?? true}
                userName={`${statusPopup.user?.firstName} ${statusPopup.user?.lastName}`}
                isLoading={isLoading}
            />
        </Layout>
    );
};

export default UserListPage;