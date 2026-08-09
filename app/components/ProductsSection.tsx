'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from './ui/Container';
import Button from './ui/Button';
import { supabase } from '@/lib/supabase';

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="products" className="py-24 bg-ladybug-bg border-b border-slate-300 relative z-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-ladybug-dark mb-4">Our Products</h2>
          <p className="text-lg text-ladybug-dark opacity-85 max-w-2xl mx-auto">
            Powerful solutions built for modern business challenges.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-ladybug-dark">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-300 p-5 hover:border-ladybug-crimson transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Logo + Name */}
                <div className="flex items-center gap-3 mb-2">
                  {product.icon_url && (
                    <img 
                      src={product.icon_url} 
                      alt={product.name}
                      className="h-28 w-28 object-contain flex-shrink-0"
                    />
                  )}
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-ladybug-crimson to-ladybug-dark bg-clip-text text-transparent">
                    {product.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-ladybug-dark opacity-85 mb-4 leading-relaxed flex-grow">
                  {product.description}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Link href={`/products/${product.slug}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Book Demo
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
