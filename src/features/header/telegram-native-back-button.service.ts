import { backButton } from '@telegram-apps/sdk';
import type { MaybePromise } from '@/shared/types/types.ts';


type TelegramNativeBackButtonService = {
  enable: (onBackFn: () => MaybePromise) => VoidFunction | void;
}

export const TelegramNativeBackButtonService: TelegramNativeBackButtonService = {
  enable(onBackFn) {
    try {
      if (!backButton.isMounted()) backButton.mount.ifAvailable();
      if (!backButton.isVisible()) backButton.show.ifAvailable();

      let isDisposed = false;
      const disposeWrapper = () => {
        if (isDisposed) return;
        isDisposed = true;
        backButton.hide.ifAvailable();
        backButton.offClick.ifAvailable(onClick);
        dispose?.();
      };
      const onClick = () => {
        disposeWrapper();
        void onBackFn();
      };
      const { 1: dispose } = backButton.onClick.ifAvailable(onClick);

      return disposeWrapper;
    } catch (error) {
      console.warn('Failed to enable Telegram native BackButton:', error);
    }
  },
};
