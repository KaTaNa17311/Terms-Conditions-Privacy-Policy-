'use client';
import {useEffect,useRef} from 'react';
import {ArrowUpRight,FileText,X,Check,Building2,Scale,ChevronRight} from 'lucide-react';
import policies from '@/lib/policies.json';
import {company} from '@/lib/company';
export type LegalKind='terms'|'privacy';
export function Logo({light=false}:{light?:boolean}){return <a href="/" className={'brand '+(light?'brand-light':'')} aria-label="AdvoHQ home"><span className="brand-symbol"><svg width="24" height="24" viewBox="0 0 30 30" fill="none"><path d="M5 25 15 5l10 20M9 18h12" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg></span><span>Advo<span className="brand-hq">HQ</span></span></a>}
export function LegalDialog({kind,onClose}:{kind:LegalKind;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{ref.current?.showModal();return()=>ref.current?.close()},[]);
 const doc=policies[kind];const blocks=doc.blocks.slice(0,doc.blocks.findIndex(b=>b.text.startsWith('Internal publication checklist')));
 return <dialog ref={ref} className="legal-dialog" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-header"><div><span className="eyebrow">ADVOHQ</span><h2>{doc.title}</h2></div><button className="icon-button" aria-label="Close document" onClick={onClose}><X size={20}/></button></div><div className="draft-notice">Working draft · 9 October 2026</div><article className="legal-content">{blocks.map((b,i)=>b.style==='Title'?null:b.style.startsWith('Heading')?<h3 key={i}>{b.text}</h3>:<p key={i}>{b.text}</p>)}</article><div className="modal-bottom"><a className="text-link" href={'/legal/'+kind} target="_blank" rel="noreferrer">Open full page <ArrowUpRight size={14}/></a><button className="button primary" onClick={onClose}>Done <Check size={16}/></button></div></dialog>
}
export function CompanyDialog({onClose}:{onClose:()=>void}){const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{ref.current?.showModal()},[]);return <dialog ref={ref} className="small-dialog" onCancel={onClose}><div className="modal-header"><h2>Company details</h2><button className="icon-button" aria-label="Close company details" onClick={onClose}><X size={20}/></button></div><div className="company-content"><h3>{company.name}</h3><p>CIN: {company.cin}</p><p>{company.address}</p></div><div className="modal-bottom"><button className="button primary" onClick={onClose}>Close</button></div></dialog>}
export function StepIcon({step,size=20}:{step:number;size?:number}){const I=[FileText,Building2,FileText,Scale][step-1]||ChevronRight;return <I size={size}/>}
