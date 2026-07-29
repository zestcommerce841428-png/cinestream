'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommandMenu from '@/components/CommandMenu';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-brand-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-xl"
      >
        Skip to main content
      </a>
      <Navbar onOpenCommandPalette={() => setCommandOpen(true)} />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
