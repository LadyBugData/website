'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  published: boolean;
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  const fetchPage = async () => {
    try {
      console.log('Fetching page with slug:', slug);

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      console.log('Fetched data:', data);
      console.log('Error:', error);

      if (error || !data) {
        setNotFound(true);
      } else {
        setPage(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-ladybug-bg min-h-screen flex items-center justify-center">
        <p className="text-ladybug-dark text-lg">Loading...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="bg-ladybug-bg min-h-screen">
        <Header />
        <section className="pt-32 pb-12 relative z-10 min-h-screen flex items-center">
          <Container>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-ladybug-dark mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-ladybug-dark opacity-85 mb-8">
                Sorry, we couldn't find the page you're looking for.
              </p>
              <Link href="/">
                <Button variant="primary" size="lg">← Back to Home</Button>
              </Link>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-32 pb-12 border-b border-slate-300 relative z-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-ladybug-dark mb-4 leading-tight">
              {page?.title}
            </h1>
            {page?.meta_description && (
              <p className="text-lg text-ladybug-dark opacity-85">
                {page.meta_description}
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="py-12 relative z-10">
        <Container>
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-300 p-12">
            <div className="space-y-6">
              {page?.content.split('\n').map((paragraph, i) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={i} className="text-3xl font-bold text-ladybug-dark mt-8 mb-4">
                      {paragraph.replace(/^# /, '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={i} className="text-2xl font-bold text-ladybug-dark mt-6 mb-3">
                      {paragraph.replace(/^## /, '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={i} className="text-base text-ladybug-dark opacity-85 ml-6 list-disc">
                      {paragraph.replace(/^- /, '')}
                    </li>
                  );
                }
                if (paragraph.trim() === '') {
                  return <div key={i} className="h-3" />;
                }
                return (
                  <p key={i} className="text-base text-ladybug-dark opacity-85 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 relative z-10">
        <Container className="text-center">
          <p className="text-ladybug-dark opacity-70">
            Questions? <Link href="/contact" className="text-ladybug-crimson font-semibold hover:underline">Contact us</Link>
          </p>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
