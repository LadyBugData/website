'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface NavLink {
  id: string;
  label: string;
  url: string;
  location: 'header' | 'footer';
  section: string;
  order_index: number;
  enabled: boolean;
}

interface GroupedLinks {
  [key: string]: NavLink[];
}

export default function NavigationManager() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedLinks>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    location: 'header' as const,
    section: 'main',
  });
  const router = useRouter();

  const sections: Record<string, Array<{ id: string; label: string }>> = {
    header: [{ id: 'main', label: 'Main Menu' }],
    footer: [
      { id: 'company', label: 'Company' },
      { id: 'legal', label: 'Legal' },
      { id: 'product', label: 'Product' },
      { id: 'support', label: 'Support' },
    ],
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_links')
        .select('*')
        .order('location, section, order_index');

      if (error) throw error;

      setLinks(data || []);

      const grouped: GroupedLinks = {};
      (data || []).forEach((link: NavLink) => {
        const key = `${link.location}-${link.section}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(link);
      });

      setGroupedLinks(grouped);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('navigation_links')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('navigation_links')
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({ label: '', url: '', location: 'header', section: 'main' });
      setEditingId(null);
      setShowForm(false);
      fetchLinks();
      alert('✓ Link saved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (link: NavLink) => {
    setFormData({
      label: link.label,
      url: link.url,
      location: link.location,
      section: link.section,
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;

    try {
      const { error } = await supabase
        .from('navigation_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLinks();
      alert('✓ Link deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ label: '', url: '', location: 'header', section: 'main' });
  };

  const getSectionLabel = (location: string, section: string) => {
    const sectionList = sections[location] || [];
    return sectionList.find((s) => s.id === section)?.label || section;
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Navigation</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Link'}
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-300 p-8 mb-12"
            >
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Link' : 'Add New Link'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Link Label</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Products, Privacy Policy"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Link URL</label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="e.g., /products, /#features, /privacy"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as 'header' | 'footer', section: 'main' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  >
                    <option value="header">Header Navigation</option>
                    <option value="footer">Footer Navigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  >
                    {(sections[formData.location] || []).map((sec) => (
                      <option key={sec.id} value={sec.id}>{sec.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit">{editingId ? 'Update Link' : 'Add Link'}</Button>
                  <Button variant="outline" size="lg" onClick={handleCancel} type="button">Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          {Object.keys(groupedLinks).length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No navigation links yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedLinks).map(([key, linksInGroup]) => {
                const [location, section] = key.split('-');
                return (
                  <div key={key}>
                    <h3 className="text-2xl font-bold text-ladybug-dark mb-4 pb-3 border-b border-slate-300">
                      {location === 'header' ? 'Header' : 'Footer'} — {getSectionLabel(location, section)}
                    </h3>
                    <div className="space-y-4">
                      {linksInGroup.map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white rounded-lg border border-slate-300 p-6 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="text-lg font-bold text-ladybug-dark">{link.label}</h4>
                            <p className="text-sm text-ladybug-dark opacity-70">{link.url}</p>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="primary" size="sm" onClick={() => handleEdit(link)}>Edit</Button>
                            <button onClick={() => handleDelete(link.id)} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-semibold transition">Delete</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
