'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Stat {
  id: string;
  label: string;
  value: string;
  description: string;
  order_index: number;
  dynamic: boolean;
  dynamic_source: string;
}

export default function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    description: '',
    dynamic: false,
    dynamic_source: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('home_stats')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setStats(data || []);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading stats');
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
          .from('home_stats')
          .update({ ...formData, updated_at: new Date() })
          .eq('id', editingId);

        if (error) throw error;
        alert('✓ Stat updated!');
      } else {
        const { error } = await supabase
          .from('home_stats')
          .insert([{ ...formData, order_index: stats.length }]);

        if (error) throw error;
        alert('✓ Stat created!');
      }

      setFormData({ label: '', value: '', description: '', dynamic: false, dynamic_source: '' });
      setEditingId(null);
      setShowForm(false);
      fetchStats();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (stat: Stat) => {
    setFormData({
      label: stat.label,
      value: stat.value,
      description: stat.description,
      dynamic: stat.dynamic,
      dynamic_source: stat.dynamic_source || '',
    });
    setEditingId(stat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return;

    try {
      const { error } = await supabase
        .from('home_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStats();
      alert('✓ Stat deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ label: '', value: '', description: '', dynamic: false, dynamic_source: '' });
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Home Stats</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Stat'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-slate-300 p-8 mb-12">
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Stat' : 'Add New Stat'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Organizations"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="dynamic"
                    checked={formData.dynamic}
                    onChange={(e) => setFormData({ ...formData, dynamic: e.target.checked })}
                    className="w-4 h-4 border border-slate-300 rounded"
                  />
                  <label htmlFor="dynamic" className="text-sm font-semibold text-ladybug-dark">
                    Dynamic (pull from database)
                  </label>
                </div>

                {formData.dynamic ? (
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Data Source
                    </label>
                    <select
                      value={formData.dynamic_source}
                      onChange={(e) => setFormData({ ...formData, dynamic_source: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                      required
                    >
                      <option value="">Select source...</option>
                      <option value="clients">Number of Clients</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="e.g., 99.9%"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Trusted clinics using our platform"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit" disabled={saving}>
                    {saving ? '⏳ Saving...' : editingId ? 'Update Stat' : 'Add Stat'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel} type="button">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {stats.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No stats yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={stat.id} className="bg-white rounded-lg border border-slate-300 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-ladybug-dark">{stat.label}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          stat.dynamic
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {stat.dynamic ? '🔄 Dynamic' : '📝 Static'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-ladybug-crimson mb-2">{stat.value}</p>
                      <p className="text-sm text-ladybug-dark opacity-70">
                        {stat.description}
                      </p>
                      {stat.dynamic && (
                        <p className="text-xs text-blue-600 mt-2">
                          Source: {stat.dynamic_source}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(stat)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDelete(stat.id)}
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
