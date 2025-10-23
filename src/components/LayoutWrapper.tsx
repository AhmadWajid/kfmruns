'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Determine current page based on pathname
  const getCurrentPage = () => {
    if (pathname === '/driver') return 'driver';
    if (pathname === '/rider') return 'rider';
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/admin') return 'admin';
    return 'home';
  };

  return (
    <>
      <Navbar currentPage={getCurrentPage()} />
      <main className="flex-1 pt-20">
        {children}
      </main>
    </>
  );
}
