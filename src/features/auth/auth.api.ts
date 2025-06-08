import { z } from 'zod/v4';
import { backendClient } from '@/shared/backbone/backend/backend-client';


export type AuthReqBody = {
  id: number,
  first_name: string,
  last_name?: string,
  username?: string,
  photo_url?: string,
  /* Unix timestamp */
  auth_date: number,
  hash: string,
}
export type AuthMiniAppReqBody = { initData: string };

type AuthResBody = z.infer<typeof AuthResBody>;
const AuthResBody = z.object({ accessToken: z.string() });


type AuthApi = {
  auth: (body: AuthReqBody) => Promise<AuthResBody>,
  authMiniApp: (body: AuthMiniAppReqBody) => Promise<AuthResBody>,
  refreshToken: () => Promise<AuthResBody>,
}

export const AuthApi: AuthApi = {
  async auth(body) {
    const url = 'api/v1/auth';
    const method = 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return AuthResBody.parse(res);
  },
  async authMiniApp(body) {
    const url = 'api/v1/auth/mini-app';
    const method = 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return AuthResBody.parse(res);
  },
  async refreshToken() {
    const url = 'api/v1/auth/refresh';
    const method = 'POST';
    const res = await backendClient(url, { method }).json();
    return AuthResBody.parse(res);
  },
};
