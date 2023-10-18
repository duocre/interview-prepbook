import Image from 'next/image';
import React from 'react';
import Button from './ui/Button';

export default function Header() {
  return (
    <header className="flex justify-between pt-2">
      <div className="bg-black h-14 w-14 rounded p-2">
        <Image src="/prepbook-logo.svg" width={30} height={30} alt="logo" />
      </div>
      <button>About</button>
    </header>
  );
}
