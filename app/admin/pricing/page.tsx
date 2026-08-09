'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function PricingManager() {
  const [pricing, setPricing] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [formData, setFormData] = useState({
    tier_name: '',
    price: '',
    billing_cycle: 'monthly',
    description: '',
    cta_text: 'Book a Demo',
    cta_link: '/contact',
    is_featured: false,
    features: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      if (productsData && productsData.length > 0) {
        setSelectedProduct(productsData[0].id);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricing = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_pricing')
        .select('*')
        .eq('product_id', productId)
        .order('order_index');

      if (error) throw error;
      setPricing(data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetchPricing(selectedProduct);
    }
  }, [selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const price = formData.price ? parseInt(formData.price) : null;
      const features = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f);

      const pricingData = {
        product_id: selectedProduct,
        tier_name: formData.tier_name,
        price,
        billing_cycle: formData.billing_cycle,
        description: formData.description,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        is_featured: formData.is_featured,
        features,
        order_index: editingId ? pricing.find(p => p.id === editingId)?.order_index : pricing.length,
      };

      if (editingId) {
        const { error } = await supabase
          .from('product_pricing')
          .update(pricingData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_pricing')
          .insert([pricingData]);

        if (error) throw error;
      }

      setFormData({
        tier_name: '',
        price: '',
        billing_cycle: 'monthly',
        description: '',
        cta_text: 'Book a Demo',
        cta_link: '/contact',
        is_featured: false,
        features: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchPricing(selectedProduct);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (tier: any) => {
    setFormData({
      tier_name: tier.tier_name,
      price: tier.price ? tier.price.toString() : '',
      billing_cycle: tier.billing_cycle,
      description: tier.description,
      cta_text: tier.cta_text,
      cta_link: tier.cta_link,
      is_featured: tier.is_featured,
      features: (tier.features || []).join('\n'),
    });
    setEditingId(tier.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pricing tier?')) return;

    try {
      const { error } = await supabase
        .from('product_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPricing(selectedProduct);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      tier_name: '',
      price: '',
      billing_cycle: 'monthly',
      description: '',
      cta_text: 'Book a Demo',
      cta_link: '/contact',
      is_featured: false,
      features: '',
    });
  };

  const reorderPricing = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = pricing.findIndex(p => p.id === id);
      if (direction === 'up' && currentIndex === 0) return;
      if (direction === 'down' && currentIndex === pricing.length - 1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      await supabase
        .from('product_pricing')
        .update({ order_index: newIndex })
        .eq('id', id);

      await supabase
        .from('product_pricing')
        .update({ order_index: currentIndex })
        .eq('id', pricing[newIndex].id);

      fetchPricing(selectedProduct);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

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
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-ladybug-dark mb-6">Manage Pricing</h2>

            {/* Product Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-ladybug-dark mb-3">Select Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-ladybug-dark">
                Pricing Tiers for {products.find(p => p.id === selectedProduct)?.name}
              </h3>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : '+ Add Tier'}
              </Button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-300 p-8 mb-12"
            >
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tier Name */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Tier Name</label>
                  <input
                    type="text"
                    value={formData.tier_name}
                    onChange={(e) => setFormData({ ...formData, tier_name: e.target.value })}
                    placeholder="e.g., Starter, Professional, Enterprise"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Price ($ per month)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 99 (leave empty for custom pricing)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  />
                  <p className="text-xs text-ladybug-dark opacity-60 mt-1">Leave empty for "Custom Pricing"</p>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Billing Cycle</label>
                  <select
                    value={formData.billing_cycle}
                    onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this tier..."
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Features (one per line)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Smart Scheduling&#10;Patient Management&#10;Digital Notes&#10;Billing & Insurance"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none font-mono text-xs"
                  />
                </div>

                {/* CTA Text */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="e.g., Book a Demo"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* CTA Link */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Button Link</label>
                  <input
                    type="text"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                    placeholder="e.g., /contact"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-ladybug-dark">Mark as featured tier</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit">
                    {editingId ? 'Update Tier' : 'Add Tier'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Pricing List */}
          {loading ? (
            <p className="text-ladybug-dark">Loading...</p>
          ) : pricing.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No pricing tiers yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pricing.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border p-6 transition-all ${
                    tier.is_featured
                      ? 'border-ladybug-crimson bg-white shadow-lg'
                      : 'border-slate-300 bg-white hover:border-ladybug-crimson'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-ladybug-dark">{tier.tier_name}</h3>
                        {tier.is_featured && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ladybug-dark opacity-70 mb-3">{tier.description}</p>

                      <div className="mb-4">
                        {tier.price ? (
                          <p className="text-3xl font-bold text-ladybug-dark">
                            ${tier.price}
                            <span className="text-lg font-normal opacity-70">/{tier.billing_cycle}</span>
                          </p>
                        ) : (
                          <p className="text-2xl font-bold text-ladybug-dark">Custom Pricing</p>
                        )}
                      </div>

                      {tier.features && tier.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-ladybug-dark opacity-60 mb-2">Features:</p>
                          <ul className="space-y-1">
                            {tier.features.map((feature, i) => (
                              <li key={i} className="text-sm text-ladybug-dark opacity-75">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-ladybug-dark opacity-60">
                        Button: {tier.cta_text} → {tier.cta_link}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(tier)}
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(tier.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => reorderPricing(tier.id, 'up')}
                      disabled={index === 0}
                      className="px-3 py-2 text-ladybug-dark border border-slate-300 rounded-lg hover:bg-ladybug-bg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => reorderPricing(tier.id, 'down')}
                      disabled={index === pricing.length - 1}
                      className="px-3 py-2 text-ladybug-dark border border-slate-300 rounded-lg hover:bg-ladybug-bg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
