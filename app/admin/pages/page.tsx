'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface PageVersion {
  id: string;
  page_id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    meta_description: '',
    published: true,
  });
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading pages');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
      setSelectedPageId(pageId);
      setShowHistory(true);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        // Save version first
        const page = pages.find((p) => p.id === editingId);
        if (page && (page.title !== formData.title || page.content !== formData.content)) {
          await supabase.from('page_versions').insert([
            {
              page_id: editingId,
              title: page.title,
              content: page.content,
            },
          ]);
        }

        // Update page
        const { error } = await supabase
          .from('pages')
          .update({
            ...formData,
            updated_at: new Date(),
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('✓ Page updated!');
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([formData]);

        if (error) throw error;
        alert('✓ Page created!');
      }

      setFormData({
        slug: '',
        title: '',
        content: '',
        meta_description: '',
        published: true,
      });
      setEditingId(null);
      setShowForm(false);
      fetchPages();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page: Page) => {
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      meta_description: page.meta_description,
      published: page.published,
    });
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page and all its versions?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPages();
      alert('✓ Page deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_description: '',
      published: true,
    });
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Pages</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Create Page'}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-300 p-8 mb-12"
            >
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Page' : 'Create New Page'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Page Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., careers, terms, privacy, about"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    disabled={!!editingId}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">URL: /{ formData.slug }</p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Careers, Terms of Service"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Meta Description (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Brief description for search engines"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Page Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your page content here..."
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Supports markdown formatting</p>
                </div>

                {/* Published */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 border border-slate-300 rounded"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-ladybug-dark">
                    Publish this page
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit" disabled={saving}>
                    {saving ? '⏳ Saving...' : editingId ? 'Update Page' : 'Create Page'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Pages Grid */}
          {pages.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No pages yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page, index) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-slate-300 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-ladybug-dark">
                          {page.title}
                        </h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          page.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.published ? '🟢 Published' : '⚪ Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-ladybug-dark opacity-70 mb-2">
                        URL: /{page.slug}
                      </p>
                      <p className="text-sm text-ladybug-dark opacity-70">
                        {page.content.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fetchVersions(page.id)}
                      >
                        History
                      </Button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-xs font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-auto p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-ladybug-dark">
                Version History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-2xl text-ladybug-dark hover:text-ladybug-crimson"
              >
                ✕
              </button>
            </div>

            {versions.length === 0 ? (
              <p className="text-ladybug-dark">No previous versions</p>
            ) : (
              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="border border-slate-300 rounded-lg p-4"
                  >
                    <p className="text-sm font-bold text-ladybug-dark mb-2">
                      {version.title}
                    </p>
                    <p className="text-xs text-slate-500 mb-2">
                      {new Date(version.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-ladybug-dark opacity-70">
                      {version.content.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
