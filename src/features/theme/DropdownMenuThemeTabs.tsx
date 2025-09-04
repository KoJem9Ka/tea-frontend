import { ThemeStore } from '@/features/theme/theme.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { Theme } from '@/shared/types/theme.ts';


export function DropdownMenuThemeTabs() {
  useSignals();

  return (
    <Tabs className='mx-2 my-1.5' value={ThemeStore.theme} onValueChange={ThemeStore.setTheme as never}>
      <TabsList className='w-full'>
        {Object.entries(themeNames).map(([key, [icon, label]]) => (
          <TabsTrigger key={key} value={key as Theme} aria-label={label}>
            <Iconify icon={icon} />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

const themeNames = {
  system: [Icon.ThemeAuto, 'Системная тема'],
  dark: [Icon.ThemeDark, 'Темная тема'],
  light: [Icon.ThemeLight, 'Светлая тема'],
} as const satisfies Record<Theme, unknown>;
