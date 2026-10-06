import {configured} from '../../lib/supabase/server';
import LoginForm from './form';
export const dynamic='force-dynamic';
export default function Login(){return <main style={{maxWidth:480,margin:'8vh auto'}}><div className="panel"><h1>Skolkök</h1><p>Sổ tay bếp trường của bạn.</p>{configured()?<LoginForm/>:<p role="status">Bản Vercel đang được kết nối dữ liệu. Bạn hãy tiếp tục sử dụng <a href="https://skolkok-handbook.quachtienthanh92.chatgpt.site/">sổ tay hiện tại</a>.</p>}</div></main>;}
