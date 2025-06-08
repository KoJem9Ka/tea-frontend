import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/admin/tags')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello /admin/tags!</div>
}
