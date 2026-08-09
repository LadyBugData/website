'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Container from '@/app/components/ui/Container';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ products: 0, clients: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/auth/login');
        return;
      }

      setUser(session.user);
      fetchStats();
    } catch (err) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true });

      setStats({
        products: productsCount || 0,
        clients: clientsCount || 0,
        jobs: jobsCount || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="bg-ladybug-bg min-h-screen flex items-center justify-center">
        <p className="text-ladybug-dark">Loading...</p>
      </main>
    );
  }

  return (
    <main className="bg-ladybug-bg min-h-screen">
      <header className="bg-ladybug-dark text-white border-b border-slate-700 sticky top-0 z-50">
        <Container className="py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-6">
            <p className="text-sm opacity-80">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </Container>
      </header>

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-300 p-8"
            >
              <p className="text-sm text-ladybug-dark opacity-70 mb-2">Total Products</p>
              <p className="text-4xl font-bold text-ladybug-dark">{stats.products}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-300 p-8"
            >
              <p className="text-sm text-ladybug-dark opacity-70 mb-2">Trusted Clinics</p>
              <p className="text-4xl font-bold text-ladybug-dark">{stats.clients}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-300 p-8"
            >
              <p className="text-sm text-ladybug-dark opacity-70 mb-2">Job Openings</p>
              <p className="text-4xl font-bold text-ladybug-dark">{stats.jobs}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-300 p-8"
            >
              <p className="text-sm text-ladybug-dark opacity-70 mb-2">Status</p>
              <p className="text-4xl font-bold text-green-600">Live</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Manage Home Page', href: '/admin/home', desc: 'Edit hero, features, testimonials' },
              { title: 'Manage Home Stats', href: '/admin/stats', desc: 'Edit organizations, uptime, support stats' },
              { title: 'Manage Products', href: '/admin/products', desc: 'Add, edit, delete products' },
              { title: 'Manage Clients', href: '/admin/clients', desc: 'Manage clinic testimonials' },
              { title: 'Manage Pricing', href: '/admin/pricing', desc: 'Update pricing tiers' },
              { title: 'Manage Jobs', href: '/admin/jobs', desc: 'Create and manage job openings' },
              { title: 'Manage Contact Page', href: '/admin/contact', desc: 'Edit contact info & form' },
              { title: 'Manage FAQs', href: '/admin/faqs', desc: 'Add and manage FAQ questions' },
              { title: 'Manage Help Center', href: '/admin/help-center', desc: 'Manage departments & emails' },
              { title: 'Manage Documentation', href: '/admin/documentation', desc: 'Create and edit articles' },
              { title: 'Manage Pages', href: '/admin/pages', desc: 'Create careers, about pages' },
              { title: 'Manage Navigation', href: '/admin/navigation', desc: 'Edit header & footer links' },
              { title: 'Manage Policies', href: '/admin/policies', desc: 'Edit privacy, terms, cookie policies' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <div className="bg-white rounded-xl border border-slate-300 p-8 hover:border-ladybug-crimson hover:shadow-lg transition-all cursor-pointer h-full">
                    <h3 className="text-xl font-bold text-ladybug-dark mb-2">{item.title}</h3>
                    <p className="text-sm text-ladybug-dark opacity-70">{item.desc}</p>
                    <p className="text-ladybug-crimson font-semibold mt-4">→ Go to page</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
