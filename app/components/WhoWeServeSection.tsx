'use client';

import { motion } from 'framer-motion';
import Container from './ui/Container';

export default function WhoWeServeSection() {
  const segments = [
    {
      title: 'Healthcare Providers',
      description: 'Streamline clinic operations with intelligent scheduling and clinical insights for better patient outcomes.',
    },
    {
      title: 'Enterprise Organizations',
      description: 'Scale your operations with flexible, modern software solutions built for growth and reliability.',
    },
    {
      title: 'Life Sciences & Research',
      description: 'Accelerate research and development with data-driven insights and advanced analytics.',
    },
    {
      title: 'Financial Services',
      description: 'Secure, compliant solutions designed for the financial industry standards and regulations.',
    },
  ];

  return (
    <section id="who-we-serve" className="py-24 bg-white border-b border-slate-300 relative z-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-ladybug-dark mb-4">Who We Serve</h2>
          <p className="text-lg text-ladybug-dark opacity-85 max-w-2xl mx-auto">
            Enterprise-grade software solutions tailored for organizations across industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-ladybug-bg rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-ladybug-crimson rounded-lg flex-shrink-0 mt-1"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ladybug-dark mb-2">{segment.title}</h3>
                  <p className="text-base text-ladybug-dark opacity-80 leading-relaxed">
                    {segment.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
