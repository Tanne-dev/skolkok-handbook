import {requireOwner} from '../../../lib/supabase/server';
import {failure,sameOrigin,json,checked} from '../../../lib/storage';
import {configSchema,emptyConfig} from '../../../lib/backup';
export async function GET(){try{const {client,user}=await requireOwner();const {data}=checked(await client.from('settings').select('data').eq('owner_id',user.id).eq('id','school').maybeSingle());return json(data?.data??emptyConfig);}catch(e){return failure(e);}}
export async function POST(r:Request){try{if(!sameOrigin(r))return new Response('Forbidden',{status:403});const {client,user}=await requireOwner();const parsed=configSchema.safeParse(await r.json());if(!parsed.success)return Response.json({error:'Định lượng không hợp lệ.'},{status:400});checked(await client.from('settings').upsert({owner_id:user.id,id:'school',data:parsed.data},{onConflict:'owner_id,id'}));return json(parsed.data);}catch(e){return failure(e);}}
