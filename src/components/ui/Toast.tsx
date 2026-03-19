import { useState, useEffect } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastProps = {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
};

const Toast = ({ id, variant, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-900/90 border-green-500/50 text-green-100";
      case "error":
        return "bg-red-900/90 border-red-500/50 text-red-100";
      case "warning":
        return "bg-yellow-900/90 border-yellow-500/50 text-yellow-100";
      case "info":
        return "bg-blue-900/90 border-blue-500/50 text-blue-100";
      default:
        return "bg-primary-900/90 border-primary-500/50 text-primary-100";
    }
  };

  return (
    <div
      className={`
        relative flex items-start p-4 rounded-lg border backdrop-blur-sm shadow-lg
        min-w-[300px] max-w-md animate-fade-in
        ${getStyles()}
      `}
    >
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-3 text-white/70 hover:text-white"
      >
        ×
      </button>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (variant: ToastVariant, message: string, title?: string, duration?: number) => {
    const id = Date.now().toString();
    
    setToasts(prev => [...prev, { id, variant, title, message, duration, onClose: () => {} }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success: (message: string, title?: string) => addToast("success", message, title),
    error: (message: string, title?: string) => addToast("error", message, title),
    warning: (message: string, title?: string) => addToast("warning", message, title),
    info: (message: string, title?: string) => addToast("info", message, title),
  };
};

export default Toast;
