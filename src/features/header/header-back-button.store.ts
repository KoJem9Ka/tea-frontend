import type { UseBackFnArgs } from '@/features/header/hooks/useBackFn.ts';
import { batch, deepSignal } from '@/shared/backbone/signals';


export type BackButtonEnableArgs = UseBackFnArgs;
type BackButtonEnableWithIdArgs = BackButtonEnableArgs & { id: string };
type BackButtonEnableWithIdAndIsDeletedArgs = BackButtonEnableWithIdArgs & { isDeleted?: boolean };

type HeaderBackButtonStoreRaw = {
  target: BackButtonEnableWithIdArgs | null;
  targets: BackButtonEnableWithIdAndIsDeletedArgs[];
  enable: (args: BackButtonEnableWithIdArgs) => VoidFunction;
}
type HeaderBackButtonStore = Readonly<HeaderBackButtonStoreRaw>

function createHeaderBackButtonStore(): HeaderBackButtonStore {
  const store = deepSignal<HeaderBackButtonStoreRaw>({
    targets: [],

    get target() {
      const targetsNotDeleted: BackButtonEnableWithIdAndIsDeletedArgs[] = this.targets.filter(t => !t.isDeleted);
      return targetsNotDeleted[targetsNotDeleted.length - 1] ?? null;
    },

    enable(route) {
      const alreadyAdded = store.targets.find(r => r.id === route.id);
      batch(() => {
        if (alreadyAdded) delete alreadyAdded.isDeleted;
        else store.targets.push(route);
        store.targets = store.targets.filter(r => !r.isDeleted);
      }, 'HeaderBackButtonStore.enable', route);
      return () => batch(() => {
        const target = store.targets.find(r => r.id === route.id);
        if (!target) return;
        target.isDeleted = true;
      }, 'HeaderBackButtonStore.reset', route);
    },
  }, 'HeaderBackButtonStore');

  return store;
}

export const HeaderBackButtonStore = createHeaderBackButtonStore();
