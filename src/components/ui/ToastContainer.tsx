import Toast, { useToast } from "./Toast";

type Props = {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
};

const ToastContainer = ({ position = "top-right", className = "" }: Props) => {
  const { toasts, removeToast } = useToast();

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div
      className={`
        fixed z-50 space-y-2 pointer-events-none
        ${getPositionClasses()} ${className}
      `}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
