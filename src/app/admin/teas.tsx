import { createFileRoute, notFound } from '@tanstack/react-router';


export const Route = createFileRoute('/admin/teas')({
  component: RouteComponent,
  beforeLoad: () => notFound(),
});

function RouteComponent() {
  // Unimplemented
  // Admin's teas dashboard page: teas as table for PC
  return <div />;
}
