export const ROUTES = {
  HOME: { to: '/' } as const,
  TEA_DETAILS: (id: string) => ({ to: '/tea/$id', params: { id } }) as const,
  ADMIN_TEAS: { to: '/admin/teas' } as const,
  ADMIN_TEA_EDIT: (id: string) => ({ to: '/admin/tea/$id', params: { id } }) as const,
  ADMIN_TEA_NEW: ({ to: '/admin/tea/create' }) as const,
};
