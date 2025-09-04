import { useDeepCompareEffect } from 'ahooks';
import { useIsPresent } from 'motion/react';
import { useId } from 'react';
import { type BackButtonEnableArgs, HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { useBackFn } from '@/features/header/hooks/useBackFn.ts';
import { TelegramNativeBackButtonService } from '@/features/header/telegram-native-back-button.service.ts';


type Args = BackButtonEnableArgs & {
  isEnabled?: boolean;
};

export function useHeaderBackButton({ isEnabled = true, ...args }: Args) {
  const id = useId();
  const { goBack } = useBackFn(args);
  const isPresent = useIsPresent();
  if (!isPresent) isEnabled = false;

  useDeepCompareEffect(() => {
    if (!isEnabled) return;

    const storeReset = HeaderBackButtonStore.enable({ ...args, id });
    const tgNativeButtonReset = TelegramNativeBackButtonService.enable(goBack);
    // console.log('[useHeaderBackButton] SETUP', args);

    return () => {
      storeReset();
      tgNativeButtonReset?.();
      // console.log('[useHeaderBackButton] CLEAN', args);
    };
  }, [isEnabled, args, goBack]);

  return { goBack };
}
