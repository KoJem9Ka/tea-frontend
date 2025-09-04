import { type NavigateOptions, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { RequireExactlyOne } from 'type-fest';


export type UseBackFnArgs = RequireExactlyOne<{
  route: NavigateOptions;
  fallback: NavigateOptions;
}>

export function useBackFn(args: UseBackFnArgs) {
  const router = useRouter();

  const goBack = useCallback(async (): Promise<void> => {
    if (args.route) await router.navigate(args.route);
    else if (router.history.canGoBack()) router.history.back();
    else await router.navigate(args.fallback);
  }, [args.fallback, args.route, router]);

  return { goBack };
}
