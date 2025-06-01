'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Otel Tisna
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Ana Sayfa
            </Link>
            <Link href="/odalar" className="text-gray-600 hover:text-gray-900">
              Odalar
            </Link>
            <Link href="/hizmetler" className="text-gray-600 hover:text-gray-900">
              Hizmetler
            </Link>
            <Link href="/galeri" className="text-gray-600 hover:text-gray-900">
              Galeri
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-gray-900">
              İletişim
            </Link>
            <Link href="/sss" className="text-gray-600 hover:text-gray-900">
              SSS
            </Link>
            <Link 
              href="/rezervasyon" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Rezervasyon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Ana Sayfa
              </Link>
              <Link href="/odalar" className="text-gray-600 hover:text-gray-900">
                Odalar
              </Link>
              <Link href="/hizmetler" className="text-gray-600 hover:text-gray-900">
                Hizmetler
              </Link>
              <Link href="/galeri" className="text-gray-600 hover:text-gray-900">
                Galeri
              </Link>
              <Link href="/iletisim" className="text-gray-600 hover:text-gray-900">
                İletişim
              </Link>
              <Link href="/sss" className="text-gray-600 hover:text-gray-900">
                SSS
              </Link>
              <Link 
                href="/rezervasyon" 
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Rezervasyon
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 