/* eslint-disable @typescript-eslint/no-unnecessary-condition,@typescript-eslint/no-misused-spread */
import type { ReadonlySignal, Signal } from '@preact/signals-react';
import {
  batch as _batch,
  computed as _computed,
  effect,
  signal as _signal,
  untracked,
  useComputed,
  useSignal,
  useSignalEffect
} from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime';
import type { DeepSignal } from 'deepsignal/react';
import { deepSignal as _deepSignal, peek, useDeepSignal } from 'deepsignal/react';
import { setByPath } from '@/shared/lib/independent/set-by-path';
// noinspection ES6UnusedImports
import {} from '@redux-devtools/extension';


type Args = {
  devtools?: {
    storeName?: string
  },
};

export function createSignals({ devtools }: Args = {}) {
  const isClient = typeof window !== 'undefined';
  const browserExtension = isClient ? window.__REDUX_DEVTOOLS_EXTENSION__ : undefined;
  const actionStack: string[] = [];
  const payloadStack: unknown[] = [];
  let isInit = true;
  let connection: ReturnType<NonNullable<typeof window['__REDUX_DEVTOOLS_EXTENSION__']>['connect']>;

  // Main signal-holder for tracking other signals values in effect below
  const tracking = devtools && browserExtension
    ? _signal<Record<string, ReadonlySignal<unknown> | DeepSignal<object | Array<unknown>>>>({})
    : undefined;

  // Function returns current state of all tracked signals
  const getState = () => {
    if (!tracking) return { error: 'Tracking is not enabled' };
    const _tracking = tracking.value;
    return Object.keys(_tracking).reduce<Record<string, unknown>>((acc, key) => {
      const signal = _tracking[key];
      if (typeof signal === 'object' && signal) {
        return setByPath(acc, key, 'value' in signal ? signal.value : { ...signal });
      }
      return acc;
    }, {});
  };

  // Function sends current state to Redux DevTools
  const sendState = ({ isBatched }: { isBatched?: boolean } = {}) => {
    if (!connection) return;
    if (isInit) connection.init(getState());
    else {
      let type = actionStack.length > 0 ? actionStack.join(' > ') : 'anonymous';
      if (isBatched) type = `${type} (batched)`;
      const payload = payloadStack[actionStack.length - 1];
      connection.send({ type, payload } as never, getState());
    }
  };

  // Creates an effect that automatically sends state to Redux DevTools
  if (tracking && browserExtension) {
    connection = browserExtension.connect({ name: devtools?.storeName });
    // To avoid changes of tracking signal at app entire code initialization,
    // use setTimeout to create effect in the next event loop macro task.
    setTimeout(() => {
      effect(sendState);
      isInit = false;
    });
  }

  // Function to track a signal and optionally set its path in the tracking object
  function track<
    TData,
    TSignal extends Signal<TData> | ReadonlySignal<TData> | DeepSignal<TData>,
  >(signal1: TSignal, path?: string): TSignal {
    // @ts-expect-error - ignore for simplicity
    if (tracking && path) tracking.value = { ...tracking.peek(), [path]: signal1 };
    return signal1;
  }

  function signal<T>(value: T, name?: string): Signal<T> {
    return track(_signal(value), name);
  }

  function computed<T>(fn: () => T, name?: string): ReadonlySignal<T> {
    return track(_computed(fn), name);
  }

  function deepSignal<T extends object>(obj: T, name?: string): DeepSignal<T> {
    return track(_deepSignal(obj), name);
  }

  function batch<T>(fn: () => T, action?: string, payload?: unknown): T {
    if (action) actionStack.push(action);
    if (payload !== undefined) payloadStack.push(payload);

    const result = _batch(fn);
    if (actionStack.length > 1)
      untracked(() => sendState({ isBatched: true }));

    if (action) actionStack.pop();
    if (payload !== undefined) payloadStack.pop();
    return result;
  }

  return {
    signal,
    computed,
    deepSignal,

    useSignal,
    useSignals,
    useDeepSignal,
    useComputed,
    useSignalEffect,
    effect,
    untracked,
    batch,
    peek,
  };
}
