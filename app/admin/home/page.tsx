'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface ContentItem {
  id: string;
  key: string;
  label: string;
  value: string;
  draft_value: string | null;
  section: string;
  order_index: number;
}

interface GroupedContent {
  [key: string]: ContentItem[];
}

interface DraftValues {
  [key: string]: string;
}

export default function HomePageEditor() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [groupedContent, setGroupedContent] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftValues, setDraftValues] = useState<DraftValues>({});
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'who_we_serve', label: 'Who We Serve' },
    { id: 'features', label: 'Features' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'cta', label: 'Call to Action' },
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .order('section, order_index');

      if (error) throw error;

      setContent(data || []);

      const grouped: GroupedContent = {};
      const drafts: DraftValues = {};
      
      (data || []).forEach((item: ContentItem) => {
        if (!grouped[item.section]) {
          grouped[item.section] = [];
        }
        grouped[item.section].push(item);
        drafts[item.key] = item.draft_value || item.value;
      });

      setGroupedContent(grouped);
      setDraftValues(drafts);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    const original = content.find((c) => c.key === key)?.value || '';
    setHasChanges(value !== original);
    setDraftValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      for (const key in draftValues) {
        const item = content.find((c) => c.key === key);
        if (item && item.draft_value !== draftValues[key]) {
          const { error } = await supabase
            .from('home_content')
            .update({ draft_value: draftValues[key] })
            .eq('key', key);

          if (error) throw error;
        }
      }

      alert('✓ Draft saved! Ready to publish.');
      setHasChanges(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish all changes to live website?')) return;

    setSaving(true);
    try {
      for (const key in draftValues) {
        const item = content.find((c) => c.key === key);
        if (item && item.draft_value !== null) {
          const { error } = await supabase
            .from('home_content')
            .update({ 
              value: draftValues[key],
              draft_value: null,
              updated_at: new Date()
            })
            .eq('key', key);

          if (error) throw error;
        }
      }

      alert('✓ Published! Changes are now live.');
      setHasChanges(false);
      fetchContent();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm('Discard all unsaved changes?')) {
      fetchContent();
      setHasChanges(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-ladybug-bg min-h-screen flex items-center justify-center">
        <p className="text-ladybug-dark text-lg">Loading...</p>
      </main>
    );
  }

  return (
    <main className="bg-ladybug-bg overflow-x-hidden">
      {/* Header */}
      <header className="bg-ladybug-dark text-white border-b border-slate-700 sticky top-0 z-50">
        <Container className="py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Edit Home Page</h1>
            <p className="text-slate-400 text-sm mt-1">Save as draft, then publish to live website</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 hover:text-ladybug-crimson text-white font-semibold transition"
          >
            ← Back
          </button>
        </Container>
      </header>

      {/* Main Content - Split Screen */}
      <section className="py-12 relative z-10 min-h-screen">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT: Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl border border-slate-300 p-8 hover:shadow-lg transition-all"
                >
                  <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                    {section.label}
                  </h3>

                  {groupedContent[section.id] && groupedContent[section.id].length > 0 ? (
                    <div className="space-y-6">
                      {groupedContent[section.id].map((item: ContentItem) => (
                        <div key={item.key}>
                          <label className="block text-sm font-semibold text-ladybug-dark mb-3">
                            {item.label}
                          </label>
                          {item.key.includes('description') ? (
                            <textarea
                              value={draftValues[item.key] || ''}
                              onChange={(e) => handleChange(item.key, e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                              placeholder="Enter text..."
                            />
                          ) : (
                            <input
                              type="text"
                              value={draftValues[item.key] || ''}
                              onChange={(e) => handleChange(item.key, e.target.value)}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                              placeholder="Enter text..."
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-ladybug-dark opacity-70">No content</p>
                  )}
                </div>
              ))}
            </motion.div>

            {/* RIGHT: Preview & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-20 space-y-4"
            >
              {/* Save Draft */}
              <button
                onClick={handleSaveDraft}
                disabled={!hasChanges || saving}
                className="w-full px-6 py-4 bg-ladybug-crimson hover:bg-red-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition text-lg disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Saving...' : '💾 Save as Draft'}
              </button>

              {/* Publish */}
              <button
                onClick={handlePublish}
                disabled={saving}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition text-lg disabled:cursor-not-allowed"
              >
                {saving ? '⏳ Publishing...' : '🚀 Publish to Live'}
              </button>

              {/* Discard */}
              <button
                onClick={handleDiscard}
                disabled={!hasChanges || saving}
                className="w-full px-6 py-4 border-2 border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-bold transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Discard Changes
              </button>

              {/* Preview Panel - Exact Homepage Design */}
              <div className="bg-white rounded-xl border border-slate-300 p-8 mt-8">
                <div className="space-y-8">
                  {/* HERO SECTION PREVIEW */}
                  <div>
                    {/* Accent Badge */}
                    <div className="inline-flex items-center gap-2 mb-6 bg-white px-4 py-2 rounded-full border border-slate-300">
                      <span className="w-2 h-2 bg-ladybug-crimson rounded-full"></span>
                      <span className="text-sm font-semibold text-ladybug-dark">Enterprise Software Solutions</span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-4xl font-bold text-ladybug-dark mb-6 leading-tight">
                      {draftValues['hero_title']}
                    </h1>

                    {/* Hero Description */}
                    <p className="text-base text-ladybug-dark mb-8 leading-relaxed font-medium opacity-85">
                      {draftValues['hero_description']}
                    </p>

                    {/* Buttons Preview */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <div className="px-6 py-3 bg-ladybug-crimson text-white rounded-lg font-semibold text-sm">
                        Get Started
                      </div>
                      <div className="px-6 py-3 border border-slate-300 text-ladybug-dark rounded-lg font-semibold text-sm">
                        Schedule Demo
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-ladybug-crimson mb-8"></div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-3xl font-bold text-ladybug-dark mb-1">350+</p>
                        <p className="text-xs text-ladybug-dark font-medium opacity-80">Organizations Served</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-ladybug-dark mb-1">99.9%</p>
                        <p className="text-xs text-ladybug-dark font-medium opacity-80">Uptime SLA</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-ladybug-dark mb-1">24/7</p>
                        <p className="text-xs text-ladybug-dark font-medium opacity-80">Expert Support</p>
                      </div>
                    </div>
                  </div>

                  {/* OTHER SECTIONS */}
                  <div className="pt-8 border-t border-slate-300 space-y-4">
                    {sections.slice(1).map((section) => (
                      <div key={section.id}>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                          {section.label}
                        </h5>
                        <p className="text-sm text-ladybug-dark font-medium opacity-85">
                          {draftValues[`${section.id}_title`] || draftValues[`${section.id}_description`]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {hasChanges && (
                  <div className="mt-8 pt-6 border-t border-slate-300 text-sm text-ladybug-crimson font-semibold">
                    ● You have unsaved changes
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
