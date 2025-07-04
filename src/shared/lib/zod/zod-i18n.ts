import type { z } from 'zod/v4';
import { decrement, increment } from '@/shared/lib/independent/number-utils.ts';
import { ruElementPlural, ruSymbolPlural } from '@/shared/lib/independent/russian-plural.ts';


// Экспортируем функцию для использования в схемах: z.string({ error: russianErrorMap })
export const russianErrorMap: z.core.$ZodErrorMap = (issue): string => {
  let message: string;

  switch (issue.code) {
  case 'invalid_type':
    if (issue.input === undefined) {
      message = 'Обязательное поле';
    } else if (issue.input === null) {
      message = 'Обязательное поле';
    } else {
      const expected = 'expected' in issue ? issue.expected : 'unknown';
      const received = typeof issue.input;
      message = `Ожидался тип ${getTypeName(expected)}, получено ${getTypeName(received)}`;
    }
    break;

  case 'invalid_value':
    if ('expected' in issue) {
      message = `Неверное значение, ожидалось ${JSON.stringify(issue.expected)}`;
    } else {
      message = 'Неверное значение';
    }
    break;

  case 'unrecognized_keys':
    if ('keys' in issue && Array.isArray(issue.keys)) {
      message = `Неверные ключи в объекте: ${issue.keys.join(', ')}`;
    } else {
      message = 'Неверные ключи в объекте';
    }
    break;

  case 'invalid_union':
    message = 'Неверное значение';
    break;

  case 'too_small':
    if ('minimum' in issue) {
      const minimum = typeof issue.minimum === 'bigint' ? Number(issue.minimum) : issue.minimum;
      const exact = 'exact' in issue ? issue.exact : false;
      const inclusive = 'inclusive' in issue ? issue.inclusive : true;
      const origin = 'origin' in issue ? issue.origin : 'unknown';

      if (origin === 'array') {
        message = exact
          ? `Должно быть ровно ${minimum} ${ruElementPlural(minimum)}`
          : inclusive
            ? `Минимум ${minimum} ${ruElementPlural(minimum)}`
            : `Минимум ${increment(minimum)} ${ruElementPlural(minimum)}`;
      } else if (origin === 'string') {
        message = exact
          ? `Должно быть ровно ${minimum} ${ruSymbolPlural(minimum)}`
          : inclusive
            ? `Минимум ${minimum} символов`
            : `Минимум ${increment(minimum)} символов`;
      } else if (origin === 'number') {
        message = exact
          ? `Число должно быть ровно ${minimum}`
          : inclusive
            ? `Минимум ${minimum}`
            : `Минимум ${increment(minimum)}`;
      } else if (origin === 'date') {
        message = exact
          ? `Дата должна быть ${new Date(minimum).toLocaleString('ru')}`
          : inclusive
            ? `Минимум ${new Date(minimum).toLocaleString('ru')}`
            : `Минимум ${new Date(increment(minimum)).toLocaleString('ru')}`;
      } else {
        message = 'Неверное значение';
      }
    } else {
      message = 'Значение слишком маленькое';
    }
    break;

  case 'too_big':
    if ('maximum' in issue) {
      const maximum = typeof issue.maximum === 'bigint' ? Number(issue.maximum) : issue.maximum;
      const exact = 'exact' in issue ? issue.exact : false;
      const inclusive = 'inclusive' in issue ? issue.inclusive : true;
      const origin = 'origin' in issue ? issue.origin : 'unknown';

      if (origin === 'array') {
        message = exact
          ? `Должно быть ровно ${maximum} ${ruElementPlural(maximum)}`
          : inclusive
            ? `Максимум ${maximum} ${ruElementPlural(maximum)}`
            : `Максимум ${decrement(maximum)} ${ruElementPlural(maximum)}`;
      } else if (origin === 'string') {
        message = exact
          ? `Должно быть ровно ${maximum} ${ruSymbolPlural(maximum)}`
          : inclusive
            ? `Максимум ${maximum} ${ruSymbolPlural(maximum)}`
            : `Максимум ${decrement(maximum)} ${ruSymbolPlural(maximum)}`;
      } else if (origin === 'number') {
        message = exact
          ? `Число должно быть ровно ${maximum}`
          : inclusive
            ? `Максимум ${maximum}`
            : `Максимум ${decrement(maximum)}`;
      } else if (origin === 'date') {
        message = exact
          ? `Дата должна быть ${new Date(maximum).toLocaleString('ru')}`
          : inclusive
            ? `Максимум ${new Date(maximum).toLocaleString('ru')}`
            : `Максимум ${new Date(decrement(maximum)).toLocaleString('ru')}`;
      } else {
        message = 'Неверное значение';
      }
    } else {
      message = 'Значение слишком большое';
    }
    break;

  case 'custom':
    message = 'Неверное значение';
    break;

  case 'not_multiple_of':
    if ('multipleOf' in issue) {
      message = `Число должно быть кратно ${issue.multipleOf}`;
    } else {
      message = 'Число должно быть кратным';
    }
    break;

  case 'invalid_format':
    if ('format' in issue && typeof issue.format === 'string') {
      message = `Неверный ${getValidationName(issue.format)}`;
    } else {
      message = 'Неверный формат';
    }
    break;

  default:
    message = 'Неверное значение';
    break;
  }

  return message;
};

function getTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    function: 'функция',
    number: 'число',
    string: 'строка',
    nan: 'NaN',
    integer: 'целое число',
    float: 'число с плавающей точкой',
    boolean: 'булево значение',
    date: 'дата',
    bigint: 'bigint',
    undefined: 'undefined',
    symbol: 'символ',
    null: 'null',
    array: 'массив',
    object: 'объект',
    unknown: 'unknown',
    promise: 'promise',
    void: 'void',
    never: 'never',
    map: 'хеш-таблица',
    set: 'множество',
  };

  return typeNames[type] || type;
}

function getValidationName(validation: string): string {
  const validationNames: Record<string, string> = {
    email: 'Email',
    url: 'URL',
    uuid: 'UUID',
    cuid: 'CUID',
    regex: 'регулярное выражение',
    datetime: 'дата и время',
  };

  return validationNames[validation] || validation;
}
