import Emittery from 'emittery';
import ky, { type AfterResponseHook, type BeforeRequestHook } from 'ky';
import { z } from 'zod/v4';
import { AppError } from '@/shared/backbone/backend/types';
import { config } from '@/shared/backbone/config';
import { HttpCode } from '@/shared/lib/independent/http';
import { Ms } from '@/shared/lib/independent/ms';


export const backendClient = ky.create({
  prefixUrl: config.backendOrigin,
  credentials: 'include',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  hooks: {
    beforeRequest: [AuthorizationInjector()/* , ...SlowdownRequests()*/],
    afterResponse: [RefreshToken()],
  },
});


export const backendClientSettings = {
  accessToken: null as string | null,
  accessTokenDecoded: null as AccessTokenDecoded | null,
};

export enum BackendClientEvent { Logout, RefreshToken }

export const backendClientEmitter = new Emittery<{
  [BackendClientEvent.Logout]: undefined,
  [BackendClientEvent.RefreshToken]: undefined,
}>({ debug: { name: 'BackendClientEmitter' } });


function AuthorizationInjector(): BeforeRequestHook {
  return async (request) => {
    if (request.url.includes('/auth')) return;

    const { accessTokenDecoded: decoded } = backendClientSettings;
    const is30SecondsRemainedOrExpired = !!decoded && (Ms.second(decoded.exp) - Date.now()) <= Ms.second(30);

    // console.log('AuthorizationInjector hook called', JSON.stringify({
    //   backendClientSettings,
    //   is30SecondsRemainedOrExpired,
    //   remainedSeconds,
    //   url: request.url,
    // }, null, 2), request);
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    if (is30SecondsRemainedOrExpired) {
      // console.log('AuthorizationInjector: EMIT RefreshToken');
      await backendClientEmitter.emit(BackendClientEvent.RefreshToken);
    }

    const token = backendClientSettings.accessToken;
    if (!token) return;
    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    request.headers.set('Authorization', bearerToken);
  };
}

function RefreshToken(): AfterResponseHook {
  return async (request, options, response) => {
    if (response.status !== HttpCode.Unauthorized) return;

    const bodyValidation = AppError.safeParse(await response.json());
    if (!bodyValidation.success) return console.error('Can\'t check if need to refresh token. Invalid error format from backend:', bodyValidation.error);
    const body = bodyValidation.data;

    if (!/access token is expired/ig.test(body.error)) {
      console.log('RefreshToken: Logout because:', body.error);
      return await backendClientEmitter.emit(BackendClientEvent.Logout);
    }

    // console.log('RefreshToken: called', {
    //   backendClientSettings,
    //   request,
    //   options,
    //   response,
    // });
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    await backendClientEmitter.emit(BackendClientEvent.RefreshToken);
    return backendClient(request, options);
  };
}


export const AccessTokenDecoded = z.object({
  id: z.uuid(),
  firstName: z.string(),
  username: z.string().optional(),
  role: z.enum(['user', 'admin']),
  exp: z.number(), // expiration time in seconds since epoch
});
export type AccessTokenDecoded = z.infer<typeof AccessTokenDecoded>;
