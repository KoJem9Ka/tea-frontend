import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';


export function TypographySmall({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label className={cn('text-sm leading-none font-medium', className)} {...props} />
  );
}
