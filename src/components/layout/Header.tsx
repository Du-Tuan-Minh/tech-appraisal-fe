import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

import Button from "../ui/Button";
import { logout } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/constants/enum/UserRole";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout API error", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/login", { replace: true });
            toast.success("Đã đăng xuất");
        }
    };

    const isActivePath = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };

    const filteredNavigation = useMemo(() => {
        const baseNav = [
            { name: "Dashboard", path: "/dashboard", icon: "🏠" },
            { name: "Phòng Ban", path: "/centers", icon: "🏢" },
            { name: "Tài Liệu", path: "/documents", icon: "📄" },
            { name: "Thẩm Định", path: "/appraisals/my-tasks", icon: "📋" },
        ];

        if (role === UserRole.Director || role === UserRole.InstituteDirector || role === UserRole.DeputyInstituteDirector) {
            baseNav.push({
                name: "Quản Lý Phân Công",
                path: "/appraisals/assignments/director",
                icon: "📑"
            });
        } else if (role === UserRole.Manager) {
            baseNav.push({
                name: "Quản Lý Phân Công",
                path: "/appraisals/listAssignments",
                icon: "📑"
            });
        }

        baseNav.push(
            { name: "Ký Số", path: "/signatures", icon: "✍️" },
            { name: "Thư Viện", path: "/library", icon: "📚" }
        );

        return baseNav;
    }, [role]);

    return (
        <header className="bg-dark-900/90 backdrop-blur-sm border-b border-dark-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/documents" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-green rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TA</span>
                            </div>
                            <span className="text-white font-bold text-xl">Tech Appraisal</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-1">
                        {filteredNavigation.map((item) => (
                            <Link
                                key={item.path}
                                title={item.name}
                                to={item.path}
                                className={`
                                    px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center
                                    ${isActivePath(item.path)
                                        ? "bg-primary-900/50 text-primary-300 border-l-2 border-primary-500"
                                        : "text-gray-300 hover:bg-dark-800 hover:text-white"}`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                <span className="truncate max-w-[120px] lg:max-w-none">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="relative">
                            <span className="text-xl">🔔</span>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>

                        <div className="relative group">
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-green rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">U</span>
                                </div>
                                <span className="hidden sm:block text-gray-300">User</span>
                                <span className="text-gray-400 text-[10px]">▼</span>
                            </Button>

                            <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                                    >
                                        👤 Hồ sơ cá nhân
                                    </Link>
                                    <hr className="my-1 border-dark-700" />
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300"
                                    >
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="text-xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
                        </Button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-dark-800 py-2 animate-in slide-in-from-top duration-200">
                        {filteredNavigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    block px-3 py-2 rounded-md text-base font-medium flex items-center
                                    ${isActivePath(item.path)
                                        ? "bg-primary-900/50 text-primary-300 border-l-2 border-primary-500"
                                        : "text-gray-300 hover:bg-dark-800 hover:text-white"
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}

                        <div className="pt-2 mt-2 border-t border-dark-800">
                            <Link
                                to="/profile"
                                className="block px-3 py-2 text-base text-gray-300 hover:bg-dark-800 hover:text-white flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mr-3">👤</span> Hồ sơ cá nhân
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-base text-red-400 hover:bg-dark-800 hover:text-red-300 flex items-center"
                            >
                                <span className="mr-3">🚪</span> Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;