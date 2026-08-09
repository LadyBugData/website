'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [params.slug]);

  const fetchProductData = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      const { data: featuresData } = await supabase
        .from('product_features')
        .select('*')
        .eq('product_id', productData.id)
        .order('order_index');

      setFeatures(featuresData || []);

      const { data: pricingData } = await supabase
        .from('product_pricing')
        .select('*')
        .eq('product_id', productData.id)
        .order('order_index');

      setPricing(pricingData || []);

      const { data: clientsData } = await supabase
        .from('client_products')
        .select('clients(*)')
        .eq('product_id', productData.id)
        .eq('status', 'active');

      const clinicList = clientsData?.map((cp: any) => cp.clients).filter(Boolean) || [];
      setClients(clinicList);

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('order_index');

      setProductImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const getBillingLabel = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return 'per month';
      case 'yearly':
        return 'per year';
      case 'custom':
        return 'custom pricing';
      default:
        return 'per month';
    }
  };

  if (loading) {
    return (
      <main className="bg-ladybug-bg">
        <Header />
        <section className="pt-32 pb-24 relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-ladybug-dark">Loading...</p>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-ladybug-bg">
        <Header />
        <section className="pt-32 pb-24 relative z-10 min-h-screen flex items-center justify-center">
          <p className="text-ladybug-dark">Product not found</p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-ladybug-bg overflow-x-hidden">
      <Header />

      {/* Hero + Screenshot */}
      <section className="pt-20 pb-12 bg-white border-b border-slate-300 relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-6 mb-6">
                {product.icon_url && (
                  <img 
                    src={product.icon_url}
                    alt={product.name}
                    className="h-32 w-32 object-contain"
                  />
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-ladybug-dark">
                  {product.name}
                </h1>
              </div>

              <p className="text-base text-ladybug-dark opacity-85 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <Link href="/contact">
                <Button variant="primary" size="md">Book a Demo</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {productImages.length > 0 ? (
                <div className="relative">
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="w-full h-96 rounded-lg border-2 border-slate-300 overflow-hidden hover:border-ladybug-crimson transition-all cursor-pointer group"
                  >
                    <img 
                      src={productImages[currentImageIndex].image_url}
                      alt={`${product.name} screenshot ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Click to View</p>
                    </div>
                  </button>

                  {productImages.length > 1 && (
                    <div className="flex gap-2 mt-4 justify-center">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-ladybug-crimson w-8'
                              : 'bg-slate-300 w-3 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {productImages.length > 1 && (
                    <p className="text-xs text-ladybug-dark opacity-70 text-center mt-3">
                      {currentImageIndex + 1} / {productImages.length}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-ladybug-bg rounded-lg border-2 border-slate-300 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-ladybug-dark opacity-70 font-medium">No Images</p>
                    <p className="text-sm text-ladybug-dark opacity-50">Admin can add images</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && productImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-ladybug-crimson text-4xl font-bold z-50"
          >
            ✕
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-screen flex flex-col"
          >
            <img
              src={productImages[currentImageIndex].image_url}
              alt={`${product.name} screenshot`}
              className="w-full h-full object-contain rounded-lg"
            />

            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 text-white hover:text-ladybug-crimson text-4xl font-bold transition"
                >
                  ❮
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 text-white hover:text-ladybug-crimson text-4xl font-bold transition"
                >
                  ❯
                </button>
              </>
            )}

            <div className="text-center text-white mt-4">
              <p className="text-sm opacity-80">
                {currentImageIndex + 1} / {productImages.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-12 relative z-10">
          <Container>
            <h2 className="text-2xl font-bold text-ladybug-dark mb-6">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-slate-300 p-6 hover:border-ladybug-crimson transition-all"
                >
                  <div className="w-8 h-8 bg-ladybug-crimson rounded mb-3"></div>
                  <h3 className="text-lg font-bold text-ladybug-dark mb-2">{feature.title}</h3>
                  <p className="text-sm text-ladybug-dark opacity-75 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Pricing - FIXED BUTTON ALIGNMENT */}
      {pricing.length > 0 && (
        <section className="py-12 bg-ladybug-bg border-y border-slate-300 relative z-10">
          <Container>
            <h2 className="text-2xl font-bold text-ladybug-dark mb-8">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pricing.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-lg border p-6 transition-all flex flex-col h-full ${
                    tier.is_featured
                      ? 'border-ladybug-crimson bg-white shadow-lg'
                      : 'border-slate-300 bg-white hover:border-ladybug-crimson'
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-ladybug-dark mb-2">{tier.tier_name}</h3>
                    <p className="text-xs text-ladybug-dark opacity-70 mb-4">{tier.description}</p>
                    
                    <div className="mb-6">
                      {tier.price ? (
                        <>
                          <p className="text-3xl font-bold text-ladybug-dark">${tier.price}</p>
                          <p className="text-xs text-ladybug-dark opacity-60">{getBillingLabel(tier.billing_cycle)}</p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-ladybug-dark">Custom Pricing</p>
                      )}
                    </div>
                  </div>

                  <Link href="/contact" className="mt-auto w-full">
                    <Button 
                      variant={tier.is_featured ? "primary" : "outline"} 
                      size="sm" 
                      className="w-full"
                    >
                      {tier.cta_text || 'Book a Demo'}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-300 relative z-10">
          <Container>
            <h2 className="text-2xl font-bold text-ladybug-dark mb-8">Trusted by Leading Clinics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
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
      )}

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
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-ladybug-dark hover:text-ladybug-crimson text-3xl font-bold transition"
            >
              ✕
            </button>

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

            <div className="w-16 h-1 bg-ladybug-crimson mb-6"></div>

            <p className="text-lg text-ladybug-dark opacity-85 italic leading-relaxed mb-8">
              "{selectedClient.testimonial}"
            </p>

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

      {/* CTA */}
      <section className="py-10 bg-white relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-ladybug-dark mb-3">
              Join clinics transforming healthcare
            </h2>
            <Link href="/contact">
              <Button variant="primary" size="md">Book a Demo</Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <section className="py-6 bg-ladybug-bg border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <p className="text-ladybug-dark text-xs opacity-70">© 2026 LadybugData. All rights reserved.</p>
        </Container>
      </section>
    </main>
  );
}
