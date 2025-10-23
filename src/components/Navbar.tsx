'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Car, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage?: string;
}

export default function Navbar({ currentPage = 'home' }: NavbarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();
        setIsAdmin(data.authenticated);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed z-50 w-full flex flex-col items-stretch">
      <div className="flex z-1 justify-between items-stretch w-full transition duration-200 px-6 bg-msa-blue shadow-md">
        {/* Logo */}
        <Link href="/" className="flex py-3 gap-2 items-center">
          <div className="text-2xl">🕌</div>
          <h1 className="text-4xl text-msa-yellow font-bold">UCLA MSA</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/driver">
            <Button 
              variant="outline" 
              size="sm" 
              className={`border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                currentPage === 'driver' ? 'bg-msa-yellow text-msa-blue' : ''
              }`}
            >
              <Car className="mr-2 h-4 w-4" />
              Offer Ride
            </Button>
          </Link>
          
          <Link href="/rider">
            <Button 
              variant="outline" 
              size="sm" 
              className={`border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                currentPage === 'rider' ? 'bg-msa-yellow text-msa-blue' : ''
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Request Ride
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button 
              variant="outline" 
              size="sm" 
              className={`border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                currentPage === 'dashboard' ? 'bg-msa-yellow text-msa-blue' : ''
              }`}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {isLoading ? (
            <Button variant="outline" size="sm" disabled className="border-msa-yellow text-msa-yellow">
              Loading...
            </Button>
          ) : isAdmin ? (
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                    currentPage === 'admin' ? 'bg-msa-yellow text-msa-blue' : ''
                  }`}
                >
                  Admin Panel
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue">
                Admin Login
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="md:hidden text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu button (when desktop nav is hidden) */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-msa-blue border-t border-msa-yellow/20 shadow-lg">
          <div className="px-6 py-4 space-y-3">
            <Link href="/driver" onClick={closeMobileMenu}>
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                  currentPage === 'driver' ? 'bg-msa-yellow text-msa-blue' : ''
                }`}
              >
                <Car className="mr-2 h-4 w-4" />
                Offer Ride
              </Button>
            </Link>
            
            <Link href="/rider" onClick={closeMobileMenu}>
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                  currentPage === 'rider' ? 'bg-msa-yellow text-msa-blue' : ''
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Request Ride
              </Button>
            </Link>

            <Link href="/dashboard" onClick={closeMobileMenu}>
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                  currentPage === 'dashboard' ? 'bg-msa-yellow text-msa-blue' : ''
                }`}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            {isLoading ? (
              <Button variant="outline" size="sm" disabled className="w-full border-msa-yellow text-msa-yellow">
                Loading...
              </Button>
            ) : isAdmin ? (
              <>
                <Link href="/admin" onClick={closeMobileMenu}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue ${
                      currentPage === 'admin' ? 'bg-msa-yellow text-msa-blue' : ''
                    }`}
                  >
                    Admin Panel
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/admin" onClick={closeMobileMenu}>
                <Button variant="outline" size="sm" className="w-full border-msa-yellow text-msa-yellow hover:bg-msa-yellow hover:text-msa-blue">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
