'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import { supabase } from '@/lib/supabase';

interface Doc {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
}

export default function DocumentationPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation')
        .select('id, title, slug, category, published')
        .eq('published', true)
        .order('order_index');

      if (error) throw error;
      setDocs(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(docs.map(d => d.category).filter(Boolean)))];
  
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = !searchQuery.trim() || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-20 pb-8 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <h1 className="text-4xl font-bold text-ladybug-dark mb-2">Documentation</h1>
          <p className="text-sm text-ladybug-dark opacity-70">Learn how to use MedFlow and get the most out of our platform</p>
        </Container>
      </section>

      <section className="py-8 relative z-10">
        <Container>
          <div className="bg-white rounded-lg border border-slate-300 p-6 mb-8">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-ladybug-crimson text-sm mb-4"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                    selectedCategory === cat
                      ? 'bg-ladybug-crimson text-white'
                      : 'bg-slate-100 text-ladybug-dark hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            <p className="text-xs text-ladybug-dark opacity-60 mt-3">
              {filteredDocs.length} article{filteredDocs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-ladybug-dark">Loading...</p>
          ) : filteredDocs.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-300 p-8 text-center">
              <p className="text-sm text-ladybug-dark opacity-70">No articles found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map(doc => (
                <Link key={doc.id} href={`/documentation/${doc.slug}`}>
                  <div className="bg-white rounded-lg border border-slate-300 p-6 hover:border-ladybug-crimson hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-ladybug-dark mb-1">{doc.title}</h3>
                    <p className="text-xs text-ladybug-crimson">{doc.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </div>
  );
}
