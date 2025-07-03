import { backButton } from '@telegram-apps/sdk';
import { noop } from 'lodash-es';
import type { MaybePromise } from '@/shared/types/types.ts';


type TelegramNativeBackButtonService = {
  enable: (onBackFn: () => MaybePromise) => VoidFunction;
}

export const TelegramNativeBackButtonService: TelegramNativeBackButtonService = {
  enable(onBackFn) {
    try {
      if (!backButton.isMounted() && backButton.mount.isAvailable()) backButton.mount();
      if (!backButton.isVisible() && backButton.show.isAvailable()) backButton.show();

      let isDisposed = 0;

      const dispose = backButton.onClick.isAvailable()
        ? backButton.onClick(() => {
          disposeWrapper();
          void onBackFn();
        })
        : noop;

      const disposeWrapper = () => {
        if (isDisposed++ === 0) {
          if (backButton.isVisible() && backButton.hide.isAvailable()) backButton.hide();
          dispose();
        }
      };

      return disposeWrapper;
    } catch (error) {
      console.warn('Failed to enable Telegram native BackButton:', error);
      return noop;
    }
  },
};
