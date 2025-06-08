import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { queryClient } from '@/shared/backbone/tanstack-query/query-client';
import { ErrorRouteComponent } from '@/shared/components/routes/ErrorRouteComponent';
import { NotFoundRouteComponent } from '@/shared/components/routes/NotFoundRouteComponent';


export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'viewport',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ErrorRouteComponent,
  defaultNotFoundComponent: NotFoundRouteComponent,
  // defaultPendingMinMs: 0,
  // defaultPendingMs: 0,
});


export type router = typeof router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
