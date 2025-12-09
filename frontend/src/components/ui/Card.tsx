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
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
    )}
    {children}
  </div>
);

export default Card;
