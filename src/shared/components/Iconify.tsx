import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';


export enum Icon {
  Danger = 'solar--danger-circle-bold',
  SaveDiskette = 'solar--diskette-bold',
  ResetUndo = 'solar--undo-left-bold',

  HeartEmpty = 'solar--heart-outline',
  HeartFilled = 'solar--heart-bold',

  StarEmpty = 'line-md--star',
  StarFilled = 'line-md--star-filled',
  StarFilledHalf = 'line-md--star-filled-half',

  CheckToCircle = 'line-md--confirm-circle-twotone-to-circle-transition',
  CircleToCheck = 'line-md--circle-to-confirm-circle-twotone-transition',

  Telegram = 'icon-park-outline--telegram',
  Logout = 'solar--logout-2-bold-duotone',

  LoadingSpinner = 'svg-spinners--ring-resize',

  ThemeAuto = 'line-md--light-dark',
  ThemeDark = 'line-md--moon-filled',
  ThemeDarkToLight = 'line-md--moon-filled-to-sunny-filled-transition',
  ThemeLight = 'line-md--sunny-filled',
  ThemeLightToDark = 'line-md--sunny-filled-loop-to-moon-filled-transition',

  ArrowLeft = 'solar--alt-arrow-left-linear',

  EditPen = 'solar--pen-2-bold',
  AddPlus = 'solar--add-circle-bold',
  DeleteTrashCan = 'solar--trash-bin-2-bold',
  MoreActions = 'lucide--more-vertical',

  Tea = 'solar--tea-cup-bold',
  Tag = 'solar--hashtag-circle-bold',
  Category = 'solar--notes-bold',
}

type IconifyProps = ComponentProps<'span'> & {
  icon: Icon;
}

export function Iconify({ className, icon, ...props }: IconifyProps) {
  return (
    <span className={cn('iconify size-6 text-current', icon, className)} {...props} />
  );
}
