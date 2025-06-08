import { AuthApi, type AuthMiniAppReqBody, type AuthReqBody } from '@/features/auth/auth.api';
import { AuthStore } from '@/features/auth/auth.store';
import { backendClientEmitter, BackendClientEvent } from '@/shared/backbone/backend/backend-client';
import { config } from '@/shared/backbone/config';
import { promiseWithResolvers } from '@/shared/lib/independent/promise-with-resolvers';


type AuthService = {
  auth: (body: AuthReqBody) => Promise<void>,
  authMiniApp: (telegram: AuthReqBody, body: AuthMiniAppReqBody) => Promise<void>,
  refreshToken: () => Promise<void>,
  telegramLogin: () => Promise<void>,
}

export const AuthService: AuthService = {
  async auth(body) {
    const { accessToken } = await AuthApi.auth(body);
    AuthStore.loggedIn({ telegram: body, accessToken });
  },
  async authMiniApp(telegram, body) {
    const { accessToken } = await AuthApi.authMiniApp(body);
    AuthStore.loggedIn({ telegram, accessToken });
  },
  async refreshToken() {
    if (refreshTokenPromise) return refreshTokenPromise;
    const resolvers = promiseWithResolvers<Awaited<ReturnType<typeof AuthService.refreshToken>>>();
    refreshTokenPromise = resolvers.promise;
    try {
      const { accessToken } = await AuthApi.refreshToken();
      AuthStore.updateToken({ accessToken });
    } catch (err) {
      resolvers.reject(err);
    } finally {
      refreshTokenPromise = null;
      resolvers.resolve();
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
