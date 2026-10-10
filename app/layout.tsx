import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'AdvoHQ — Get started',description:'Set up your AdvoHQ workspace. Choose Enterprise or Litigation, select your plan and start your trial.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
