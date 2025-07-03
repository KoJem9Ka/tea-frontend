import { z } from 'zod/v4';
import { Tag } from '@/shared/backbone/backend/model/tag';


export type Tea = z.infer<typeof Tea>;
export const Tea = z.object({
  id: z.uuid(),
  name: z.string().nonempty({ error: 'Обязательное поле' }),
  servePrice: z.number().positive({ error: issue => Number(issue.input) < 0 ? 'Должно быть положительным' : 'Обязательное поле' }),
  weightPrice: z.number().positive({ error: issue => Number(issue.input) < 0 ? 'Должно быть положительным' : 'Обязательное поле' }),
  description: z.string().nonempty({ error: 'Обязательное поле' }).optional(),
  categoryId: z.uuid({ error: issue => !issue.input ? 'Обязательное поле' : 'Неверный формат' }),
  tags: z.array(Tag).optional(),
  isHidden: z.boolean().optional(),
});

export type TeaUpsert = z.infer<typeof TeaUpsert>;
export const TeaUpsert = Tea.omit({ id: true, tags: true }).extend({
  id: z.uuid().optional(),
  tagIds: z.array(z.uuid()).optional(),
});

export function teaToInput(tea: Tea): TeaUpsert {
  const teaInput = {
    ...tea,
    tagIds: tea.tags?.map(tag => tag.id),
  };
  delete teaInput.tags;
  return teaInput;
}

export type TeaWithRating = z.infer<typeof TeaWithRating>;
export const TeaWithRating = Tea.extend({
  /* Персональный рейтинг пользователя (1-10) */
  rating: z.number().min(0).max(10).optional(),
  /* Средний рейтинг по всем пользователям */
  averageRating: z.number().min(0).max(10).optional(),
  /* Персональная заметка пользователя */
  note: z.string().optional(),
  /* Флаг, что чай в избранном */
  isFavourite: z.boolean().optional(),
});
