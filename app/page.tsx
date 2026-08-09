'use client';

import { motion } from 'framer-motion';
import Header from './components/Header';
import LadybugVideoBackground from './components/LadybugVideoBackground';
import Container from './components/ui/Container';
import Button from './components/ui/Button';
import Link from 'next/link';
import ProductsSection from './components/ProductsSection';
import WhoWeServeSection from './components/WhoWeServeSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';

export default function Home() {
  return (
    <main className="bg-ladybug-bg overflow-x-hidden">
      <Header />

      {/* Hero Section - Split Screen */}
      <section className="pt-20 pb-12 border-b border-slate-300 relative z-10 min-h-screen flex items-center">
        <LadybugVideoBackground />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              {/* Main Heading - Black & Red */}
              <h1 className="text-4xl lg:text-5xl font-bold text-ladybug-dark mb-6 leading-tight">
                <span className="text-ladybug-dark">Enterprise Software</span>
                <br />
                <span className="text-ladybug-crimson">Solutions</span>
                <span className="text-ladybug-dark"> for Modern Organizations</span>
              </h1>

              {/* Description */}
              <p className="text-base text-ladybug-dark mb-10 leading-relaxed max-w-2xl font-medium opacity-85">
                Streamline operations, enhance patient care, and drive growth with intelligent, scalable technology built for healthcare and beyond.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/#products">
                  <Button variant="primary" size="lg">Explore Products</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </Link>
              </div>

              {/* Divider Line */}
              <div className="w-16 h-1 bg-ladybug-crimson mb-10"></div>

              {/* Trust Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold text-ladybug-dark mb-2">350+</p>
                  <p className="text-sm text-ladybug-dark font-medium opacity-80">Organizations</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-ladybug-dark mb-2">99.9%</p>
                  <p className="text-sm text-ladybug-dark font-medium opacity-80">Uptime</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-ladybug-dark mb-2">24/7</p>
                  <p className="text-sm text-ladybug-dark font-medium opacity-80">Support</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Empty for Ladybug Video */}
            <div className="relative z-20 hidden lg:block"></div>
          </div>
        </Container>
      </section>

      {/* Products */}
      <ProductsSection />

      {/* Who We Serve */}
      <WhoWeServeSection />

      {/* Features */}
      <FeaturesSection />

      {/* Testimonials & Clients */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-24 bg-white border-b border-slate-300 relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold text-ladybug-dark mb-4">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-lg text-ladybug-dark opacity-85 mb-8 max-w-2xl mx-auto">
              Join leading organizations leveraging our solutions to drive innovation and efficiency.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">Contact Us Today</Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-ladybug-dark text-white relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/" className="hover:text-ladybug-crimson transition">Home</Link></li>
                <li><Link href="/#products" className="hover:text-ladybug-crimson transition">Products</Link></li>
                <li><Link href="/contact" className="hover:text-ladybug-crimson transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-ladybug-crimson transition">Privacy</a></li>
                <li><a href="#" className="hover:text-ladybug-crimson transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-ladybug-crimson transition">Features</a></li>
                <li><a href="#" className="hover:text-ladybug-crimson transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-ladybug-crimson transition">Help Center</a></li>
                <li><a href="#" className="hover:text-ladybug-crimson transition">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm opacity-70">
            <p>© 2026 LadybugData. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
