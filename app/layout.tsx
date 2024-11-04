import '@/app/ui/global.css';
import 'react-toastify/ReactToastify.css';

import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import {ToastContainer} from 'react-toastify';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'Official Next JS dashboard course, built with the modern App Router',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <ToastContainer />
        </body>
    </html>
  );
}
