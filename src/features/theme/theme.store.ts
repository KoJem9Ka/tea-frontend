import type { ReadonlyDeep } from 'type-fest';
import { batch, deepSignal, effect, signal } from '@/shared/backbone/signals';


export type Theme = 'system' | 'light' | 'dark';

type ThemeStore = ReadonlyDeep<{
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  dispose: () => void;
}>

function createThemeStore(): ThemeStore {
  const abortController = new AbortController();
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const _isDarkByMediaMatch = signal(matchMedia.matches);
  matchMedia.addEventListener('change', (e) => void (_isDarkByMediaMatch.value = e.matches), abortController);

  const initialTheme = localStorage.getItem('theme') as Theme | undefined || 'system';

  const store = deepSignal({
    theme: initialTheme,
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
    localStorage.setItem('theme', store.theme);
    document.body.classList.toggle('dark', store.isDark);
    // document.body.classList.toggle('light', !store.isDark);
  });

  return store;
}

export const ThemeStore = createThemeStore();
