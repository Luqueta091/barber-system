import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  iconLeft?: ReactNode;
  error?: string;
}

export const Input = ({
  label,
  helperText,
  iconLeft,
  error,
  className,
  ...props
}: InputProps) => (
  <label className="grid gap-1 text-sm font-medium text-gray-700">
    {label}
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition focus-within:ring-2 focus-within:ring-primary-300 focus-within:border-primary-400',
        error ? 'border-red-400' : 'border-gray-200',
      )}
    >
      {iconLeft && <span className="text-gray-400">{iconLeft}</span>}
      <input
        className={cn('w-full border-none bg-transparent outline-none text-gray-900', className)}
        {...props}
      />
    </div>
    {error ? (
      <span className="text-xs text-red-600">{error}</span>
    ) : helperText ? (
      <span className="text-xs text-gray-500">{helperText}</span>
    ) : null}
  </label>
);

export default Input;
