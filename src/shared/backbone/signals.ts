import { createSignals } from '@/shared/lib/independent/create-signals';


export const {
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
} = createSignals({
  devtools: {
    storeName: `TeaApp (${location.hostname})`,
  },
});
