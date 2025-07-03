import type { z } from 'zod/v4';


type Schema = { [key: string]: z.ZodType };

type ZodLocalStorage<T extends Schema> = {
  [K in keyof T]: {
    set(data: T[K]['_output']): void,
    getSafe(): z.ZodSafeParseResult<T[K]['_output']> | null,
    getOrNull(): T[K]['_output'] | null,
    getOr(defaultValue: T[K]['_output']): T[K]['_output'],
    remove(): void,
  }
};


export function makeLocalStorageSafe<T extends Schema>(prefix: string, schema: T): ZodLocalStorage<T> {
  const localStorageSafe: ZodLocalStorage<T> = {} as ZodLocalStorage<T>;

  const fullKey = (key: string) => `${prefix}.${key}`;

  for (const key in schema) {
    type K = typeof key;
    localStorageSafe[key] = {

      set(data): void {
        localStorage.setItem(fullKey(key), JSON.stringify(data));
      },

      getSafe() {
        const str = localStorage.getItem(fullKey(key));
        if (!str) return null;
        const parsed = JSON.parse(str);
        return schema[key]!.safeParse(parsed) as z.ZodSafeParseResult<T[K]['_output']>;
      },

      getOrNull() {
        try {
          const str = localStorage.getItem(fullKey(key));
          if (!str) return null;
          return schema[key]!.parse(JSON.parse(str));
        } catch {
          localStorage.removeItem(fullKey(key));
          return null;
        }
      },

      getOr(defaultValue: T[K]['_output']) {
        const value = this.getOrNull();
        return value ?? defaultValue;
      },

      remove(): void {
        localStorage.removeItem(fullKey(key));
      },

    };
  }

  return localStorageSafe;
}
