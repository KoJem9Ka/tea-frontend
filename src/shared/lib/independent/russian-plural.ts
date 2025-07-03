/**
 * @param number
 * @param one 1/21 'секунду', 'минуту', 'час', 'балл'
 * @param few 2/22 'секунды', 'минуты', 'часа', 'балла'
 * @param many 5/11/20 'секунд', 'минут', 'часов', 'баллов'
 */
export function russianPlural(number: number, one: string, few: string, many: string): string {
  if (!Number.isFinite(number)) return many;
  const n = Math.abs(Math.floor(number));
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function ruSymbolPlural(number: number | bigint) {
  return russianPlural(Number(number), 'символ', 'символа', 'символов');
}

export function ruElementPlural(number: number | bigint) {
  return russianPlural(Number(number), 'элемент', 'элемента', 'элементов');
}
