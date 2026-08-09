'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface ContactPage {
  id: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  form_title: string;
  form_subtitle: string;
}

export default function ContactManager() {
  const [data, setData] = useState<ContactPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    email: '',
    phone: '',
    address: '',
    form_title: '',
    form_subtitle: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data: result, error } = await supabase
        .from('contact_page')
        .select('*')
        .single();

      if (error) throw error;
      if (result) {
        setData(result);
        setFormData(result);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading contact data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (data) {
        const { error } = await supabase
          .from('contact_page')
          .update({ ...formData, updated_at: new Date() })
          .eq('id', data.id);

        if (error) throw error;
        alert('✓ Contact page updated!');
        fetchContactData();
      }
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
          <h2 className="text-4xl font-bold text-ladybug-dark mb-8">Manage Contact Page</h2>

          <div className="bg-white rounded-xl border border-slate-300 p-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Page Title & Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Get in Touch"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                  Page Subtitle
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Have questions? We would love to hear from you."
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="border-t border-slate-300 pt-6">
                <h3 className="text-lg font-bold text-ladybug-dark mb-4">Contact Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="hello@ladybugdata.com"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Business St, San Francisco, CA 94105"
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="border-t border-slate-300 pt-6">
                <h3 className="text-lg font-bold text-ladybug-dark mb-4">Contact Form</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={formData.form_title}
                      onChange={(e) => setFormData({ ...formData, form_title: e.target.value })}
                      placeholder="Send us a Message"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Form Subtitle
                    </label>
                    <textarea
                      value={formData.form_subtitle}
                      onChange={(e) => setFormData({ ...formData, form_subtitle: e.target.value })}
                      placeholder="Fill out the form and we will get back to you as soon as possible."
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-300">
                <Button variant="primary" size="lg" type="submit" disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
