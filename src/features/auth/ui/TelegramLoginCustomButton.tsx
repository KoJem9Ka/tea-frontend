import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/features/auth/auth.service';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';


export function TelegramLoginCustomButton() {
  const mutation = useMutation({ mutationFn: AuthService.telegramLogin });

  return (
    <>
      <Button
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
        className='bg-telegram hover:bg-telegram text-telegram-foreground'
      >
        <Iconify icon={mutation.isPending ? Icon.LoadingSpinner : Icon.Telegram} />
        Войти
      </Button>
    </>
  );
}
