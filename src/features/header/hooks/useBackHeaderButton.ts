import { useDeepCompareEffect } from 'ahooks';
import { type BackButtonEnableArgs, HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { TelegramNativeBackButtonService } from '@/features/header/telegram-native-back-button.service.ts';
import { useBackFn } from '@/shared/hooks/useBackFn.ts';


type Args = BackButtonEnableArgs & {
  isEnabled?: boolean;
};

export function useBackHeaderButton({ isEnabled = true, ...args }: Args) {
  const { goBack } = useBackFn(args);

  useDeepCompareEffect(() => {
    if (!isEnabled) return;

    const storeReset = HeaderBackButtonStore.enable(args);
    const tgNativeButtonReset = TelegramNativeBackButtonService.enable(goBack);

    return () => {
      storeReset();
      tgNativeButtonReset();
    };
  }, [isEnabled, args, goBack]);

  return { goBack };
}
