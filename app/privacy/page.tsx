'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import { supabase } from '@/lib/supabase';

interface Policy {
  id: string;
  content: string;
  version: number;
  effective_date: string;
}

export default function PrivacyPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error('Error:', error);
      } else {
        setPolicy(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-32 pb-12 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <h1 className="text-5xl lg:text-6xl font-bold text-ladybug-dark mb-4">Privacy Policy</h1>
          {policy?.effective_date && (
            <p className="text-base text-ladybug-dark opacity-70">
              Last updated: {new Date(policy.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </Container>
      </section>

      <section className="py-12 relative z-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <p className="text-ladybug-dark text-lg">Loading...</p>
            ) : policy ? (
              <div className="bg-white rounded-xl border border-slate-300 p-12">
                <div className="prose prose-lg max-w-none text-ladybug-dark">
                  {policy.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h2 key={i} className="text-3xl font-bold text-ladybug-dark mt-8 mb-4">
                          {line.replace(/^# /, '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h3 key={i} className="text-2xl font-bold text-ladybug-dark mt-6 mb-3">
                          {line.replace(/^## /, '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="text-base text-ladybug-dark opacity-85 ml-6 list-disc">
                          {line.replace(/^- /, '')}
                        </li>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={i} className="h-3" />;
                    }
                    return (
                      <p key={i} className="text-base text-ladybug-dark opacity-85 leading-relaxed mb-4">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-ladybug-dark">No policy found</p>
            )}
          </div>
        </Container>
      </section>

      <section className="py-12 bg-white border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <p className="text-ladybug-dark opacity-70 mb-4">
            Questions about our privacy practices?
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-ladybug-crimson text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Contact Us
          </Link>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
