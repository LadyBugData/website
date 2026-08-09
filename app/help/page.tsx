'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Department {
  id: string;
  name: string;
  email: string;
  description: string;
}

export default function HelpPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('help_center_departments')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (error) throw error;
      setDepartments(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, department_id: data[0].id }));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('help_center_messages')
        .insert([formData]);

      if (error) throw error;
      setSuccess(true);
      setFormData({ name: '', email: '', department_id: departments[0]?.id || '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="bg-ladybug-bg min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />

      <section className="pt-20 pb-8 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <h1 className="text-4xl font-bold text-ladybug-dark mb-2">Help Center</h1>
          <p className="text-sm text-ladybug-dark opacity-70">Get support from our team</p>
        </Container>
      </section>

      <section className="py-8 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {departments.map(dept => (
              <div key={dept.id} className="bg-white rounded-lg border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-ladybug-dark mb-2">{dept.name}</h3>
                <p className="text-xs text-ladybug-dark opacity-70 mb-3">{dept.description}</p>
                <p className="text-sm text-ladybug-crimson font-semibold">{dept.email}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-slate-300 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-ladybug-dark mb-6">Send Us a Message</h2>

            {success && (
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ladybug-dark mb-2">Department</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  required
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ladybug-dark mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  rows={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                  required
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
