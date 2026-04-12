type Props = {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  htmlFor?: string;
  children?: React.ReactNode;
};

const FormField = ({
  label,
  error,
  required,
  className = "",
  htmlFor,
  children
}: Props) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-primary-400"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;