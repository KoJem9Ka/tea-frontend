import { z } from 'zod/v4';


export type Category = z.infer<typeof Category>;
export const Category = z.object({
  id: z.uuid(),
  name: z.string().trim().nonempty({ error: 'Обязательное поле' }),
  description: z.string().trim().transform(val => val || undefined).nullish(),
});

export type CategoryUpsert = z.infer<typeof CategoryUpsert>;
export const CategoryUpsert = Category.omit({ id: true }).extend({
  id: z.uuid().optional(),
});
