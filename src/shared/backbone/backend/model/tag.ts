import { z } from 'zod/v4';


export type Tag = z.infer<typeof Tag>;
export const Tag = z.object({
  id: z.uuid(),
  name: z.string().trim().nonempty({ error: 'Обязательное поле' }),
  color: z.string().trim().nonempty({ error: 'Обязательное поле' }).regex(/^#[0-9A-Fa-f]{6}$/, { error: 'Неверный формат цвета' }),
});

export type TagUpsert = z.infer<typeof TagUpsert>;
export const TagUpsert = Tag.omit({ id: true }).extend({
  id: z.uuid().optional(),
});
