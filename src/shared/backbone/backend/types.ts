import { z } from 'zod/v4';


export function PaginatedResult<T extends z.ZodType>(schema: T) {
  return z.object({
    total: z.number().min(0),
    items: z.array(schema),
  });
}

export type AppError = z.infer<typeof AppError>;
export const AppError = z.object({
  error: z.string(),
});
