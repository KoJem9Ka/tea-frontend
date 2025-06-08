/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
export type SafeOk<TData> = { ok: true; data: TData }
export type SafeErr<TError extends Error = Error> = { ok: false; err: TError }

export type Safe<TData, TError extends Error = Error> = SafeOk<TData> | SafeErr<TError>

export async function safe<TData, TError extends Error = Error>(
  fn: () => Promise<TData>,
): Promise<Safe<TData, TError>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, err: StandardErr<TError>(e) };
  }
}

export function safeSync<TData, TError extends Error = Error>(
  fn: () => TData,
): Safe<TData, TError> {
  try {
    return { ok: true, data: fn() };
  } catch (e) {
    return { ok: false, err: StandardErr<TError>(e) };
  }
}

export function StandardErr<TError extends Error = Error>(e: unknown): TError {
  if (typeof e === 'undefined') {
    return new Error(e) as TError;
  } else if (typeof e === 'string') {
    return new Error(e) as TError;
  } else if (e instanceof Error) {
    return e as TError;
  } else if (e === null) {
    return new Error() as TError;
  } else {
    return new Error(JSON.stringify(e)) as TError;
  }
}

export function toOk<TData>(data: TData): SafeOk<TData> {
  return { ok: true, data };
}

export function toErr<TError extends Error = Error>(err: TError): SafeErr<TError> {
  return { ok: false, err };
}
