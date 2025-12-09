import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'neutral';

const variantClasses: Record<Variant, string> = {
  default: 'bg-primary-50 text-primary-700 border-primary-100',
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-amber-50 text-amber-800 border-amber-100',
  danger: 'bg-red-50 text-red-700 border-red-100',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
