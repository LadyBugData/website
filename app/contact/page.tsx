'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface ContactData {
  id: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  form_title: string;
  form_subtitle: string;
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_page')
        .select('*')
        .single();

      if (error) throw error;
      setContactData(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', company: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error:', err);
      alert('Error sending message');
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
    <main className="bg-ladybug-bg overflow-x-hidden">
      <Header />

      <section className="pt-24 pb-20 relative z-10 min-h-screen flex items-center">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-ladybug-dark mb-4 leading-tight">
                {contactData?.title} <span className="text-ladybug-crimson">Together</span>
              </h1>

              <p className="text-base text-ladybug-dark opacity-85 mb-10 leading-relaxed">
                {contactData?.subtitle}
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">EMAIL</p>
                  <a href={`mailto:${contactData?.email}`} className="text-base text-ladybug-crimson hover:text-red-700 transition font-medium">
                    {contactData?.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">PHONE</p>
                  <a href={`tel:${contactData?.phone}`} className="text-base text-ladybug-crimson hover:text-red-700 transition font-medium">
                    {contactData?.phone}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">OFFICE</p>
                  <p className="text-sm text-ladybug-dark opacity-85">
                    {contactData?.address}
                  </p>
                </div>
              </div>

              <div className="w-12 h-1 bg-ladybug-crimson mt-8"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-300 p-8 shadow-lg"
            >
              <h2 className="text-xl font-bold text-ladybug-dark mb-1">{contactData?.form_title}</h2>
              <p className="text-xs text-ladybug-dark opacity-70 mb-6">{contactData?.form_subtitle}</p>

              {submitted && (
                <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
                  ✓ Message sent! We will get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson transition resize-none text-sm"
                    required
                  ></textarea>
                </div>

                <p className="text-xs text-ladybug-dark opacity-60">
                  We respect your privacy. Your information is secure.
                </p>

                <Button variant="primary" size="md" className="w-full">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
