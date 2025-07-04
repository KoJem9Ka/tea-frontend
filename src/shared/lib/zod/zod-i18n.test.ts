import { describe, expect, it } from 'vitest';
import { z } from 'zod/v4';
import { russianErrorMap } from '@/shared/lib/zod/zod-i18n.ts';


describe('Zod Russian Localization', () => {
  it('should show Russian error for required string field', () => {
    const schema = z.string({ error: russianErrorMap });
    const result = schema.safeParse(undefined);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Обязательное поле');
  });

  it('should show Russian error for invalid email', () => {
    const schema = z.email({ error: russianErrorMap });
    const result = schema.safeParse('invalid-email');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Неверный Email');
  });

  it('should show Russian error for string too short', () => {
    const schema = z.string({ error: russianErrorMap }).min(5, { error: russianErrorMap });
    const result = schema.safeParse('abc');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Минимум 5 символов');
  });

  it('should show Russian error for number too small', () => {
    const schema = z.number({ error: russianErrorMap }).min(18, { error: russianErrorMap });
    const result = schema.safeParse(15);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Минимум 18');
  });

  it('should show Russian error for invalid URL', () => {
    const schema = z.url({ error: russianErrorMap });
    const result = schema.safeParse('not-a-url');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Неверный URL');
  });

  it('should show Russian error for wrong type', () => {
    const schema = z.string({ error: russianErrorMap });
    const result = schema.safeParse(123);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Ожидался тип строка, получено число');
  });

  it('should show Russian error for array too small', () => {
    const schema = z.array(z.string(), { error: russianErrorMap }).min(3, { error: russianErrorMap });
    const result = schema.safeParse(['a', 'b']);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Минимум 3 элемента');
  });

  it('should show Russian error for number too big', () => {
    const schema = z.number({ error: russianErrorMap }).max(100, { error: russianErrorMap });
    const result = schema.safeParse(150);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Максимум 100');
  });

  it('should show Russian error for invalid enum value', () => {
    const schema = z.enum(['red', 'green', 'blue'], { error: russianErrorMap });
    const result = schema.safeParse('yellow');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Неверное значение');
  });
});
