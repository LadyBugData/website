'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  icon_url: string;
}

interface PricingTier {
  id: string;
  product_id: string;
  tier_name: string;
  price: string;
  billing_cycle: string;
  description: string;
  features: string[];
  cta_text: string;
  cta_link: string;
  is_featured: boolean;
  order_index: number;
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pRes = await supabase.from('products').select('*').order('created_at');
      const prRes = await supabase.from('product_pricing').select('*').order('order_index');
      setProducts(pRes.data || []);
      setPricing(prRes.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    if (selectedProductId === productId) {
      setSelectedProductId(null);
    } else {
      setSelectedProductId(productId);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedPricing = selectedProductId ? pricing.filter(p => p.product_id === selectedProductId) : [];

  if (loading) {
    return (
      <div className="bg-ladybug-bg min-h-screen flex items-center justify-center">
        <p className="text-ladybug-dark">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-32 pb-12 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <h1 className="text-5xl font-bold text-ladybug-dark mb-4">Pricing Plans</h1>
          <p className="text-lg text-ladybug-dark opacity-85">Select a product to view our transparent pricing</p>
        </Container>
      </section>

      <section className="py-12 relative z-10">
        <Container>
          <h2 className="text-3xl font-bold text-ladybug-dark mb-8">Choose a Product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className={`rounded-xl border-2 p-8 text-left transition-all h-full ${
                  selectedProductId === product.id
                    ? 'border-ladybug-crimson bg-white shadow-lg'
                    : 'border-slate-300 bg-white hover:border-ladybug-crimson hover:shadow-md'
                }`}
              >
                {product.icon_url && (
                  <img
                    src={product.icon_url}
                    alt={product.name}
                    className="w-12 h-12 mb-4 object-cover"
                  />
                )}
                <h3 className="text-2xl font-bold text-ladybug-dark mb-2">{product.name}</h3>
                <p className="text-sm text-ladybug-dark opacity-70">{product.description}</p>
                {selectedProductId === product.id && (
                  <div className="mt-4 text-ladybug-crimson font-semibold">✓ Selected</div>
                )}
              </button>
            ))}
          </div>

          {selectedProductId && selectedProduct && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-ladybug-dark mb-2">{selectedProduct.name} Pricing</h2>
                <p className="text-base text-ladybug-dark opacity-70">Choose the plan that fits your needs</p>
              </div>

              {selectedPricing.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-300 p-12 text-center">
                  <p className="text-lg text-ladybug-dark opacity-85">No pricing plans available for this product</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedPricing.map(tier => (
                    <div
                      key={tier.id}
                      className={`rounded-xl border-2 p-8 flex flex-col h-full transition-all ${
                        tier.is_featured
                          ? 'border-ladybug-crimson bg-white shadow-lg'
                          : 'border-slate-300 bg-white hover:shadow-md'
                      }`}
                    >
                      {tier.is_featured && (
                        <span className="inline-block px-3 py-1 bg-red-50 text-ladybug-crimson text-xs font-bold rounded-full mb-4 w-fit">
                          MOST POPULAR
                        </span>
                      )}

                      <h3 className="text-2xl font-bold text-ladybug-dark mb-2">{tier.tier_name}</h3>

                      {tier.description && (
                        <p className="text-sm text-ladybug-dark opacity-70 mb-6">{tier.description}</p>
                      )}

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-ladybug-dark">${tier.price}</span>
                          <span className="text-sm text-ladybug-dark opacity-70">
                            {tier.billing_cycle === 'monthly' ? 'per month' : tier.billing_cycle === 'yearly' ? 'per year' : 'custom'}
                          </span>
                        </div>
                      </div>

                      {tier.features && tier.features.length > 0 && (
                        <div className="mb-8 flex-1">
                          <ul className="space-y-3">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-ladybug-crimson font-bold text-lg">✓</span>
                                <span className="text-sm text-ladybug-dark opacity-85">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Link href={tier.cta_link || '/contact'}>
                        <Button variant="primary" size="lg" className="w-full">
                          {tier.cta_text || 'Get Started'}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <section className="py-12 bg-white border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <h2 className="text-3xl font-bold text-ladybug-dark mb-4">Custom Enterprise Plans</h2>
          <p className="text-lg text-ladybug-dark opacity-85 mb-8">Need something tailored? Contact our sales team.</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 border-2 border-ladybug-crimson text-ladybug-crimson rounded-lg font-semibold hover:bg-red-50 transition"
          >
            Contact Sales
          </Link>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
