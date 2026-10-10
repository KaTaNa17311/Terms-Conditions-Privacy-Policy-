import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {accounts,consents} from '@/db/schema';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import policies from './policies.json';
export async function getAccount(){
 const user=await getChatGPTUser();if(!user)return null;
 const db=getDb();const now=new Date().toISOString();
 await db.insert(accounts).values({userId:user.userId,email:user.email,displayName:user.displayName,createdAt:now,updatedAt:now}).onConflictDoNothing();
 const row=await db.select().from(accounts).where(eq(accounts.userId,user.userId)).get();
 const consent=await db.select().from(consents).where(eq(consents.userId,user.userId)).all();
 return row?{...row,details:JSON.parse(row.details),consent:consent.find(c=>c.termsVersion===policies.terms.version&&c.privacyVersion===policies.privacy.version)??null}:null;
}
