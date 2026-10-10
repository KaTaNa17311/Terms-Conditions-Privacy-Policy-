import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const accounts=sqliteTable('accounts',{
 userId:text('user_id').primaryKey(),email:text('email').notNull(),displayName:text('display_name').notNull(),step:integer('step').notNull().default(1),category:text('category'),details:text('details').notNull().default('{}'),planId:text('plan_id'),cycle:text('cycle'),status:text('status').notNull().default('setup'),trialStart:text('trial_start'),trialEnd:text('trial_end'),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()
});
export const consents=sqliteTable('consents',{
 id:text('id').primaryKey(),userId:text('user_id').notNull().references(()=>accounts.userId),termsVersion:text('terms_version').notNull(),privacyVersion:text('privacy_version').notNull(),acceptedAt:text('accepted_at').notNull(),termsAccepted:integer('terms_accepted').notNull(),privacyAcknowledged:integer('privacy_acknowledged').notNull(),noticeVersion:text('notice_version').notNull()
});
