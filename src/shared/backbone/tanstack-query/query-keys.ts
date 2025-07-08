/* eslint-disable boundaries/entry-point,boundaries/element-types */
import type { PartialDeep } from 'type-fest';
import type { CategoryOneReqParams } from '@/features/categories/categories.api';
import type { TeaOneReqParams, TeasListReqQueryFilters } from '@/features/tea/tea.api';
import { signal } from '@/shared/backbone/signals';


export const $QUERY_KEYS_PRIVATE_USER = signal('');

export const QUERY_KEYS = {
  PRIVATE: () => [{ username: $QUERY_KEYS_PRIVATE_USER.value, private: true }] as const,
  PRIVATE_ANY: () => [{}] as const,
  PRIVATE_TRUE: [{ private: true }] as const,

  TEA: {
    ROOT: () => [...QUERY_KEYS.PRIVATE_ANY(), 'TEA'] as const,
    PRIVATE_ROOT: () => [...QUERY_KEYS.PRIVATE(), 'TEA'] as const,
    LIST: (query: TeasListReqQueryFilters = {}) => [...QUERY_KEYS.TEA.PRIVATE_ROOT(), 'LIST', query] as const,
    ONE: (params: TeaOneReqParams) => [...QUERY_KEYS.TEA.PRIVATE_ROOT(), 'ONE', params] as const,
  },

  CATEGORY: {
    ROOT: () => ['CATEGORY'] as const,
    LIST: () => [...QUERY_KEYS.CATEGORY.ROOT(), 'LIST'] as const,
    ONE: (params: CategoryOneReqParams) => [...QUERY_KEYS.CATEGORY.ROOT(), 'ONE', params] as const,
  },

  TAG: {
    ROOT: () => ['TAG'] as const,
    LIST: () => [...QUERY_KEYS.TAG.ROOT(), 'LIST'] as const,
  },

  TEA_UNIT: {
    ROOT: () => ['TEA_UNIT'] as const,
    LIST: () => [...QUERY_KEYS.TEA_UNIT.ROOT(), 'LIST'] as const,
  },
} as const;

export const MUTATION_KEYS = {
  TEA: {
    SET_FAVOURITE: () => [...QUERY_KEYS.TEA.PRIVATE_ROOT(), 'SET_FAVOURITE'] as const,
    EVALUATE: () => [...QUERY_KEYS.TEA.PRIVATE_ROOT(), 'EVALUATE'] as const,
    UPSERT: () => [...QUERY_KEYS.TEA.ROOT(), 'UPSERT'] as const,
    DELETE: () => [...QUERY_KEYS.TEA.ROOT(), 'DELETE'] as const,
  },

  CATEGORY: {
    UPSERT: () => [...QUERY_KEYS.CATEGORY.ROOT(), 'UPSERT'] as const,
    DELETE: () => [...QUERY_KEYS.CATEGORY.ROOT(), 'DELETE'] as const,
  },

  TAG: {
    UPSERT: () => [...QUERY_KEYS.TAG.ROOT(), 'UPSERT'] as const,
    DELETE: () => [...QUERY_KEYS.TAG.ROOT(), 'DELETE'] as const,
  },

  TEA_UNIT: {
    UPSERT: () => [...QUERY_KEYS.TEA_UNIT.ROOT(), 'UPSERT'] as const,
    DELETE: () => [...QUERY_KEYS.TEA_UNIT.ROOT(), 'DELETE'] as const,
  },
} as const;


type GetQueryKeysUnion<T> =
// Is T a function?
  T extends (...args: never[]) => infer R
    // Then ensure that it returns tuple, because all functions must return tuple of query keys
    ? R extends ReadonlyArray<unknown> ? R : never
    // Else if T is a tuple of query keys
    : T extends ReadonlyArray<unknown> ? T
      // Else if T is an object, recursively get the union of its properties
      : T extends Record<string, unknown>
        ? { [K in keyof T]: GetQueryKeysUnion<T[K]> }[keyof T]
        : never;

type PartialArrayElements<Tuple extends ReadonlyArray<unknown>> = {
  [Key in keyof Tuple]?: PartialDeep<Tuple[Key]>;
};

export type QueryKeys = PartialArrayElements<GetQueryKeysUnion<typeof QUERY_KEYS>>;
export type MutationKeys = PartialArrayElements<GetQueryKeysUnion<typeof MUTATION_KEYS>>;
