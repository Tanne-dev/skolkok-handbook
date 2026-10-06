import {z} from 'zod';
export const profileSchema=z.object({name:z.string().trim().min(1,'Vui lòng nhập tên.').max(80),avatar:z.union([z.literal(''),z.string().regex(/^\/api\/files\/[0-9a-f-]{36}$/i)])});
export type Profile=z.infer<typeof profileSchema>;
export const defaultProfile:Profile={name:'Tanne',avatar:''};
