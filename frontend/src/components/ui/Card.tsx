import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, subtitle, actions, children, className }: CardProps) => (
  <div className={cn('rounded-xl border border-gray-200 bg-white p-4 shadow-soft', className)}>
    {(title || subtitle || actions) && (
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {actions}
          </div>
        )}
      </header>
    )}
    {children}
  </div>
);

export default Card;
