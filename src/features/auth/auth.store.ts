import { jwtDecode } from 'jwt-decode';
import type { ReadonlyDeep } from 'type-fest';
import { z } from 'zod/v4';
import { TelegramUserDataFromWidget } from '@/features/auth/types';
import { AccessTokenDecoded, backendClientEmitter, BackendClientEvent, backendClientSettings } from '@/shared/backbone/backend/backend-client';
import { batch, deepSignal, effect } from '@/shared/backbone/signals';
import { $QUERY_KEYS_PRIVATE_USER } from '@/shared/backbone/tanstack-query/query-keys';
import { safeSync } from '@/shared/lib/independent/safe';


const User = z.object({
  telegram: TelegramUserDataFromWidget,
  accessToken: z.string(),
  accessTokenDecoded: AccessTokenDecoded,
});
type User = z.infer<typeof User>;


type AuthStoreRaw = {
  user: User | null;
  readonly isAdmin: boolean;
  readonly isAuthorized: boolean;
  readonly loggedIn: (user: Pick<User, 'telegram' | 'accessToken'>) => void;
  readonly updateToken: (data: Pick<User, 'accessToken'>) => void;
  readonly loggedOut: () => void;
  readonly dispose: () => void;
};
type AuthStore = ReadonlyDeep<AuthStoreRaw>

function createAuthStore(): AuthStore {
  const getInitialUser = () => {
    const userString = localStorage.getItem('auth.user');
    if (!userString) return null;
    const userUnchecked = safeSync<unknown>(() => JSON.parse(userString));
    if (!userUnchecked.ok) return null;
    const user = User.safeParse(userUnchecked.data);
    if (!user.success) return null;
    return user.data;
  };

  const store = deepSignal<AuthStoreRaw>({
    user: getInitialUser(),
    get isAdmin() {
      return this.user?.accessTokenDecoded.role === 'admin';
    },
    get isAuthorized() {
      return !!this.user;
    },
    loggedIn(user) {
      batch(() => {
        store.user = {
          ...user,
          accessTokenDecoded: jwtDecode<AccessTokenDecoded>(user.accessToken),
        };
      }, 'AuthStore.loggedIn');
    },
    updateToken(data) {
      batch(() => {
        if (!store.user) throw new Error('Cannot update token: user is not logged in');
        store.user.accessToken = data.accessToken;
        store.user.accessTokenDecoded = jwtDecode<AccessTokenDecoded>(data.accessToken);
      }, 'AuthStore.updateToken');
    },
    loggedOut() {
      batch(() => {
        store.user = null;
      }, 'AuthStore.loggedOut');
    },
    dispose() {
      disposeEffect();
      disposeFromEmitter();
    },
  }, 'AuthStore');

  const disposeFromEmitter = backendClientEmitter.on(BackendClientEvent.Logout, store.loggedOut);

  const disposeEffect = effect(() => {
    $QUERY_KEYS_PRIVATE_USER.value = store.user?.telegram.username ?? '';

    backendClientSettings.accessToken = store.user?.accessToken ?? null;
    backendClientSettings.accessTokenDecoded = store.user?.accessTokenDecoded ?? null;

    if (store.user) localStorage.setItem('auth.user', JSON.stringify(store.user));
    else localStorage.removeItem('auth.user');
  });

  return store;
}

export const AuthStore = createAuthStore();
