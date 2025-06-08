import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import { HeaderBackButtonStore } from '@/features/header/header-back-button.store';
import { useSignals } from '@/shared/backbone/signals';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';


export function BackHeaderButton() {
  useSignals();
  const { goBack } = useBackNavigation();

  if (!HeaderBackButtonStore.isVisible) return null;

  return (
    <Button variant='outline' onClick={goBack}>
      <Iconify icon={Icon.ArrowLeft} className='size-4' />
      Назад
    </Button>
  );
}

function useBackNavigation() {
  useSignals();
  const { target } = HeaderBackButtonStore;
  const router = useRouter();
  const isCanGoBack = useCanGoBack();
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    if (!target) return;

    if (target.route) void navigate({ resetScroll: false, ...target.route });
    else if (isCanGoBack) router.history.back();
    else void navigate({ resetScroll: false, ...target.fallback });

  }, [target, isCanGoBack, navigate, router.history]);

  return { goBack, isCanGoBack };
}
