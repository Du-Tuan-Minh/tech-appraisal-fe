import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, RotateCcw, Eye, FileText } from "lucide-react";

import { Layout } from "../../components/layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";

import { getDepartmentAppraisalWorkloads } from "../../services/userService";
import { USER_ROLE_MAP } from "../../constants/enum/UserRole";
import type { UserAppraisalAssigneeDto } from "@/types/user";

const DepartmentAppraisalWorkloadsPage = () => {
    const navigate = useNavigate();
    const [workloads, setWorkloads] = useState<UserAppraisalAssigneeDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalData, setTotalData] = useState({ totalPages: 0, totalItems: 0 });
    const [searchQuery, setSearchQuery] = useState("");

    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: ""
    });

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getDepartmentAppraisalWorkloads(
                filters.page,
                filters.pageSize,
                filters.searchTerm
            );
            setWorkloads(res.items || []);
            setTotalData({
                totalPages: res.totalPages || 0,
                totalItems: res.totalCount || 0
            });
        } catch (err) {
            toast.error("Không thể tải danh sách khối lượng công việc thẩm định.");
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

    const resetFilters = () => {
        setSearchQuery("");
        setFilters({
            page: 1,
            pageSize: 10,
            searchTerm: ""
        });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fadeIn">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Khối Lượng Thẩm Định</h1>
                        <p className="text-primary-400 font-medium">Giám sát khối lượng công việc hồ sơ của nhân sự thuộc phòng ban</p>
                    </div>
                </header>

                <Card className="p-6 border-primary-500/10 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="relative md:col-span-2">
                            <Input
                                label="Tìm kiếm nhân sự / phòng ban"
                                placeholder="Nhập tên nhân viên, mã nhân viên hoặc phòng ban..."
                                value={searchQuery}
                                onChange={(v) => setSearchQuery(v)}
                            />
                            <Search className="absolute right-3 top-10 w-4 h-4 text-gray-500" />
                        </div>

                        <div>
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
                                    <th className="p-4 border-b border-dark-700">Nhân sự thẩm định</th>
                                    <th className="p-4 border-b border-dark-700">Phòng ban</th>
                                    <th className="p-4 border-b border-dark-700">Vai trò</th>
                                    <th className="p-4 border-b border-dark-700 text-center">Tổng hồ sơ giao</th>
                                    <th className="p-4 border-b border-dark-700 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800 bg-dark-900/20">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-primary-400 animate-pulse font-medium">Đang truy xuất khối lượng công việc...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : workloads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-gray-500 italic bg-dark-900/50">
                                            Không có dữ liệu công việc thẩm định nào được tìm thấy.
                                        </td>
                                    </tr>
                                ) : (
                                    workloads.map((item) => (
                                        <tr key={`${item.userId}-${item.departmentId}`} className="hover:bg-primary-500/5 transition-all group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-primary-400 font-bold border border-dark-600 group-hover:border-primary-500/50 transition-colors">
                                                        {item.fullName ? item.fullName.split(" ").pop()?.charAt(0) : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">{item.fullName}</div>
                                                        <div className="text-xs text-gray-500">{item.employeeCode}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-gray-300 font-medium">
                                                {item.departmentName}
                                            </td>

                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-md bg-dark-800 text-xs font-semibold text-gray-300 border border-dark-700">
                                                    {USER_ROLE_MAP[item.role]?.label || "N/A"}
                                                </span>
                                            </td>

                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                                                    <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                                    {item.totalDocuments}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        title="Xem chi tiết hồ sơ đang thẩm định"
                                                        onClick={() => navigate(`/coordinator/workloads/${item.userId}?dept=${item.departmentId}`)}
                                                        className="hover:bg-primary-500/10 hover:text-primary-400"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Chi tiết
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
        </Layout>
    );
};

export default DepartmentAppraisalWorkloadsPage;