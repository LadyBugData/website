'use client';

import Link from 'next/link';
import Image from 'next/image';
import Container from './ui/Container';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      // If on home page, just scroll to section
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on other page, navigate to home with anchor
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-ladybug-header border-b border-gray-300 z-50 shadow-sm">
      <Container className="py-4 flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="LadybugData"
            width={60}
            height={60}
            className="h-10 w-auto"
          />
          <span className="text-lg font-display font-bold text-ladybug-dark hidden sm:block">LadybugData</span>
        </Link>

        {/* Navigation - Left Side */}
        <nav className="hidden md:flex gap-8">
          <button 
            onClick={() => handleNavigation('who-we-serve')}
            className="text-gray-700 hover:text-ladybug-crimson transition font-medium text-sm cursor-pointer"
          >
            Who We Serve
          </button>
          <button 
            onClick={() => handleNavigation('products')}
            className="text-gray-700 hover:text-ladybug-crimson transition font-medium text-sm cursor-pointer"
          >
            Products
          </button>
          <button 
            onClick={() => handleNavigation('features')}
            className="text-gray-700 hover:text-ladybug-crimson transition font-medium text-sm cursor-pointer"
          >
            Features
          </button>
          <Link href="/contact" className="text-gray-700 hover:text-ladybug-crimson transition font-medium text-sm">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  );
}
