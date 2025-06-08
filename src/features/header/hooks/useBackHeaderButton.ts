import { useEffect } from 'react';
import { type BackButtonEnableArgs, HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { useBackFn } from '@/shared/hooks/useBackFn.ts';


type Args = {
  isEnabled?: boolean;
} & BackButtonEnableArgs;

export function useBackHeaderButton(args: Args) {
  const { isEnabled = true, fallback, route } = args;

  useEffect(() => {
    if (!isEnabled) return;
    HeaderBackButtonStore.enable({ route, fallback } as BackButtonEnableArgs);
    return HeaderBackButtonStore.reset;
  }, [fallback, isEnabled, route]);

  return useBackFn(args);
}
