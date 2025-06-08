/**
 * Sets object value by the deep string path.
 *
 * @param obj - object in which need to set the value
 * @param path - string path, e.g. "foo.bar.prop1"
 * @param value - value to set
 * @returns mutated source object
 */
export function setByPath<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown,
): T {
  if (!path) return obj;

  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;
    const isLastKey = i === keys.length - 1;

    if (isLastKey) {
      current[key] = value;
    } else {
      let currentElement = current[key];
      if (currentElement === undefined) {
        currentElement = {};
        current[key] = currentElement;
      }
      current = currentElement as Record<string, unknown>;
    }
  }

  return obj;
}
