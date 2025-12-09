import { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = ({ label, helperText, error, className, children, ...props }: SelectProps) => (
  <label className="grid gap-1 text-sm font-medium text-gray-700">
    {label}
    <select
      className={cn(
        'rounded-lg border bg-white px-3 py-2 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
        error ? 'border-red-400' : 'border-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    {error ? (
      <span className="text-xs text-red-600">{error}</span>
    ) : helperText ? (
      <span className="text-xs text-gray-500">{helperText}</span>
    ) : null}
  </label>
);

export default Select;
