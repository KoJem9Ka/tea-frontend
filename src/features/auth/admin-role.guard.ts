/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unnecessary-type-parameters */
import { type BeforeLoadContextOptions, redirect } from '@tanstack/react-router';
import { AuthStore } from '@/features/auth/auth.store';
import { ROUTES } from '@/shared/backbone/tanstack-router/ROUTES.ts';


export function adminRoleGuard<T extends BeforeLoadContextOptions<any, any, any, any, any>>(ctx: T) {
  if (ctx.cause === 'preload') return;
  if (!AuthStore.isAdmin) return redirect(ROUTES.HOME);
}
