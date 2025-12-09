import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-soft border border-transparent',
  secondary:
    'bg-white text-primary-700 border border-primary-200 hover:border-primary-300 hover:bg-primary-50',
  ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 border border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    )}
    disabled={disabled}
    {...props}
  >
    {leftIcon && <span className="inline-flex">{leftIcon}</span>}
    {children}
    {rightIcon && <span className="inline-flex">{rightIcon}</span>}
  </button>
);

export default Button;
