'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import LadybugVideoBackground from './components/LadybugVideoBackground';
import Container from './components/ui/Container';
import Button from './components/ui/Button';
import Link from 'next/link';
import ProductsSection from './components/ProductsSection';
import WhoWeServeSection from './components/WhoWeServeSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import { supabase } from '@/lib/supabase';

interface Stat {
  id: string;
  label: string;
  value: string;
  description: string;
  dynamic: boolean;
  dynamic_source: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('home_stats')
        .select('*')
        .order('order_index');

      if (error) throw error;

      // Process dynamic stats
      let processedStats = data || [];
      
      for (let stat of processedStats) {
        if (stat.dynamic && stat.dynamic_source === 'clients') {
          const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true });
          stat.value = (count || 0) + '+';
        }
      }

      setStats(processedStats);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-ladybug-bg overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 border-b border-slate-300 relative z-10 min-h-screen flex items-center">
        <LadybugVideoBackground />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-ladybug-dark mb-6 leading-tight">
                <span className="text-ladybug-dark">Enterprise Software</span>
                <br />
                <span className="text-ladybug-crimson">Solutions</span>
                <span className="text-ladybug-dark"> for Modern Organizations</span>
              </h1>

              <p className="text-base text-ladybug-dark mb-10 leading-relaxed max-w-2xl font-medium opacity-85">
                Streamline operations, enhance patient care, and drive growth with intelligent, scalable technology built for healthcare and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/#products">
                  <Button variant="primary" size="lg">Explore Products</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </Link>
              </div>

              <div className="w-16 h-1 bg-ladybug-crimson mb-10"></div>

              {loading ? (
                <div className="grid grid-cols-3 gap-8">
                  <div className="h-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-8">
                  {stats.map(stat => (
                    <div key={stat.id}>
                      <p className="text-3xl font-bold text-ladybug-dark mb-2">{stat.value}</p>
                      <p className="text-sm text-ladybug-dark font-medium opacity-80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="relative z-20 hidden lg:block"></div>
          </div>
        </Container>
      </section>

      <ProductsSection />
      <WhoWeServeSection />
      <FeaturesSection />
      <TestimonialsSection />

      <section className="py-24 bg-white border-b border-slate-300 relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold text-ladybug-dark mb-4">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-lg text-ladybug-dark opacity-85 mb-8 max-w-2xl mx-auto">
              Join leading organizations leveraging our solutions to drive innovation and efficiency.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">Contact Us Today</Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
