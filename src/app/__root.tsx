import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { init, miniApp, retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk';
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

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootRoute,
  beforeLoad: async () => {
    if (!isTMA()) return;
    init();
    if (miniApp.ready.isAvailable()) miniApp.ready();

    const { tgWebAppData } = retrieveLaunchParams();
    const initData = retrieveRawInitData();
    if (!initData) return;
    if (!tgWebAppData) return;
    const user = tgWebAppData.user;
    if (!user) return;

    // FIXME: When user not closes App for a long time
    //  then backend rejects initData when MiniApp burger "refresh page" button pressed.
    //  App must be automatically reloaded somehow.
    await AuthService.authMiniApp({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      auth_date: tgWebAppData.auth_date.getTime() / 1000,
      hash: tgWebAppData.hash,
    }, { initData });
    // miniAppReady();
    // await AuthService.auth();
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
