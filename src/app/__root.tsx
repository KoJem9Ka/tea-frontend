import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { init, miniApp } from '@telegram-apps/sdk';
import { isTMA } from '@telegram-apps/sdk-react';
import { AuthService } from '@/features/auth';
import { Header } from '@/features/header';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


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
  return <>
    <Header />
    <Outlet />

    {/*<TanStackRouterDevtools />*/}
    <ReactQueryDevtools buttonPosition='bottom-right' />
  </>;
}
