import { cn } from '../../utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
      sizeClass[size],
      className,
    )}
  />
);

export default Spinner;
