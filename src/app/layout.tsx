import { TailwindIndicator } from '@/components/tailwind-indicator';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Provider from '@/app/_trpc/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interview Prepbook',
  description: 'Website to help candidate prepare for interviews',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
