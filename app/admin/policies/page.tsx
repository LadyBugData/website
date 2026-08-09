'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Policy {
  id: string;
  content: string;
  version: number;
  effective_date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function PoliciesManager() {
  const [privacy, setPrivacy] = useState<Policy | null>(null);
  const [terms, setTerms] = useState<Policy | null>(null);
  const [cookies, setCookies] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy');
  const [formData, setFormData] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const [privacyRes, termsRes, cookiesRes] = await Promise.all([
        supabase.from('privacy_policy').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('terms_of_service').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('cookie_policy').select('*').order('created_at', { ascending: false }).limit(1),
      ]);

      if (privacyRes.data?.[0]) {
        setPrivacy(privacyRes.data[0]);
        if (activeTab === 'privacy') setFormData(privacyRes.data[0].content);
      }
      if (termsRes.data?.[0]) {
        setTerms(termsRes.data[0]);
        if (activeTab === 'terms') setFormData(termsRes.data[0].content);
      }
      if (cookiesRes.data?.[0]) {
        setCookies(cookiesRes.data[0]);
        if (activeTab === 'cookies') setFormData(cookiesRes.data[0].content);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading policies');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'privacy' && privacy) setFormData(privacy.content);
    if (tab === 'terms' && terms) setFormData(terms.content);
    if (tab === 'cookies' && cookies) setFormData(cookies.content);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const table = activeTab === 'privacy' ? 'privacy_policy' : activeTab === 'terms' ? 'terms_of_service' : 'cookie_policy';
      const currentPolicy = activeTab === 'privacy' ? privacy : activeTab === 'terms' ? terms : cookies;

      if (!currentPolicy) {
        alert('No policy found');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from(table)
        .update({
          content: formData,
          version: currentPolicy.version + 1,
          effective_date: new Date().toISOString().split('T')[0],
          updated_at: new Date(),
        })
        .eq('id', currentPolicy.id);

      if (error) throw error;
      alert('✓ Policy updated!');
      fetchPolicies();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
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
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-white hover:text-ladybug-crimson text-sm font-semibold transition"
          >
            ← Back
          </button>
        </Container>
      </header>

      <section className="py-12">
        <Container>
          <h2 className="text-4xl font-bold text-ladybug-dark mb-8">Manage Policies</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-300">
            {[
              { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
              { id: 'terms', label: 'Terms of Service', icon: '📋' },
              { id: 'cookies', label: 'Cookie Policy', icon: '🍪' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-4 font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-ladybug-crimson text-ladybug-crimson'
                    : 'border-transparent text-ladybug-dark opacity-70 hover:opacity-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-300 p-8"
          >
            <div className="mb-6">
              <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                Policy Content
              </label>
              <textarea
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none font-mono"
                placeholder="Enter policy content..."
              />
              <p className="text-xs text-slate-500 mt-2">Supports Markdown formatting with # headings, ## subheadings, and line breaks.</p>
            </div>

            {/* Version Info */}
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-ladybug-dark">
                <span className="font-semibold">Current Version:</span>{' '}
                {activeTab === 'privacy' ? privacy?.version : activeTab === 'terms' ? terms?.version : cookies?.version}
              </p>
              <p className="text-sm text-ladybug-dark">
                <span className="font-semibold">Last Updated:</span>{' '}
                {activeTab === 'privacy'
                  ? new Date(privacy?.updated_at || '').toLocaleDateString()
                  : activeTab === 'terms'
                  ? new Date(terms?.updated_at || '').toLocaleDateString()
                  : new Date(cookies?.updated_at || '').toLocaleDateString()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '⏳ Saving...' : '💾 Save & Update'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => fetchPolicies()}>
                Discard Changes
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
