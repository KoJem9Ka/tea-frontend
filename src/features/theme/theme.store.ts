import type { ReadonlyDeep } from 'type-fest';
import { batch, deepSignal, effect, signal } from '@/shared/backbone/signals';
import { localStorageSafe } from '@/shared/lib/localStorageSafe.ts';
import type { Theme } from '@/shared/types/theme.ts';


type ThemeStore = ReadonlyDeep<{
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  dispose: () => void;
}>

const DEFAULT_THEME: Theme = 'system';

function createThemeStore(): ThemeStore {
  const abortController = new AbortController();
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const _isDarkByMediaMatch = signal(matchMedia.matches);
  matchMedia.addEventListener('change', (e) => void (_isDarkByMediaMatch.value = e.matches), abortController);

  const store = deepSignal({
    theme: localStorageSafe.theme.getOr(DEFAULT_THEME),
    get isDark(): boolean {
      return this.theme === 'system'
        ? _isDarkByMediaMatch.value
        : this.theme === 'dark';
    },
    setTheme(theme: Theme) {
      batch(() => {
        store.theme = theme;
      }, 'ThemeStore.setTheme', { theme });
    },
    dispose() {
      abortController.abort();
      themeEffectUnsub();
    },
  }, 'ThemeStore');

  const themeEffectUnsub = effect(() => {
    if (store.theme === DEFAULT_THEME) localStorageSafe.theme.remove();
    else localStorageSafe.theme.set(store.theme);

    document.body.classList.toggle('dark', store.isDark);
    // document.body.classList.toggle('light', !store.isDark);
  });

  return store;
}

export const ThemeStore = createThemeStore();

