import { z } from 'zod/v4';
import { backendClient } from '@/shared/backbone/backend/backend-client';
import { Tea, TeaUpsert, TeaWithRating } from '@/shared/backbone/backend/model/tea';
import { PaginatedResult } from '@/shared/backbone/backend/types';


export type TeasListFilterSortBy = 'name' | 'servePrice' | 'rating';
export type TeasListFilterServePrice = { min: number, max: number };
export type TeasListReqQueryFilters = {
  categoryId?: string;
  name?: string;
  tags?: string[];
  isAsc?: boolean;
  sortBy?: TeasListFilterSortBy;
  servePrice?: TeasListFilterServePrice;
  /* For authorized */
  isOnlyFavourite?: boolean;
  /* For role=admin */
  isOnlyHidden?: boolean;
}
export type TeasListReqQueryPagination = {
  /* @min 1 */
  page: number;
  limit: number;
}
type TeasListReqQuery = TeasListReqQueryFilters & TeasListReqQueryPagination;
export type TeasListResBody = z.infer<typeof TeasListResBody>;
export const TeasListResBody = PaginatedResult(TeaWithRating);


export type TeaOneReqParams = { id: string };
export type TeaOneResBody = z.infer<typeof TeaOneResBody>;
const TeaOneResBody = TeaWithRating;


type TeaMinMaxPricesResBody = z.infer<typeof TeaMinMaxPricesResBody>;
const TeaMinMaxPricesResBody = z.object({
  minServePrice: z.number().min(0),
  maxServePrice: z.number().min(0),
});


type TeaUpsertReqBody = z.infer<typeof TeaUpsertReqBody>;
const TeaUpsertReqBody = TeaUpsert;
type TeaUpsertResBody = z.infer<typeof TeaUpsertResBody>;
const TeaUpsertResBody = Tea;


type TeaDeleteReqParams = { id: string };
type TeaDeleteResBody = z.infer<typeof TeaDeleteResBody>;
const TeaDeleteResBody = z.boolean();


type TeaEvaluateReqArgs = {
  id: string,
  rating: number,
  note: string,
};
type TeaEvaluateResBody = z.infer<typeof TeaEvaluateResBody>;
const TeaEvaluateResBody = TeaWithRating;


export type TeaSetFavouriteReqArgs = { id: string, isFavourite: boolean };


type TeaApi = {
  list: (query: TeasListReqQuery, signal: AbortSignal) => Promise<TeasListResBody>;
  upsert: (body: TeaUpsertReqBody) => Promise<TeaUpsertResBody>;
  minMaxPrices: () => Promise<TeaMinMaxPricesResBody>;
  one: (params: TeaOneReqParams) => Promise<TeaOneResBody>;
  delete: (params: TeaDeleteReqParams) => Promise<TeaDeleteResBody>;
  evaluate: (args: TeaEvaluateReqArgs) => Promise<TeaEvaluateResBody>;
  setFavourite: (args: TeaSetFavouriteReqArgs) => Promise<void>;
}

export const TeaApi: TeaApi = {
  async list(queryDeserialized, signal) {
    const { servePrice, ...rest } = queryDeserialized;
    const querySerialized = {
      ...rest,
      ...(servePrice ? { servePrice: [servePrice.min, servePrice.max] } as const : {}),
    };

    const url = 'api/v1/teas';
    const method = 'GET';

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(querySerialized)) {
      if (typeof value !== 'undefined') {
        if (Array.isArray(value)) value.forEach(v => searchParams.append(`${key}[]`, v));
        else searchParams.set(key, String(value));
      }
    }

    const res = await backendClient(url, { method, searchParams, signal }).json();
    return TeasListResBody.parse(res);
  },
  async upsert({ id, ...body }) {
    const url = id ? `api/v1/teas/${id}` : 'api/v1/teas';
    const method = id ? 'PUT' : 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return TeaUpsertResBody.parse(res);
  },
  async minMaxPrices() {
    const url = 'api/v1/teas/prices';
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    return TeaMinMaxPricesResBody.parse(res);
  },
  async one(params) {
    const url = `api/v1/teas/${params.id}`;
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    return TeaOneResBody.parse(res);
  },
  async delete(params) {
    const url = `api/v1/teas/${params.id}`;
    const method = 'DELETE';
    const res = await backendClient(url, { method }).json();
    return TeaDeleteResBody.parse(res);
  },
  async evaluate({ id, ...body }) {
    const url = `api/v1/teas/${id}/evaluate`;
    const method = 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return TeaEvaluateResBody.parse(res);
  },
  async setFavourite({ id, isFavourite }) {
    const url = `api/v1/teas/${id}/favourite?isFavourite=${isFavourite}`;
    const method = 'POST';
    return await backendClient(url, { method }).json<void>();
  },
};
