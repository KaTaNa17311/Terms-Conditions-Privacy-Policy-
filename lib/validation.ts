import {z} from 'zod';
export const detailsSchema=z.object({name:z.string().trim().min(2,'Enter your full name.').max(100),organisation:z.string().trim().min(2,'Enter your company or practice name.').max(150),billingEmail:z.string().trim().email('Enter a valid billing email.').max(200),teamSize:z.enum(['1','2–5','6–10','11–50','51+']).optional().default('1'),address:z.string().trim().max(300).optional().default(''),city:z.string().trim().max(100).optional().default(''),state:z.string().trim().max(100).optional().default(''),country:z.enum(['India','United Arab Emirates','United States','United Kingdom','Other']).default('India'),postalCode:z.string().trim().max(20).optional().default(''),gstin:z.string().trim().toUpperCase().refine(v=>!v||/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v),'Enter a valid GSTIN.').optional().default('')}).strict();
export type Details=z.infer<typeof detailsSchema>;
export const actionSchema=z.discriminatedUnion('action',[
z.object({action:z.literal('accept'),terms:z.literal(true),privacy:z.literal(true),termsVersion:z.string(),privacyVersion:z.string()}).strict(),
z.object({action:z.literal('category'),category:z.enum(['enterprise','litigation'])}).strict(),
z.object({action:z.literal('details'),details:detailsSchema}).strict(),
z.object({action:z.literal('activate'),planId:z.string(),cycle:z.enum(['monthly','annual']),mode:z.enum(['trial','selected'])}).strict(),
z.object({action:z.literal('billing'),details:detailsSchema}).strict()
]);
