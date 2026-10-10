import {eq,and} from 'drizzle-orm';
import {getDb} from '@/db';
import {accounts,consents} from '@/db/schema';
import {getAccount} from '@/lib/account';
import {actionSchema} from '@/lib/validation';
import {plans,TRIAL_DAYS} from '@/lib/catalog';
import policies from '@/lib/policies.json';
export const dynamic='force-dynamic';
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const account=await getAccount();return account?response({account}):response({error:'Sign in to continue.'},401);}
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return response({error:'Invalid request origin.'},403);
 if(Number(request.headers.get('content-length')||0)>15000)return response({error:'Request is too large.'},413);
 let raw;try{const body=await request.text();if(body.length>15000)return response({error:'Request is too large.'},413);raw=JSON.parse(body);}catch{return response({error:'Invalid request.'},400);}
 const parsed=actionSchema.safeParse(raw);if(!parsed.success)return response({error:parsed.error.issues[0]?.message||'Check your details.'},400);
 const account=await getAccount();if(!account)return response({error:'Sign in to continue.'},401);
 const db=getDb(),now=new Date().toISOString(),data=parsed.data;
 if(data.action==='accept'){
  if(data.termsVersion!==policies.terms.version||data.privacyVersion!==policies.privacy.version)return response({error:'The documents changed. Refresh and review them again.'},409);
  if(!account.consent)await db.insert(consents).values({id:account.userId+':'+data.termsVersion+':'+data.privacyVersion,userId:account.userId,termsVersion:data.termsVersion,privacyVersion:data.privacyVersion,termsAccepted:1,privacyAcknowledged:1,acceptedAt:now,noticeVersion:'account-notice-2026-10-09-v1'}).onConflictDoNothing();
  await db.update(accounts).set({step:Math.max(2,account.step),updatedAt:now}).where(eq(accounts.userId,account.userId));
 }else{
  if(!account.consent)return response({error:'Accept the terms and acknowledge the privacy policy first.'},403);
  if(data.action==='category'){
   if(account.status!=='setup')return response({error:'Your workspace is already set up.'},409);
   await db.update(accounts).set({category:data.category,step:account.category===data.category?Math.max(3,account.step):3,updatedAt:now}).where(eq(accounts.userId,account.userId));
  }else if(data.action==='details'||data.action==='billing'){
   if(data.action==='details'&&account.status!=='setup')return response({error:'Use billing settings to edit an existing workspace.'},409);
   if(!account.category)return response({error:'Choose a workspace first.'},400);
   await db.update(accounts).set({details:JSON.stringify(data.details),step:Math.max(4,account.step),updatedAt:now}).where(eq(accounts.userId,account.userId));
  }else if(data.action==='activate'){
   const plan=plans.find(p=>p.id===data.planId&&p.category===account.category);
   if(!plan||account.step<4)return response({error:'Complete your details and choose a valid plan.'},400);
   if(account.status!=='setup'){
    if(account.planId!==plan.id||account.cycle!==data.cycle)return response({error:'A plan is already selected for this workspace.'},409);
   }else{
    const end=new Date(Date.now()+TRIAL_DAYS*86400000).toISOString();
    await db.update(accounts).set({planId:plan.id,cycle:data.cycle,status:data.mode==='trial'?'trial':'selected',trialStart:data.mode==='trial'?now:null,trialEnd:data.mode==='trial'?end:null,step:5,updatedAt:now}).where(and(eq(accounts.userId,account.userId),eq(accounts.status,'setup')));
    const activated=await getAccount();if(activated?.planId!==plan.id||activated?.cycle!==data.cycle)return response({error:'A different plan was already selected. Refresh to continue.'},409);
   }
   return response({account:await getAccount(),redirect:'/workspace/'+account.category});
  }
 }
 return response({account:await getAccount()});
}
