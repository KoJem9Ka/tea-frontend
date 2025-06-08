import type { ComponentProps } from 'react';
import type { Theme } from '@/features/theme/theme.store';
import { ThemeStore } from '@/features/theme/theme.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
      <DropdownMenuContent className='w-[180px]' align='end'>
        <DropdownMenuRadioGroup value={ThemeStore.theme} onValueChange={ThemeStore.setTheme as never}>
          {Object.entries(themeNames).map(([key, name]) => (
            <DropdownMenuRadioItem key={key} value={key as Theme}>{name}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const themeNames: Record<Theme, string> = {
  light: 'Светлая',
  dark: 'Темная',
  system: 'Системная',
};
