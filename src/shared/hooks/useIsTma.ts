import { isTMA } from '@telegram-apps/sdk-react';
import { useMemo } from 'react';


export function useIsTelegramMiniApp() {
  return useMemo(() => isTMA(), []);
}
