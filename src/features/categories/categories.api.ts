import { z } from 'zod/v4';
import { backendClient } from '@/shared/backbone/backend/backend-client';
import { Category, CategoryUpsert } from '@/shared/backbone/backend/model/category';


export type CategoriesListResBody = z.infer<typeof CategoriesListResBody>;
const CategoriesListResBody = z.array(Category);


export type CategoryOneReqParams = { id: string };
type CategoryOneResBody = z.infer<typeof CategoryOneResBody>;
const CategoryOneResBody = Category;


export type CategoryUpsertReqBody = z.infer<typeof CategoryUpsertReqBody>;
export const CategoryUpsertReqBody = CategoryUpsert;
type CategoryUpsertResBody = z.infer<typeof CategoryUpsertResBody>;
const CategoryUpsertResBody = Category;


type CategoryDeleteReqParams = { id: string };
type CategoryDeleteResBody = z.infer<typeof CategoryDeleteResBody>;
const CategoryDeleteResBody = z.boolean();


type CategoriesApi = {
  list: () => Promise<CategoriesListResBody>;
  upsert: (body: CategoryUpsertReqBody) => Promise<CategoryUpsertResBody>;
  one: (params: CategoryOneReqParams) => Promise<CategoryOneResBody>;
  // TODO: Handle error when category is used by tea
  delete: (params: CategoryDeleteReqParams) => Promise<CategoryDeleteResBody>;
};

export const CategoriesApi: CategoriesApi = {
  list: async () => {
    const url = 'api/v1/categories';
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    return CategoriesListResBody.parse(res);
  },
  upsert: async ({ id, ...body }) => {
    const url = id ? `api/v1/categories/${id}` : 'api/v1/categories';
    const method = id ? 'PUT' : 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return CategoryUpsertResBody.parse(res);
  },
  one: async (params) => {
    const url = `api/v1/categories/${params.id}`;
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    return CategoryOneResBody.parse(res);
  },
  delete: async (params) => {
    const url = `api/v1/categories/${params.id}`;
    const method = 'DELETE';
    const res = await backendClient(url, { method }).json();
    return CategoryDeleteResBody.parse(res);
  },
};
