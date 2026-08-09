'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Doc {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  order_index: number;
  published: boolean;
  created_at: string;
}

export default function DocumentationManager() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'general',
    published: true,
  });
  const router = useRouter();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setDocs(data || []);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading documentation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('documentation')
          .update({ ...formData, updated_at: new Date() })
          .eq('id', editingId);

        if (error) throw error;
        alert('✓ Documentation updated!');
      } else {
        const { error } = await supabase
          .from('documentation')
          .insert([{ ...formData, order_index: docs.length }]);

        if (error) throw error;
        alert('✓ Documentation created!');
      }

      setFormData({ title: '', slug: '', content: '', category: 'general', published: true });
      setEditingId(null);
      setShowForm(false);
      fetchDocs();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doc: Doc) => {
    setFormData({
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      category: doc.category,
      published: doc.published,
    });
    setEditingId(doc.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this documentation?')) return;

    try {
      const { error } = await supabase
        .from('documentation')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchDocs();
      alert('✓ Documentation deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', slug: '', content: '', category: 'general', published: true });
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Documentation</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Doc'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-slate-300 p-8 mb-12">
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Documentation' : 'Add New Documentation'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Getting Started with MedFlow"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., getting-started"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                  <p className="text-xs text-ladybug-dark opacity-60 mt-1">URL: /documentation/{formData.slug}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter documentation content..."
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                  <p className="text-xs text-ladybug-dark opacity-60 mt-1">Supports Markdown formatting</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Getting Started, API, Troubleshooting"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 border border-slate-300 rounded"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-ladybug-dark">
                    Publish this documentation
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit" disabled={saving}>
                    {saving ? '⏳ Saving...' : editingId ? 'Update' : 'Add'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel} type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {docs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No documentation yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {docs.map(doc => (
                <div key={doc.id} className="bg-white rounded-lg border border-slate-300 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-ladybug-dark">{doc.title}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          doc.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.published ? '🟢 Published' : '⚪ Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-ladybug-dark opacity-70 mb-2">
                        URL: <span className="font-mono text-xs">/documentation/{doc.slug}</span>
                      </p>
                      <p className="text-sm text-ladybug-dark opacity-70">
                        Category: {doc.category}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-xs font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
