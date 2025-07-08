import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';


export enum Icon {
  Danger = 'fluent--error-circle-24-regular',
  SaveDiskette = 'fluent--save-24-regular',
  ResetUndo = 'fluent--arrow-undo-24-regular',

  HeartEmpty = 'solar--heart-outline',
  HeartFilled = 'solar--heart-bold',
  // HeartEmpty = 'fluent--heart-24-regular',
  // HeartFilled = 'fluent--heart-24-filled',

  StarEmpty = 'fluent--star-24-regular',
  StarFilled = 'fluent--star-24-filled',
  StarFilledHalf = 'fluent--star-half-24-regular',

  CheckToCircle = 'fluent--circle-24-regular',
  CircleToCheck = 'fluent--checkmark-circle-24-regular',

  Telegram = 'icon-park-outline--telegram',
  Logout = 'solar--logout-2-bold-duotone',

  LoadingSpinner = 'svg-spinners--ring-resize',

  ThemeAuto = 'line-md--light-dark',
  ThemeDark = 'line-md--moon-filled',
  ThemeDarkToLight = 'line-md--moon-filled-to-sunny-filled-transition',
  ThemeLight = 'line-md--sunny-filled',
  ThemeLightToDark = 'line-md--sunny-filled-loop-to-moon-filled-transition',

  ArrowLeft = 'fluent--ios-arrow-left-24-regular',

  EditPen = 'fluent--pen-24-regular',
  AddPlus = 'fluent--add-24-regular',
  DeleteTrashCan = 'fluent--delete-24-regular',
  MoreActions = 'lucide--more-vertical',

  Tea = 'solar--tea-cup-bold',
  Tag = 'solar--hashtag-circle-bold',
  Category = 'solar--notes-bold',
  Weight = 'solar--weigher-bold',
}

type IconifyProps = ComponentProps<'span'> & {
  icon: Icon;
}

export function Iconify({ className, icon, ...props }: IconifyProps) {
  return (
    <span className={cn('iconify size-6 text-current', icon, className)} {...props} />
  );
}
