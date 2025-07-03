import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { init, miniApp } from '@telegram-apps/sdk';
import { isTMA } from '@telegram-apps/sdk-react';
import { AuthService } from '@/features/auth';
import { Header } from '@/features/header';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
// import { initData } from '@telegram-apps/sdk';
// import { init, isTMA, retrieveLaunchParams } from '@telegram-apps/sdk-react';

// const initializeTelegramSDK = async () => {
//   const res = await retrieveLaunchParams()
//
// try {
//   // Инициализация SDK
//   await init();
//   // Сообщаем Telegram, что приложение готово к отображению
//   if (miniApp.ready.isAvailable()) {
//     await miniApp.ready();
//     console.log('Mini App готово');
//   }
// } catch (error) {
//   console.error('Ошибка инициализации:', error);
// }
// };


interface MyRouterContext {
  queryClient: QueryClient;
}

let once = false;

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootRoute,
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


function RootRoute() {
  return <>
    <Header />
    <Outlet />

    {/*<TanStackRouterDevtools />*/}
    <ReactQueryDevtools buttonPosition='bottom-right' />
  </>;
}
