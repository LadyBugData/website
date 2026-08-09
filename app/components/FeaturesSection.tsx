'use client';

import { motion } from 'framer-motion';
import Container from './ui/Container';

export default function FeaturesSection() {
  const features = [
    {
      title: 'AI-Powered Intelligence',
      description: 'Machine learning that learns from your data and improves over time.',
    },
    {
      title: 'Enterprise-Grade Security',
      description: 'Industry-leading security standards with compliance certifications.',
    },
    {
      title: '99.9% Uptime SLA',
      description: 'Reliable infrastructure built for mission-critical operations.',
    },
    {
      title: '24/7 Expert Support',
      description: 'Dedicated support team ready to help whenever you need.',
    },
    {
      title: 'Scalable Architecture',
      description: 'Grows with your business without performance degradation.',
    },
    {
      title: 'Easy Integration',
      description: 'Seamlessly connect with your existing tools and systems.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-b border-slate-300 relative z-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-ladybug-dark mb-4">Why Choose LadybugData</h2>
          <p className="text-lg text-ladybug-dark opacity-85 max-w-2xl mx-auto">
            Built with the features enterprises demand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-ladybug-bg rounded-xl p-8 border border-slate-300"
            >
              <div className="w-12 h-12 bg-ladybug-crimson rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold text-ladybug-dark mb-3">{feature.title}</h3>
              <p className="text-base text-ladybug-dark opacity-80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
