import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
};

const Container = ({ children, className = "", ...props }: Props) => {
    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Container;