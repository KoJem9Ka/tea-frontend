import { HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';
import { useBackFn } from '@/shared/hooks/useBackFn.ts';


export function BackHeaderButton() {
  useSignals();
  const { target, isWebButtonVisible, isTelegramButtonVisible } = HeaderBackButtonStore;

  const { goBack } = useBackFn(target || {} as never);

  if (!isWebButtonVisible || isTelegramButtonVisible) return null;

  return (
    <Button variant='outline' onClick={goBack as VoidFunction}>
      <Iconify icon={Icon.ArrowLeft} className='size-4' />
      Назад
    </Button>
  );
}
