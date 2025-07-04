import { createFileRoute, Outlet } from '@tanstack/react-router';
import { adminRoleGuard } from '@/features/auth';


export const Route = createFileRoute('/admin')({
  beforeLoad: adminRoleGuard,
  component: Outlet,
});
