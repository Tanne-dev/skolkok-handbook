import {createClient} from '@supabase/supabase-js';
export async function uploadImage(file:Blob){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size<=0||file.size>10*1024*1024)throw Error('Chọn ảnh JPG, PNG hoặc WebP dưới 10 MB.');
 const response=await fetch('/api/files',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:file.type,size:file.size})});const result=await response.json() as {error?:string,path:string,token:string,url:string};if(!response.ok)throw Error(result.error||'Không thể tải ảnh.');
 const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 const {error}=await client.storage.from('skolkok-images').uploadToSignedUrl(result.path,result.token,file,{contentType:file.type});if(error)throw Error('Tải ảnh chưa thành công. Vui lòng thử lại.');return {url:result.url as string};
}
