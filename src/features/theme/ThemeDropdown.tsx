import type { ComponentProps } from 'react';
import { DropdownMenuAnimationsSwitch } from '@/features/theme/DropdownMenuAnimationsSwitch.tsx';
import { DropdownMenuThemeTabs } from '@/features/theme/DropdownMenuThemeTabs.tsx';
import { ThemeStore } from '@/features/theme/theme.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu'


export function ThemeDropdown(props: ComponentProps<typeof Button>) {
  useSignals();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' {...props}>
          <Iconify icon={ThemeStore.isDark ? Icon.ThemeLightToDark : Icon.ThemeDarkToLight} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Тема</DropdownMenuLabel>
        <DropdownMenuThemeTabs />

        <DropdownMenuSeparator />

        <DropdownMenuAnimationsSwitch />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
