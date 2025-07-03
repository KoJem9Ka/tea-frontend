import '@total-typescript/ts-reset';
import 'telegram-mini-app';
import type { RequiredKeysOf } from 'type-fest';


export type AdditionalQueryOptions<T extends object> = Omit<T, RequiredKeysOf<T>>;

export type MaybePromise<T = void> = T | Promise<T>;
