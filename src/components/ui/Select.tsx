type Props = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const Select = ({
  value,
  onChange,
  options,
  className = "",
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
}: Props) => {
  const baseClasses = "w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-800 text-white border-dark-700";

  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-primary-400">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
      >
        {placeholder && (
          <option value="" className="bg-dark-800">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-dark-800">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
