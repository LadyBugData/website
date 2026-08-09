'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Container from './ui/Container';
import Button from './ui/Button';
import { supabase } from '@/lib/supabase';

export default function TestimonialsSection() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('featured', true)
        .order('created_at');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || clients.length === 0) return null;

  return (
    <>
      {/* Clients Section */}
      <section className="py-24 bg-white border-b border-slate-300 relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-ladybug-dark mb-4">Trusted by Leading Organizations</h2>
            <p className="text-lg text-ladybug-dark opacity-85 max-w-2xl mx-auto">
              Enterprise organizations worldwide rely on LadybugData to transform their operations.
            </p>
          </motion.div>

          {/* Client Logos - No Borders */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clients.map((client, index) => (
              <motion.button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer group hover:scale-105 transition-transform"
              >
                {client.logo_url ? (
                  <img 
                    src={client.logo_url} 
                    alt={client.name}
                    className="h-32 w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-sm font-semibold text-ladybug-dark text-center opacity-80 group-hover:opacity-100 transition-opacity">
                    {client.name}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Container>
      </section>

      {/* Client Modal Popup */}
      {selectedClient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center p-4"
          onClick={() => setSelectedClient(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-ladybug-dark hover:text-ladybug-crimson text-3xl font-bold transition"
            >
              ✕
            </button>

            {/* Client Header */}
            <div className="flex items-center gap-6 mb-8">
              {selectedClient.logo_url && (
                <img 
                  src={selectedClient.logo_url} 
                  alt={selectedClient.name}
                  className="h-32 w-32 object-contain flex-shrink-0"
                />
              )}
              <div>
                <h2 className="text-3xl font-bold text-ladybug-dark mb-2">{selectedClient.name}</h2>
                <p className="text-lg text-ladybug-dark opacity-70">{selectedClient.industry}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-16 h-1 bg-ladybug-crimson mb-6"></div>

            {/* Testimonial */}
            <p className="text-lg text-ladybug-dark opacity-85 italic leading-relaxed mb-8">
              "{selectedClient.testimonial}"
            </p>

            {/* Close Button */}
            <div className="text-right">
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setSelectedClient(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
