'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from './ui/Container';
import { supabase } from '@/lib/supabase';

interface NavLink {
  id: string;
  label: string;
  url: string;
  location: string;
  section: string;
  order_index: number;
  enabled: boolean;
}

export default function Footer() {
  const [company, setCompany] = useState<NavLink[]>([]);
  const [legal, setLegal] = useState<NavLink[]>([]);
  const [product, setProduct] = useState<NavLink[]>([]);
  const [support, setSupport] = useState<NavLink[]>([]);

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_links')
        .select('*')
        .eq('location', 'footer')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Footer error:', error);
        return;
      }

      console.log('Footer data loaded:', data);

      const links = data || [];
      setCompany(links.filter(l => l.section === 'company'));
      setLegal(links.filter(l => l.section === 'legal'));
      setProduct(links.filter(l => l.section === 'product'));
      setSupport(links.filter(l => l.section === 'support'));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <footer className="bg-ladybug-dark text-white border-t border-slate-700 relative z-10">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-bold mb-4 opacity-90">Company</h4>
            <ul className="space-y-2">
              {company.length > 0 ? (
                company.map(link => (
                  <li key={link.id}>
                    <Link href={link.url} className="text-sm opacity-70 hover:opacity-100 transition">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs opacity-50">No links</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 opacity-90">Legal</h4>
            <ul className="space-y-2">
              {legal.length > 0 ? (
                legal.map(link => (
                  <li key={link.id}>
                    <Link href={link.url} className="text-sm opacity-70 hover:opacity-100 transition">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs opacity-50">No links</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 opacity-90">Product</h4>
            <ul className="space-y-2">
              {product.length > 0 ? (
                product.map(link => (
                  <li key={link.id}>
                    <Link href={link.url} className="text-sm opacity-70 hover:opacity-100 transition">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs opacity-50">No links</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 opacity-90">Support</h4>
            <ul className="space-y-2">
              {support.length > 0 ? (
                support.map(link => (
                  <li key={link.id}>
                    <Link href={link.url} className="text-sm opacity-70 hover:opacity-100 transition">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs opacity-50">No links</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-xs opacity-60">
            © 2026 LadybugData. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
