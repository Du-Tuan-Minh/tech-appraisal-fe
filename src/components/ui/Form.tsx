import React from "react";

type Props = React.FormHTMLAttributes<HTMLFormElement> & {
    children: React.ReactNode;
};

const Form = ({ children, className = "", ...props }: Props) => {
    return (
        <form className={`space-y-6 ${className}`} {...props}>
            {children}
        </form>
    );
};

export default Form;