'use client';

import Link from 'next/link';
import Container from './ui/Container';

export default function Footer() {
  return (
    <footer className="bg-ladybug-dark text-white relative z-10">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">LadybugData</h3>
            <p className="text-sm opacity-80">
              Enterprise software solutions built for modern business challenges.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#products" className="opacity-80 hover:opacity-100 transition">Products</Link></li>
              <li><Link href="/products/medflow" className="opacity-80 hover:opacity-100 transition">MedFlow</Link></li>
              <li><Link href="#features" className="opacity-80 hover:opacity-100 transition">Features</Link></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#who-we-serve" className="opacity-80 hover:opacity-100 transition">Who We Serve</Link></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">About Us</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Blog</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Privacy Policy</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Terms of Service</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition">Security</a></li>
              <li><Link href="/contact" className="opacity-80 hover:opacity-100 transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-70">© 2026 LadybugData. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Twitter</a>
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition">LinkedIn</a>
              <a href="#" className="text-sm opacity-70 hover:opacity-100 transition">Facebook</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
