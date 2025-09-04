import { HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { useBackFn } from '@/features/header/hooks/useBackFn.ts';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import { useIsTelegramMiniApp } from '@/shared/hooks/useIsTma.ts';


export function HeaderBackButton() {
  useSignals();
  const { target } = HeaderBackButtonStore;
  const isTelegramMiniApp = useIsTelegramMiniApp();
  const { goBack } = useBackFn(target || {} as never);

  if (!target || isTelegramMiniApp) return null;

  return (
    <Button variant='outline' onClick={goBack as VoidFunction}>
      <Iconify icon={Icon.ArrowLeft} className='size-4 -ml-[2px] -mr-2' />
      <span className='leading-4'>Назад</span>
    </Button>
  );
}
