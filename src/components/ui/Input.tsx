type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    label?: string;
    error?: string;
    onChange?: (value: string) => void;
};

const Input = ({
    className = "",
    label,
    error,
    required,
    onChange,
    value,
    ...props
}: Props) => {

    const baseClasses =
        "w-full px-4 py-2 rounded-lg border bg-dark-800 text-white border-dark-700 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500";

    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-primary-400">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            <input
                className={`${baseClasses} ${errorClasses}`}
                value={value}
                onChange={handleChange}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;