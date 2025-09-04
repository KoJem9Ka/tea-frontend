import type { ComponentProps } from 'react';
import { ThemeStore } from '@/features/theme/theme.store.ts';
import { useSignals } from '@/shared/backbone/signals.ts';
import { DropdownMenuItem } from '@/shared/components/ui/dropdown-menu.tsx';
import { Label } from '@/shared/components/ui/label.tsx';
import { Switch } from '@/shared/components/ui/switch.tsx';


export function DropdownMenuAnimationsSwitch(props: Omit<ComponentProps<typeof DropdownMenuItem>, 'onSelect'>) {
  useSignals();

  return (
    <DropdownMenuItem className='flex items-center space-x-2 cursor-pointer' onSelect={e => {
      e.preventDefault();
      ThemeStore.setIsAnimationsEnabled(!ThemeStore.isAnimationsEnabled);
    }} {...props}>
      <Switch checked={ThemeStore.isAnimationsEnabled} />
      <Label className='cursor-pointer'>Анимации</Label>
    </DropdownMenuItem>
  );
}
