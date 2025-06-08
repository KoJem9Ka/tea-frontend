import { HTTPError } from 'ky';


export const HttpCode = {
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  Gone: 410,
  InternalServerError: 500,
} as const;

export function isNotFound(err: unknown): err is HTTPError {
  return err instanceof HTTPError && err.response.status === HttpCode.NotFound;
}
