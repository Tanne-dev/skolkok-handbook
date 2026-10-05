import { env } from 'cloudflare:workers';
export function database(){ if(!env.DB) throw new Error('Database unavailable'); return env.DB; }
export function bucket(){ const b=(env as any).BUCKET; if(!b) throw new Error('Storage unavailable'); return b; }
export function failure(e: unknown){ console.error(e); return Response.json({error:'Không thể lưu hoặc tải dữ liệu. Vui lòng thử lại.'},{status:500}); }
export function sameOrigin(r:Request){const o=r.headers.get('origin');return !o||o===new URL(r.url).origin;}
