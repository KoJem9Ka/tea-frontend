import { isEqual, isPlainObject } from 'lodash-es';
import { useEffect, useRef } from 'react';

/**
 * Structure representing a change in object values.
 */
type Diff = { path: string; before: unknown; after: unknown };

/**
 * Recursively computes differences between two unknown values.
 */
const getDifferences = (obj1: unknown, obj2: unknown, path = ''): Diff[] => {
  const diffs: Diff[] = [];
  // Compare primitive or mismatched types
  if (!isPlainObject(obj1) || !isPlainObject(obj2)) {
    if (!isEqual(obj1, obj2)) {
      diffs.push({ path, before: obj1, after: obj2 });
    }
    return diffs;
  }
  const map1 = obj1 as Record<string, unknown>;
  const map2 = obj2 as Record<string, unknown>;
  const keys = new Set([...Object.keys(map1), ...Object.keys(map2)]);
  for (const key of keys) {
    const newPath = path ? `${path}.${key}` : key;
    diffs.push(...getDifferences(map1[key], map2[key], newPath));
  }
  return diffs;
};

/**
 * Logs detailed differences between previous and current values whenever they change.
 */
export function useDebugDifferenceDeep(value: unknown, label = 'value'): void {
  const prevRef = useRef<unknown>(value);
  const prev = prevRef.current;
  useEffect(() => {
    if (!isEqual(prev, value)) {
      const diffs = getDifferences(prev, value);
      console.log(`${label} changed:`, diffs);
    } else if (prev !== value) {
      console.log(`${label} equal, but reference changed`);
    }
    prevRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, label]);
}
