import { createContext, useContext, useState } from "react";
import type { ToastProps, ToastVariant } from "../../components/ui/Toast";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (variant: ToastVariant, message: string, title?: string, duration?: number) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, variant, title, message, duration, onClose: removeToast }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);