import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { Layout } from "../../components/layout";
import { signalRService } from "../../services/signalRService";

import { notificationService } from "../../services/notificationService";
import type { UserNotificationResponseDto } from "../../types/notification";
import { NotificationType, NOTIFICATION_TYPE_MAP } from "../../constants/enum/NotificationType";

const NotificationsPage = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<UserNotificationResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<UserNotificationResponseDto | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const [filters, setFilters] = useState({
        searchTerm: "",
        type: "",
        isRead: "",
        sortBy: "createdAt",
        sortOrder: "desc" as "asc" | "desc"
    });

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${Math.max(1, diffMins)} phút trước`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;

        return date.toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const loadNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page,
                pageSize,
                search: filters.searchTerm || undefined,
                type: filters.type !== ""
                    ? (Number(filters.type) as NotificationType)
                    : undefined,
                isRead:
                    filters.isRead === "read"
                        ? true
                        : filters.isRead === "unread"
                            ? false
                            : undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            const data = await notificationService.getMyNotifications(params);
            setNotifications(data.items);
            setTotalPages(data.totalPages);
        } catch (err) {
            toast.error("Không thể tải danh sách thông báo.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, page, pageSize]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        const initSignalR = async () => {
            signalRService.onReceiveNotification((newNotification: UserNotificationResponseDto) => {
                setNotifications(prev => {
                    if (prev.some(n => n.id === newNotification.id)) {
                        return prev;
                    }

                    return [newNotification, ...prev];
                });

                toast.success("Bạn có thông báo mới");
            });

            signalRService.onNotificationRead((notificationId: string) => {
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notificationId
                            ? { ...n, isRead: true }
                            : n
                    )
                );
            });

            signalRService.onNotificationDeleted((notificationId: string) => {
                setNotifications(prev =>
                    prev.filter(n => n.id !== notificationId)
                );

                setSelectedNotification(prev => {
                    if (prev?.id === notificationId) {
                        setShowDetail(false);
                        return null;
                    }

                    return prev;
                });
            });
        };

        initSignalR();

        return () => {
            signalRService.offReceiveNotification();
            signalRService.offNotificationRead();
            signalRService.offNotificationDeleted();
        };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            await notificationService.markAsRead(id);
        } catch {
            loadNotifications();
            toast.error("Thao tác thất bại.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Xóa thông báo này?")) return;
        setIsUpdating(true);
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (selectedNotification?.id === id) setShowDetail(false);
            toast.success("Đã xóa.");
        } catch {
            toast.error("Lỗi xóa.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleViewDetail = (n: UserNotificationResponseDto) => {
        setSelectedNotification(n);
        setShowDetail(true);
        if (!n.isRead) handleMarkAsRead(n.id);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight italic">Thông Báo</h1>
                        <p className="text-primary-400 mt-1 font-medium text-sm">{unreadCount} thông báo chưa đọc</p>
                    </div>
                </div>

                <Card className="p-5 border-dark-700 bg-dark-900/40 backdrop-blur-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Input
                            label="Tìm kiếm"
                            placeholder="Từ khóa..."
                            value={filters.searchTerm}
                            onChange={(val) => setFilters(f => ({ ...f, searchTerm: val }))}
                        />
                        <Select
                            label="Loại"
                            value={filters.type}
                            options={[
                                { value: "", label: "Tất cả" },
                                ...Object.entries(NOTIFICATION_TYPE_MAP).map(([key, cfg]) => ({
                                    value: key,
                                    label: cfg.label
                                }))
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, type: val }))}
                        />
                        <Select
                            label="Trạng thái"
                            value={filters.isRead}
                            options={[
                                { value: "", label: "Tất cả" },
                                { value: "unread", label: "Chưa đọc" },
                                { value: "read", label: "Đã đọc" }
                            ]}
                            onChange={(val) => setFilters(f => ({ ...f, isRead: val }))}
                        />
                        <Select
                            label="Sắp xếp"
                            value={filters.sortBy}
                            options={[{ value: "createdAt", label: "Mới nhất" }, { value: "title", label: "Tiêu đề" }]}
                            onChange={(val) => setFilters(f => ({ ...f, sortBy: val }))}
                        />
                        <div className="flex items-end">
                            <Button
                                variant="ghost"
                                className="text-red-400 w-full text-sm font-medium"
                                onClick={() => setFilters({ searchTerm: "", type: "", isRead: "", sortBy: "createdAt", sortOrder: "desc" })}
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>
                        ) : notifications.length > 0 ? (
                            notifications.map((n) => {
                                const typeConfig = NOTIFICATION_TYPE_MAP[n.type as NotificationType] || NOTIFICATION_TYPE_MAP[NotificationType.System];

                                return (
                                    <Card
                                        key={n.id}
                                        className={`p-4 border transition-all cursor-pointer hover:bg-dark-800 ${!n.isRead ? "bg-primary-500/5 border-primary-500/30" : "bg-dark-900/20 border-dark-700"}`}
                                        onClick={() => handleViewDetail(n)}
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center border border-dark-600 overflow-hidden font-bold text-primary-400">
                                                {n.senderAvatar ? (
                                                    <img src={n.senderAvatar} alt="avatar" className="object-cover w-full h-full" />
                                                ) : (
                                                    <span>{n.title.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`font-semibold transition-colors ${!n.isRead ? "text-primary-400" : "text-gray-200"}`}>{n.title}</h3>
                                                    {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
                                                </div>
                                                <p className="text-[13px] text-gray-400 line-clamp-1 mt-1 font-medium">{n.content}</p>
                                                <div className="flex gap-3 mt-3 items-center">
                                                    <span className={`text-[10px] uppercase tracking-tighter px-2 py-0.5 rounded font-bold border border-dark-600 ${typeConfig.color}`}>
                                                        {typeConfig.label}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-mono italic opacity-80">{formatDate(n.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center p-20 text-gray-500 border-2 border-dashed border-dark-800 rounded-xl font-medium tracking-tight">Không có thông báo mới nào.</div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        {showDetail && selectedNotification && (
                            <Card className="p-6 border-primary-500/30 bg-dark-900/60 sticky top-6 backdrop-blur-xl animate-in fade-in slide-in-from-right-4 ring-1 ring-primary-500/10">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center border-b border-dark-700 pb-4">
                                        <span className="text-xs text-primary-400 font-mono tracking-tight uppercase">#{selectedNotification.id.slice(-6)}</span>
                                        <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-3 tracking-tight italic">{selectedNotification.title}</h2>
                                        <p className="text-gray-300 text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{selectedNotification.content}</p>
                                    </div>

                                    {selectedNotification.metadata && (
                                        <div className="bg-dark-800/50 p-4 rounded-lg border border-dark-700">
                                            <p className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Liên kết hệ thống</p>
                                            {selectedNotification.metadata.documentId && (
                                                <Button
                                                    variant="primary"
                                                    className="w-full text-xs font-bold uppercase tracking-tight"
                                                    onClick={() => navigate(`/documents/${selectedNotification.metadata?.documentId}`)}
                                                >
                                                    Mở tài liệu thẩm định
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    <Button variant="ghost" className="w-full text-red-500/70 hover:text-red-400 text-xs font-bold uppercase tracking-widest" onClick={() => handleDelete(selectedNotification.id)}>
                                        Gỡ bỏ thông báo này
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotificationsPage;