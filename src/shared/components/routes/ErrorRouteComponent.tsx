import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Link, useLocation, useRouter } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/router-core';
import { useEffect } from 'react';
import { config } from '@/shared/backbone/config';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES';
import { Container } from '@/shared/components/Container';
import { Icon, Iconify } from '@/shared/components/Iconify';
import { Button } from '@/shared/components/ui/button';


export function ErrorRouteComponent(props: ErrorComponentProps) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  const isHome = useLocation().pathname === '/';

  useEffect(() => queryErrorResetBoundary.reset(), [queryErrorResetBoundary]);

  const handleRetry = async () => {
    queryErrorResetBoundary.reset();
    await router.invalidate();
    props.reset();
  };

  return (
    <Container isCenter className='text-center text-balance gap-0'>
      <Iconify icon={Icon.Danger} className='size-14 text-destructive' />

      <p className='font-bold text-destructive'>Ошибка загрузки страницы</p>

      {config.isDev ? (
        <p className='text-muted-foreground'>{props.error.message}</p>
      ) : null}

      <p className='my-4'>Попробуйте обновить страницу или повторите позднее</p>

      <div className='flex flex-wrap justify-center gap-3'>
        {isHome ? null : (
          <Button asChild variant='outline'>
            <Link {...ROUTES.HOME}>Домой</Link>
          </Button>
        )}

        <Button
          variant='secondary'
          onClick={handleRetry as VoidFunction}
        >Повторить</Button>
      </div>
    </Container>
  );
}
