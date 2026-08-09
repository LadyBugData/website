'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Department {
  id: string;
  name: string;
  email: string;
  description: string;
  order_index: number;
  active: boolean;
}

export default function HelpCenterManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    active: true,
  });
  const router = useRouter();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('help_center_departments')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading departments');
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
          .from('help_center_departments')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        alert('✓ Department updated!');
      } else {
        const { error } = await supabase
          .from('help_center_departments')
          .insert([{ ...formData, order_index: departments.length }]);

        if (error) throw error;
        alert('✓ Department created!');
      }

      setFormData({ name: '', email: '', description: '', active: true });
      setEditingId(null);
      setShowForm(false);
      fetchDepartments();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setFormData({
      name: dept.name,
      email: dept.email,
      description: dept.description,
      active: dept.active,
    });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department?')) return;

    try {
      const { error } = await supabase
        .from('help_center_departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchDepartments();
      alert('✓ Department deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', description: '', active: true });
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Help Center Departments</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Department'}
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-slate-300 p-8 mb-12">
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sales, Technical Support"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Department Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., sales@ladybugdata.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this department"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 border border-slate-300 rounded"
                  />
                  <label htmlFor="active" className="text-sm font-semibold text-ladybug-dark">
                    Active
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

          {departments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No departments yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {departments.map(dept => (
                <div key={dept.id} className="bg-white rounded-lg border border-slate-300 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-ladybug-dark">{dept.name}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          dept.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dept.active ? '🟢 Active' : '⚪ Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-ladybug-dark opacity-70 mb-2">
                        Email: <span className="font-semibold">{dept.email}</span>
                      </p>
                      <p className="text-sm text-ladybug-dark opacity-70">
                        {dept.description}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(dept)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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
