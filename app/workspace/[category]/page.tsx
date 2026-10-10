import {getAccount} from '@/lib/account';
import {redirect,notFound} from 'next/navigation';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{category:string}>}){const {category}=await params;if(!['enterprise','litigation'].includes(category))notFound();const account=await getAccount();if(!account)redirect('/signin-with-chatgpt?return_to='+encodeURIComponent('/workspace/'+category));if(account!.step!==5||!account!.consent)redirect('/');if(account!.category!==category)redirect('/workspace/'+account!.category);return <Workspace initial={account!}/>}
