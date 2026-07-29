'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommandMenu from '@/components/CommandMenu';
import { WatchlistProvider } from '@/context/WatchlistContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  return (
    <html lang="en">
      <body className="bg-dark-900 text-gray-100 min-h-screen flex flex-col antialiased">
        <WatchlistProvider>
          <Navbar onOpenCommandPalette={() => setCommandOpen(true)} />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
        </WatchlistProvider>
      </body>
    </html>
  );
}
