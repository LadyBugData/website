'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/app/components/Header';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <main className="bg-ladybug-bg overflow-x-hidden">
      <Header />

      {/* Main Contact Section */}
      <section className="pt-24 pb-20 relative z-10 min-h-screen flex items-center">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-ladybug-dark mb-4 leading-tight">
                Let's Work <span className="text-ladybug-crimson">Together</span>
              </h1>

              <p className="text-base text-ladybug-dark opacity-85 mb-10 leading-relaxed">
                Have questions? Our team is ready to help you find the perfect solution.
              </p>

              {/* Contact Methods - Minimal */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">EMAIL</p>
                  <a href="mailto:hello@ladybugdata.com" className="text-base text-ladybug-crimson hover:text-red-700 transition font-medium">
                    hello@ladybugdata.com
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">PHONE</p>
                  <a href="tel:+1234567890" className="text-base text-ladybug-crimson hover:text-red-700 transition font-medium">
                    +1 (234) 567-890
                  </a>
                </div>

                <div>
                  <p className="text-xs text-ladybug-dark opacity-70 font-semibold mb-1">OFFICE</p>
                  <p className="text-sm text-ladybug-dark opacity-85">
                    123 Innovation Drive<br />
                    Tech Valley, CA 94025
                  </p>
                </div>
              </div>

              <div className="w-12 h-1 bg-ladybug-crimson mt-8"></div>
            </motion.div>

            {/* Right: Contact Form - Compact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-300 p-8 shadow-lg"
            >
              <h2 className="text-xl font-bold text-ladybug-dark mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson focus:ring-2 focus:ring-ladybug-crimson focus:ring-opacity-20 transition text-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson focus:ring-2 focus:ring-ladybug-crimson focus:ring-opacity-20 transition text-sm"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson focus:ring-2 focus:ring-ladybug-crimson focus:ring-opacity-20 transition text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-ladybug-dark mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson focus:ring-2 focus:ring-ladybug-crimson focus:ring-opacity-20 transition resize-none text-sm"
                    required
                  ></textarea>
                </div>

                {/* Privacy Note */}
                <p className="text-xs text-ladybug-dark opacity-60">
                  We respect your privacy. Your information is secure.
                </p>

                {/* Submit Button */}
                <Button variant="primary" size="md" className="w-full">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <section className="py-8 bg-white border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <p className="text-ladybug-dark text-xs opacity-70">© 2026 LadybugData. All rights reserved.</p>
        </Container>
      </section>
    </main>
  );
}
