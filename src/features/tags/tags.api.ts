import { z } from 'zod/v4';
import { backendClient } from '@/shared/backbone/backend/backend-client';
import { Tag, TagUpsert } from '@/shared/backbone/backend/model/tag';


type TagsListResBody = z.infer<typeof TagsListResBody>;
const TagsListResBody = z.array(Tag);


export type TagUpsertReqBody = z.infer<typeof TagUpsertReqBody>;
export const TagUpsertReqBody = TagUpsert;
type TagUpsertResBody = z.infer<typeof TagUpsertResBody>;
const TagUpsertResBody = Tag;


type TagDeleteReqParams = { id: string; };
type TagDeleteResBody = z.infer<typeof TagDeleteResBody>;
const TagDeleteResBody = z.boolean();


type TagsApi = {
  list: () => Promise<TagsListResBody>;
  upsert: (body: TagUpsertReqBody) => Promise<TagUpsertResBody>;
  delete: (params: TagDeleteReqParams) => Promise<TagDeleteResBody>;
};

export const TagsApi: TagsApi = {
  list: async () => {
    const url = 'api/v1/tags';
    const method = 'GET';
    const res = await backendClient(url, { method }).json();
    return TagsListResBody.parse(res);
  },
  upsert: async ({ id, ...body }) => {
    const url = id ? `api/v1/tags/${id}` : 'api/v1/tags';
    const method = id ? 'PUT' : 'POST';
    const res = await backendClient(url, { method, json: body }).json();
    return TagUpsertResBody.parse(res);
  },
  delete: async (params) => {
    const url = `api/v1/tags/${params.id}`;
    const method = 'DELETE';
    const res = await backendClient(url, { method }).json();
    return TagDeleteResBody.parse(res);
  },
};
