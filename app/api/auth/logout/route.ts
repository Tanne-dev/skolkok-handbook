import {serverClient} from '../../../../lib/supabase/server';
import {sameOrigin,failure} from '../../../../lib/storage';
export async function POST(r:Request){try{if(!sameOrigin(r))return new Response('Forbidden',{status:403});await(await serverClient()).auth.signOut();return Response.redirect(new URL('/login',r.url),303);}catch(e){return failure(e);}}
