export function promiseWithResolvers<T>(): PromiseWithResolvers<T> {
  if (typeof Promise.withResolvers !== 'undefined') {
    return Promise.withResolvers<T>();
  }

  const result = {} as PromiseWithResolvers<T>;
  result.promise = new Promise<T>((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}
