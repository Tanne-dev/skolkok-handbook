import {redirect} from 'next/navigation';
import {requireOwner,AccessError} from '../lib/supabase/server';
import Handbook from './handbook';
export const dynamic='force-dynamic';
export default async function Page(){try{await requireOwner();}catch(e){if(e instanceof AccessError)redirect('/login');throw e;}return <Handbook/>;}
