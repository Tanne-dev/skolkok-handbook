import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
export function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY&&process.env.SKOLKOK_OWNER_EMAIL);}
export class AccessError extends Error{constructor(public status:number,message:string){super(message);}}
export async function serverClient(){
 if(!configured())throw new AccessError(503,'Bản Vercel chưa kết nối dữ liệu. Vui lòng tiếp tục dùng app hiện tại.');
 const jar=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>jar.getAll(),setAll:values=>{try{values.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* Server components cannot write cookies; route handlers refresh sessions. */}}}});
}
export async function requireOwner(){const client=await serverClient();const {data:{user},error}=await client.auth.getUser();if(error||!user)throw new AccessError(401,'Vui lòng đăng nhập lại.');if(!user.email_confirmed_at||user.email?.toLowerCase()!==process.env.SKOLKOK_OWNER_EMAIL?.trim().toLowerCase())throw new AccessError(403,'Tài khoản này không có quyền truy cập sổ tay.');return {client,user};}
