import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signalRService } from "@/services/signalRService";
import type { UserNotificationResponseDto } from "@/types/notification";
import { useAuth } from "@/hooks/useAuth";

const NotificationListener = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;

    useEffect(() => {
        if (!isAuthenticated) {
            signalRService.stopConnection();
            return;
        }

        let isMounted = true;

        const handleNewNotification = (notification: UserNotificationResponseDto) => {
            if (!isMounted) return;

            toast.custom((t) => (
                <div
                    onClick={() => {
                        toast.dismiss(t.id);
                        navigateRef.current("/notifications");
                    }}
                    className={`${t.visible ? "animate-enter" : "animate-leave"} 
                        max-w-md w-full bg-dark-900 shadow-lg rounded-lg pointer-events-auto 
                        flex ring-1 ring-primary-500/50 border border-dark-700 p-4 
                        cursor-pointer hover:bg-dark-800 transition-all`}
                >
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                            {notification.senderAvatar ? (
                                <img src={notification.senderAvatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                            ) : (
                                <span className="text-xl">🔔</span>
                            )}
                        </div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-bold text-white italic truncate">
                            {notification.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed break-words overflow-hidden">
                            {notification.content}
                        </p>
                    </div>
                </div>
            ), { duration: 6000, position: 'top-right' });
        };

        const handleNotificationRead = (notificationId: string) => {
            if (!isMounted) return;
        };

        const initSignalR = async () => {
            try {
                await signalRService.startConnection();

                signalRService.offReceiveNotification();
                signalRService.offNotificationRead();
                signalRService.onReceiveNotification(handleNewNotification);
                signalRService.onNotificationRead(handleNotificationRead);

            } catch (err) {
                console.error("[SignalR] Connection Failed:", err);
            }
        };

        initSignalR();

        return () => {
            isMounted = false;
            signalRService.offReceiveNotification();
            signalRService.offNotificationRead();
        };
    }, [isAuthenticated]);

    return null;
};

export default NotificationListener;