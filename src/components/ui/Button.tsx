import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
};

const Button = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    disabled,
    isLoading = false,
    ...props
}: Props) => {

    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 gap-2";

    const variantClasses = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg shadow-primary-600/20",
        secondary: "bg-gray-800 text-primary-400 border border-gray-700 hover:bg-gray-700",
        outline: "border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
        ghost: "text-primary-600 hover:bg-primary-100/10"
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const disabledClasses =
        "disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            className={`
                ${baseClasses}
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${disabledClasses}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;