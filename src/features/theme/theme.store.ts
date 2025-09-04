import { MotionGlobalConfig } from 'motion/react';
import type { ReadonlyDeep } from 'type-fest';
import { batch, deepSignal, effect, signal } from '@/shared/backbone/signals';
import { localStorageSafe } from '@/shared/lib/localStorageSafe.ts';
import type { Theme } from '@/shared/types/theme.ts';


type ThemeStoreRaw = {
  theme: Theme;
  isAnimationsEnabled: boolean;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setIsAnimationsEnabled: (isEnabled: boolean) => void;
  dispose: () => void;
};

type ThemeStore = ReadonlyDeep<ThemeStoreRaw>

const DEFAULT_THEME: Theme = 'system';

function createThemeStore(): ThemeStore {
  const abortController = new AbortController();
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
  const _isDarkByMediaMatch = signal(matchMedia.matches);
  matchMedia.addEventListener('change', (e) => void (_isDarkByMediaMatch.value = e.matches), abortController);

  const store = deepSignal<ThemeStoreRaw>({
    theme: localStorageSafe.theme.getOr(DEFAULT_THEME),
    isAnimationsEnabled: localStorageSafe.isAnimationsEnabled.getOr(true),
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
    setIsAnimationsEnabled(isEnabled: boolean) {
      batch(() => {
        store.isAnimationsEnabled = isEnabled;
        MotionGlobalConfig.skipAnimations = !isEnabled;
        localStorageSafe.isAnimationsEnabled.set(isEnabled);
      }, 'ThemeStore.setIsAnimationsEnabled', { isEnabled });
    },
    dispose() {
      abortController.abort();
      themeEffectUnsub();
    },
  }, 'ThemeStore');

  MotionGlobalConfig.skipAnimations = !store.isAnimationsEnabled;

  const themeEffectUnsub = effect(() => {
    if (store.theme === DEFAULT_THEME) localStorageSafe.theme.remove();
    else localStorageSafe.theme.set(store.theme);

    document.body.classList.toggle('dark', store.isDark);
    document.body.classList.toggle('light', !store.isDark);
  });

  return store;
}

export const ThemeStore = createThemeStore();

