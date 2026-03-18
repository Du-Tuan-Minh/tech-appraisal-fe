import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
};

const Button = ({
    children,
    className = "",
    variant = "primary",
    size = "md",
    disabled,
    ...props
}: Props) => {

    const baseClasses =
        "font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2";

    const variantClasses = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        secondary: "bg-gray-800 text-primary-400 border border-gray-700 hover:bg-gray-700",
        outline: "border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
        ghost: "text-primary-600 hover:bg-primary-100"
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
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
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;