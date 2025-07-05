import type { z } from 'zod/v4';

/**
 * Определяет, является ли поле в Zod схеме обязательным
 * @param schema - Zod схема объекта
 * @param fieldName - имя поля для проверки
 * @returns true если поле обязательное, false если опциональное
 */
function isFieldRequired<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldName: keyof z.infer<z.ZodObject<T>>,
): boolean {
  try {
    // Пытаемся распарсить объект без этого поля
    const testData: Record<string, unknown> = {};
    const result = schema.safeParse(testData);

    if (result.success) {
      // Если парсинг прошёл успешно без поля, значит поле опциональное
      return false;
    }

    // Проверяем, есть ли ошибка связанная с отсутствием этого поля
    return result.error.issues.some(issue =>
      issue.path.includes(fieldName as string) &&
      issue.code === 'invalid_type',
    );
  } catch {
    // В случае ошибки считаем поле обязательным (безопасный fallback)
    return true;
  }
}

/**
 * Генерирует placeholder для поля формы на основе его обязательности
 * @param schema - Zod схема объекта
 * @param fieldName - имя поля
 * @param basePlaceholder - базовый placeholder без указания обязательности
 * @param options - дополнительные опции для настройки @returns placeholder с указанием обязательности
 */
export function getFieldPlaceholder<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  fieldName: keyof z.infer<z.ZodObject<T>>,
  basePlaceholder: string = '',
  options: {
    requiredText?: string;
    optionalText?: string;
    showNullable?: boolean;
    format?: 'suffix' | 'prefix' | 'brackets';
  } = {},
): string {
  const {
    requiredText = 'Обязательное',
    optionalText = 'Необязательное',
    format = 'suffix',
  } = options;

  const isRequired = isFieldRequired(schema, fieldName);

  const statusText = isRequired ? requiredText : optionalText;

  switch (format) {
  case 'prefix':
    return `(${statusText}) ${basePlaceholder}`;
  case 'brackets':
    return `${basePlaceholder} [${statusText}]`;
  case 'suffix':
  default:
    return basePlaceholder + (basePlaceholder ? ` (${statusText})` : statusText);
  }
}
