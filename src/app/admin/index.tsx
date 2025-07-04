import { createFileRoute, notFound } from '@tanstack/react-router';


export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  beforeLoad: () => notFound(),
});

function RouteComponent() {
  // Unimplemented
  // Admin's main dashboard page: here can be card links of available admin pages
  return <div />;
}
