import { type NavigateOptions, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { RequireExactlyOne } from 'type-fest';


export type UseBackFnArgs = RequireExactlyOne<{
  route: NavigateOptions;
  fallback: NavigateOptions;
}>

export function useBackFn(args: UseBackFnArgs) {
  const router = useRouter();

  const goBack = useCallback((): void => {
    if (args.route) return void router.navigate(args.route);
    else if (router.history.canGoBack()) router.history.back();
    else void router.navigate(args.fallback);
  }, [args.fallback, args.route, router]);

  return { goBack };
}
