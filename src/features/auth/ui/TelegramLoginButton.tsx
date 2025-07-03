import { useEffect, useId, useRef } from 'react';
import { useAuthMutation } from '@/features/auth/hooks/useAuthMutation';
import { config } from '@/shared/backbone/config';
import type { TelegramUserDataFromWidget } from '@/shared/types/auth/telegram-user-data-from-widget.ts';


export function TelegramLoginButton() {
  const isMiniApp = !!window.Telegram.WebApp.initData;

  const ref = useRef<HTMLDivElement>(null);
  const onTelegramAuthFnId = `onTelegramAuth${useId()}`.replace(/[^a-z0-9]/gi, '_');
  const { mutate: authMutate } = useAuthMutation();

  useEffect(() => {
    if (isMiniApp) return;
    Object.assign(window, {
      [onTelegramAuthFnId]: (user: TelegramUserDataFromWidget) => authMutate(user),
    });

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', config.telegramBotName);
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', `${onTelegramAuthFnId}(user)`);
    script.setAttribute('data-request-access', 'write');

    const container = ref.current;
    if (!container) throw new Error('TelegramLoginButton: Container not found');
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
      // @ts-expect-error - Removing the global function
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete window[onTelegramAuthFnId];
    };
  }, [authMutate, isMiniApp, onTelegramAuthFnId]);

  if (isMiniApp) return null;
  return <div ref={ref} />;
}
