import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
};

export default function Button({
  className,
  onClick,
  type,
  disabled,
  children,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm focus-visible:outline-indigo-600 focus-visible:outline-offset-2 focus-visible:outline focus-visible:outline-2',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
