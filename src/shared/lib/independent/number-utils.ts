export function increment<T extends bigint | number>(value: T): T {
  return typeof value === 'number' ? (value + 1) as T
    : typeof value === 'bigint' ? (value + 1n) as T
      : value;
}

export function decrement<T extends bigint | number>(value: T): T {
  return typeof value === 'number' ? (value - 1) as T
    : typeof value === 'bigint' ? (value - 1n) as T
      : value;
}
