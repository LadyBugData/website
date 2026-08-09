'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import { supabase } from '@/lib/supabase';

interface Doc {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
}

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoc();
  }, [slug]);

  const fetchDoc = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setDoc(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />

      {loading ? (
        <section className="pt-20 pb-8 relative z-10 bg-white">
          <Container>
            <p className="text-ladybug-dark">Loading...</p>
          </Container>
        </section>
      ) : doc ? (
        <>
          <section className="pt-20 pb-8 border-b border-slate-300 relative z-10 bg-white">
            <Container>
              <Link href="/documentation" className="text-sm text-ladybug-crimson hover:opacity-70 mb-4 inline-block">
                ← Back to Documentation
              </Link>
              <h1 className="text-4xl font-bold text-ladybug-dark mb-2">{doc.title}</h1>
              <p className="text-sm text-ladybug-dark opacity-70">{doc.category}</p>
            </Container>
          </section>

          <section className="py-8 relative z-10">
            <Container>
              <div className="max-w-3xl mx-auto bg-white rounded-lg border border-slate-300 p-8">
                <div className="prose prose-sm max-w-none text-ladybug-dark">
                  {doc.content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h2 key={i} className="text-2xl font-bold text-ladybug-dark mt-6 mb-3">
                          {line.replace(/^# /, '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h3 key={i} className="text-xl font-bold text-ladybug-dark mt-4 mb-2">
                          {line.replace(/^## /, '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="text-sm text-ladybug-dark opacity-85 ml-6 list-disc">
                          {line.replace(/^- /, '')}
                        </li>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={i} className="h-3" />;
                    }
                    return (
                      <p key={i} className="text-sm text-ladybug-dark opacity-85 leading-relaxed mb-3">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="max-w-3xl mx-auto mt-8 text-center">
                <p className="text-sm text-ladybug-dark opacity-70 mb-4">Need more help?</p>
                <Link
                  href="/help"
                  className="inline-block px-4 py-2 bg-ladybug-crimson text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition"
                >
                  Contact Support
                </Link>
              </div>
            </Container>
          </section>
        </>
      ) : (
        <section className="pt-20 pb-8 relative z-10 bg-white">
          <Container>
            <p className="text-ladybug-dark">Documentation not found</p>
            <Link href="/documentation" className="text-sm text-ladybug-crimson hover:opacity-70 mt-4 inline-block">
              ← Back to Documentation
            </Link>
          </Container>
        </section>
      )}

      <Footer />
    </div>
  );
}
