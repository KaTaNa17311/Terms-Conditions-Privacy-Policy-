import {getAccount} from '@/lib/account';
import {redirect} from 'next/navigation';
import Onboarding from './onboarding';
export const dynamic='force-dynamic';
export default async function Page(){const account=await getAccount();if(account&&account.step===5)redirect('/workspace/'+account.category);return <Onboarding initial={account}/>;}
