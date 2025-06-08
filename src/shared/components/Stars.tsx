import { useState } from 'react';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { cn } from '@/shared/lib/utils';


type InteractiveStarsProps = {
  value: number; // [0, 10]
  onChange?: (value: number) => void;
  isDisabled?: boolean;
  className?: string;
  starClassName?: string;
}

// Renders 5 interactive stars for rating (0-10 scale)
export function Stars({
  value,
  onChange,
  isDisabled,
  className,
  starClassName,
}: InteractiveStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isReadonly = isDisabled || !onChange;
  const displayValue = hoverValue !== null ? hoverValue : value;
  const fullStarsBeforeIndex = Math.floor(displayValue / 2);
  const hasHalfStar = displayValue % 2 !== 0;

  const handleStarClick = (starIndex: number, isHalf: boolean) => isReadonly ? undefined
    : () => onChange(starIndex * 2 + (isHalf ? 1 : 2));
  const handleStarHover = (starIndex: number, isHalf: boolean) => isReadonly ? undefined
    : () => setHoverValue(starIndex * 2 + (isHalf ? 1 : 2));
  const handleMouseLeave = isReadonly ? undefined
    : () => setHoverValue(null);

  return (
    <div className={cn('flex items-center gap-1 z-0 w-max', className)} onMouseLeave={handleMouseLeave}>
      {Array.from({ length: 5 }, (_, starIndex) => {
        const isFullyFilled = starIndex < fullStarsBeforeIndex;
        const isHalfFilled = starIndex === fullStarsBeforeIndex && hasHalfStar;

        return (
          <div
            key={starIndex}
            className={cn(
              'relative flex transition-transform hover:scale-110',
              isReadonly ? 'pointer-events-none' : 'cursor-pointer',
              isDisabled && 'opacity-50',
            )}
          >
            {/* Left half of star */}
            {!isReadonly && <div
              className='absolute inset-0 w-1/2 z-10'
              onClick={handleStarClick(starIndex, true)}
              onMouseEnter={handleStarHover(starIndex, true)}
            />}

            {/* Right half of star */}
            {!isReadonly && <div
              className='absolute inset-0 left-1/2 w-1/2 z-10'
              onClick={handleStarClick(starIndex, false)}
              onMouseEnter={handleStarHover(starIndex, false)}
            />}

            {/* Star icon */}
            {isFullyFilled ? (
              <Iconify icon={Icon.StarFilled} className={cn('text-yellow-400', starClassName)} />
            ) : isHalfFilled ? (
              <Iconify icon={Icon.StarFilledHalf} className={cn('text-yellow-400', starClassName)} />
            ) : (
              <Iconify icon={Icon.StarEmpty} className={cn('text-gray-300 hover:text-yellow-200', starClassName)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
