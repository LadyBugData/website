'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import { supabase } from '@/lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await supabase
          .from('faqs')
          .select('*')
          .eq('published', true)
          .order('order_index');
        setFaqs(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];
  
  const displayedFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-20 pb-8 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <h1 className="text-4xl font-bold text-ladybug-dark mb-2">FAQ</h1>
          <p className="text-sm text-ladybug-dark opacity-70">Quick answers to common questions</p>
        </Container>
      </section>

      <section className="py-8 relative z-10">
        <Container>
          <div className="bg-white rounded-lg border border-slate-300 p-6 mb-8">
            <input
              type="text"
              placeholder="Search questions..."
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
              {displayedFaqs.length} of {faqs.length} result{faqs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-ladybug-dark">Loading...</p>
          ) : displayedFaqs.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-300 p-8 text-center">
              <p className="text-sm text-ladybug-dark opacity-70">No questions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedFaqs.map(faq => (
                <div key={faq.id} className="bg-white rounded-lg border border-slate-300 overflow-hidden hover:border-ladybug-crimson transition">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-ladybug-dark">{faq.question}</h3>
                      <p className="text-xs text-ladybug-crimson mt-1">{faq.category}</p>
                    </div>
                    <span className="text-xl text-ladybug-crimson ml-4 flex-shrink-0 font-light">
                      {expandedId === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                      <p className="text-sm text-ladybug-dark opacity-80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-8 bg-white border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <p className="text-sm text-ladybug-dark opacity-70 mb-3">Still have questions?</p>
          <a href="mailto:support@ladybugdata.com" className="inline-block px-4 py-2 bg-ladybug-crimson text-white rounded-md font-semibold text-sm hover:bg-red-700 transition">
            Contact Us
          </a>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
