import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, useMatches } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { init, miniApp } from '@telegram-apps/sdk';
import { isTMA } from '@telegram-apps/sdk-react';
import { usePrevious } from 'ahooks';
import { AnimatePresence } from 'motion/react';
import { AuthService } from '@/features/auth';
import { Header } from '@/features/header';
import { AnimatedOutlet } from '@/shared/components/AnimatedOutlet.tsx';


interface MyRouterContext {
  queryClient: QueryClient;
}

let once = false;

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  staleTime: Infinity,
  beforeLoad: async () => {
    if (isTMA() && !once) {
      once = true;
      init();
      miniApp.ready.ifAvailable();
      await AuthService.authMiniApp();
    }
  },
});


function RootComponent() {
  const matches = useMatches();
  const nextMatch = matches[matches.length - 1];
  const routeIdPrev = usePrevious(nextMatch?.routeId);

  return <>
    <Header />
    <main className='relative'>
      <AnimatePresence mode='popLayout'>
        <AnimatedOutlet key={nextMatch?.id ?? ''} routeId={nextMatch?.routeId || '/'} routeIdPrev={routeIdPrev} />
      </AnimatePresence>
    </main>

    <TanStackRouterDevtools />
    <ReactQueryDevtools buttonPosition='bottom-right' />
  </>;
}
