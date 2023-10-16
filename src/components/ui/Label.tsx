import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium leading-6 text-gray-900',
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export default Label;
