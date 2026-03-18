type Props = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
};

const Card = ({ children, className = "", ...props }: Props) => {
    return (
        <div
            className={`bg-dark-900 border border-dark-800 rounded-xl shadow-2xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;