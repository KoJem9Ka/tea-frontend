import { batch, deepSignal } from '@/shared/backbone/signals';
import type { UseBackFnArgs } from '@/shared/hooks/useBackFn.ts';


export type BackButtonEnableArgs = UseBackFnArgs;

type HeaderBackButtonStoreRaw = {
  isVisible: boolean;
  target: BackButtonEnableArgs | null;
  enable: (args: BackButtonEnableArgs) => void;
  reset: () => void;
}
type HeaderBackButtonStore = Readonly<HeaderBackButtonStoreRaw>

function createHeaderBackButtonStore(): HeaderBackButtonStore {
  const store = deepSignal<HeaderBackButtonStoreRaw>({
    isVisible: false,
    target: null,

    enable(route) {
      batch(() => {
        store.isVisible = true;
        store.target = route;
      }, 'HeaderBackButtonStore.setCustomRoute', { route });
    },

    reset() {
      batch(() => {
        store.isVisible = false;
        store.target = null;
      }, 'HeaderBackButtonStore.reset');
    },
  }, 'HeaderBackButtonStore');

  return store;
}

export const HeaderBackButtonStore = createHeaderBackButtonStore();
