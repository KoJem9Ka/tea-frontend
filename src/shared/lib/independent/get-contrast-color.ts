/**
 * 1. Парсит hex в RGB
 * 2. Считает яркость по формуле
 * 3. Возвращает чёрный или белый цвет для читаемости
 */
export function getContrastColor(hex: string): string {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#000000' : '#FFFFFF';
}
