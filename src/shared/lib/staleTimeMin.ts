export function staleTimeMin(...values: unknown[]): number | undefined {
  return Math.min(...values.filter((v) => typeof v === 'number'));
}
