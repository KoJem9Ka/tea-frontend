import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/admin/teas')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /admin/tea!</div>;
}
