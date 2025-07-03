import { isTMA } from '@telegram-apps/sdk-react';
import { jwtDecode } from 'jwt-decode';
import type { ReadonlyDeep } from 'type-fest';
import { type AccessTokenDecoded, backendClientEmitter, BackendClientEvent, backendClientSettings } from '@/shared/backbone/backend/backend-client';
import { batch, deepSignal, effect } from '@/shared/backbone/signals';
import { $QUERY_KEYS_PRIVATE_USER } from '@/shared/backbone/tanstack-query/query-keys';
import { localStorageSafe } from '@/shared/lib/localStorageSafe.ts';
import { type User } from '@/shared/types/auth/user.ts';


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
  const store = deepSignal<AuthStoreRaw>({
    user: isTMA() ? null : localStorageSafe.user.getOrNull(),
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
