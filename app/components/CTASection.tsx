'use client';

import { motion } from 'framer-motion';
import Container from './ui/Container';
import Button from './ui/Button';

export default function CTASection() {
  return (
    <section className="py-24 bg-ladybug-bg border-b border-slate-300 relative z-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-ladybug-dark mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-ladybug-dark opacity-85 mb-10">
            Join leading organizations using LadybugData to streamline operations and unlock growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">Get Started Free</Button>
            <Button variant="secondary" size="lg">Schedule Demo</Button>
          </div>

          {/* Divider */}
          <div className="w-16 h-1 bg-ladybug-crimson mx-auto mt-12 mb-12"></div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div>
              <p className="text-sm text-ladybug-dark opacity-70">Trusted by</p>
              <p className="text-2xl font-bold text-ladybug-dark">350+ Organizations</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300"></div>
            <div>
              <p className="text-sm text-ladybug-dark opacity-70">Serving</p>
              <p className="text-2xl font-bold text-ladybug-dark">10+ Industries</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
