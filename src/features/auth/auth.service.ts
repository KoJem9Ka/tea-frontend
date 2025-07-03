import { miniApp, retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk';
import { ResultAsync } from 'neverthrow';
import { AuthApi, type AuthReqBody } from '@/features/auth/auth.api';
import { AuthStore } from '@/features/auth/auth.store';
import { backendClientEmitter, BackendClientEvent } from '@/shared/backbone/backend/backend-client';
import { config } from '@/shared/backbone/config';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/constants.ts';
import { promiseWithResolvers } from '@/shared/lib/independent/promise-with-resolvers';
import { localStorageSafe } from '@/shared/lib/localStorageSafe.ts';


type AuthService = {
  auth: (body: AuthReqBody) => Promise<void>,
  authMiniApp: () => Promise<void>,
  refreshToken: () => Promise<void>,
  telegramLogin: () => Promise<void>,
}

export const AuthService: AuthService = {
  async auth(body) {
    const { accessToken } = await AuthApi.auth(body);
    AuthStore.loggedIn({ telegram: body, accessToken });
  },
  async authMiniApp() {
    if (AuthStore.isAuthorized) return;

    const { tgWebAppData } = retrieveLaunchParams();
    const initData = retrieveRawInitData();
    if (!initData) return;
    if (!tgWebAppData) return;
    const { user } = tgWebAppData;
    if (!user) return;

    const telegram: AuthReqBody = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      auth_date: tgWebAppData.auth_date.getTime() / 1000,
      hash: tgWebAppData.hash,
    };

    const res = await ResultAsync.fromPromise(AuthApi.authMiniApp({ initData }), (error) => error as Error);

    if (res.isErr()) {
      const closedBecauseOfErrorCount = localStorageSafe.authErrorCloses.getOr(0);
      if (closedBecauseOfErrorCount < 3) {
        localStorageSafe.authErrorCloses.set(closedBecauseOfErrorCount + 1);
        alert(`close closedBecauseOfErrorCount=${closedBecauseOfErrorCount}`);
        return miniApp.close();
      } else {
        alert(`Не удалось авторизоваться внутри Telegram. ${DEFAULT_ERROR_MESSAGE}. Информация об ошибке: ${res.error.name} ${res.error.message}`);
      }
    } else {
      localStorageSafe.authErrorCloses.remove();
      AuthStore.loggedIn({ telegram, accessToken: res.value.accessToken });
    }
  },
  async refreshToken() {
    if (refreshTokenPromise) return refreshTokenPromise;
    const resolvers = promiseWithResolvers<Awaited<ReturnType<typeof AuthService.refreshToken>>>();
    refreshTokenPromise = resolvers.promise;
    try {
      const { accessToken } = await AuthApi.refreshToken();
      AuthStore.updateToken({ accessToken });
      resolvers.resolve();
    } catch (err) {
      resolvers.reject(err);
    } finally {
      refreshTokenPromise = null;
    }
  },
  async telegramLogin() {
    const resolvers = promiseWithResolvers<void>();
    window.Telegram.Login.auth({
      bot_id: config.telegramBotId,
      request_access: true,
    }, dataOrFalse => {
      if (dataOrFalse) AuthService.auth(dataOrFalse)
        .then(resolvers.resolve)
        .catch(resolvers.reject);
      else resolvers.resolve();
    });
    return resolvers.promise;
  },
};

let refreshTokenPromise: Promise<void> | null = null;
backendClientEmitter.on(BackendClientEvent.RefreshToken, AuthService.refreshToken.bind(AuthService));
