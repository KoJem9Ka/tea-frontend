export function kyUrl(url: string, params?: Record<string, string | number>): string {
  const _url = url.replace(/^\/+/, '');

  if (params) return Object.entries(params).reduce((acc, [key, value]) => {
    if (!/:queryParam(?=\/|\?|$)/.test(acc)) {
      throw new Error(`Can't prepare API url: ${key} not found in ${_url}`);
    }
    return acc.replace(`:${key}`, `${value}`);
  }, _url);

  return _url;
}
