import { z } from 'zod/v4';
import { backendClient } from '@/shared/backbone/backend/backend-client.ts';
import { Unit, unitSortFn, UnitUpsert } from '@/shared/backbone/backend/model/unit.ts';


export type UnitsRes = z.infer<typeof UnitsRes>;
export const UnitsRes = z.array(Unit);

export type UnitUpsertReqArgs = z.infer<typeof UnitUpsertReqArgs>;
export const UnitUpsertReqArgs = UnitUpsert;
export type UnitUpsertResBody = z.infer<typeof UnitUpsertResBody>;
export const UnitUpsertResBody = Unit;

export type UnitDeleteReqParams = { id: string };
export type UnitDeleteResBody = z.infer<typeof UnitDeleteResBody>;
export const UnitDeleteResBody = z.boolean();


export type UnitApi = {
  list: () => Promise<UnitsRes>;
  upsert: (body: UnitUpsertReqArgs) => Promise<UnitUpsertResBody>;
  delete: (params: UnitDeleteReqParams) => Promise<UnitDeleteResBody>;
}

export const UnitApi: UnitApi = {
  async list() {
    const url = 'api/v1/teas/units';
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    const data = UnitsRes.parse(res);
    return data.sort(unitSortFn);
  },
  async upsert({ id, ...body }) {
    const url = id ? `api/v1/teas/units/${id}` : 'api/v1/teas/units';
    const method = id ? 'PUT' : 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return UnitUpsertResBody.parse(res);
  },
  async delete(params) {
    const url = `api/v1/teas/units/${params.id}`;
    const method = 'DELETE';
    const res = await backendClient(url, { method }).json();
    return UnitDeleteResBody.parse(res);
  },
};
