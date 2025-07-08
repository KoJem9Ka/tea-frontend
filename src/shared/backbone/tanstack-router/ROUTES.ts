export const ROUTES = {
  HOME: { to: '/' } as const,
  TEA_DETAILS: (id: string) => ({ to: '/tea/$id', params: { id } }) as const,
  ADMIN_TEAS: { to: '/admin/teas' } as const,
  ADMIN_TEA_EDIT: (id: string) => ({ to: '/admin/tea/$id', params: { id } }) as const,
  ADMIN_TEA_NEW: ({ to: '/admin/tea/create' }) as const,
  ADMIN_CATEGORIES: { to: '/admin/categories' } as const,
  ADMIN_TAGS: { to: '/admin/tags' } as const,
  ADMIN_UNITS: { to: '/admin/units' } as const,
};
