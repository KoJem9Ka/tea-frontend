import * as Slot from '@radix-ui/react-slot';
import { cn } from '@/shared/lib/utils';


type ContainerProps = React.ComponentProps<'div'> & {
  isSmall?: boolean,
  asChild?: boolean,
  isCenter?: boolean,
  isCenterX?: boolean,
  isCenterY?: boolean,
}

export function Container({
  isSmall, isCenter, isCenterX, isCenterY,
  asChild, className, ...props
}: ContainerProps) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(
        'grow flex flex-col',
        'w-full max-w-7xl mx-auto',
        'p-4 gap-3',
        'min-h-0',
        isSmall && 'max-w-md',
        (isCenter || isCenterX) && 'items-center',
        (isCenter || isCenterY) && 'justify-center',
        className,
      )}
      {...props}
    />
  );
}
