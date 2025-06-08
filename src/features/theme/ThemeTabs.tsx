import { type Theme, ThemeStore } from '@/features/theme/theme.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';


export function ThemeTabs() {
  useSignals();

  return (
    <Tabs value={ThemeStore.theme} onValueChange={ThemeStore.setTheme as never}>
      <TabsList>
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
