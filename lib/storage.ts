import {AccessError} from './supabase/server';
export function failure(e:unknown){if(e instanceof AccessError)return Response.json({error:e.message},{status:e.status,headers:{'Cache-Control':'no-store'}});console.error('Storage operation failed',e instanceof Error?e.name:'unknown');return Response.json({error:'Không thể lưu hoặc tải dữ liệu. Vui lòng thử lại.'},{status:500});}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');return !origin||origin===new URL(r.url).origin;}
export function json(data:unknown){return Response.json(data,{headers:{'Cache-Control':'private, no-store'}});}
export function checked<T extends {error:unknown}>(result:T):T{if(result.error)throw new Error('Database operation failed');return result;}
export const BUCKET='skolkok-images';
export function fileId(path:string){const match=/^\/api\/files\/([0-9a-f-]{36})$/i.exec(path);if(!match)throw new Error('Invalid image path');return match[1];}
