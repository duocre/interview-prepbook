import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import Provider from '@/app/_trpc/Provider';
import { cn } from '@/lib/utils';
import { TailwindIndicator } from '@/components/tailwind-indicator';

import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

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
      <body
        className={cn('antialiased bg-[#F9F7F7] h-full', poppins.className)}
      >
        <Provider>{children}</Provider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
