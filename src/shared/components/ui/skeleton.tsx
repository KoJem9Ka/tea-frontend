import { cn } from '@/shared/lib/utils';


function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn(
        'bg-accent animate-pulse rounded-md',
        'pointer-events-none',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
