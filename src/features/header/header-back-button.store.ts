import { backButton } from '@telegram-apps/sdk';
import { batch, deepSignal } from '@/shared/backbone/signals';
import type { UseBackFnArgs } from '@/shared/hooks/useBackFn.ts';


export type BackButtonEnableArgs = UseBackFnArgs;

type HeaderBackButtonStoreRaw = {
  isWebButtonVisible: boolean;
  isTelegramButtonVisible: boolean;
  target: BackButtonEnableArgs | null;
  enable: (args: BackButtonEnableArgs) => VoidFunction;
  dispose: VoidFunction;
}
type HeaderBackButtonStore = Readonly<HeaderBackButtonStoreRaw>

function createHeaderBackButtonStore(): HeaderBackButtonStore {
  const store = deepSignal<HeaderBackButtonStoreRaw>({
    isWebButtonVisible: false,
    isTelegramButtonVisible: false,
    target: null,

    enable(route) {
      batch(() => {
        store.isWebButtonVisible = true;
        store.target = route;
      }, 'HeaderBackButtonStore.enable', { route });
      return () => {
        batch(() => {
          store.isWebButtonVisible = false;
          store.target = null;
        }, 'HeaderBackButtonStore.reset');
      };
    },
    dispose() {
      unsub();
    },
  }, 'HeaderBackButtonStore');

  const unsub = backButton.isVisible.sub(isVisible => void (store.isTelegramButtonVisible = isVisible));

  return store;
}

export const HeaderBackButtonStore = createHeaderBackButtonStore();
