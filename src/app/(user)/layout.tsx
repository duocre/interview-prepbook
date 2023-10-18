import Header from '@/components/Header';
import type { PropsWithChildren } from 'react';

export default function UserLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Header />
      {children}
    </div>
  );
}
