'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function FeaturesManager({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch features
      const { data: featuresData, error: featuresError } = await supabase
        .from('product_features')
        .select('*')
        .eq('product_id', params.id)
        .order('order_index');

      if (featuresError) throw featuresError;
      setFeatures(featuresData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('product_features')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('product_features')
          .insert({
            product_id: params.id,
            ...formData,
            order_index: features.length,
          });

        if (error) throw error;
      }

      setFormData({ title: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (feature: any) => {
    setFormData({
      title: feature.title,
      description: feature.description,
    });
    setEditingId(feature.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feature?')) return;

    try {
      const { error } = await supabase
        .from('product_features')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    try {
      const feature1 = features[index];
      const feature2 = features[index - 1];

      await supabase
        .from('product_features')
        .update({ order_index: index - 1 })
        .eq('id', feature1.id);

      await supabase
        .from('product_features')
        .update({ order_index: index })
        .eq('id', feature2.id);

      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === features.length - 1) return;

    try {
      const feature1 = features[index];
      const feature2 = features[index + 1];

      await supabase
        .from('product_features')
        .update({ order_index: index + 1 })
        .eq('id', feature1.id);

      await supabase
        .from('product_features')
        .update({ order_index: index })
        .eq('id', feature2.id);

      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '' });
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
      {/* Header */}
      <header className="bg-ladybug-dark text-white border-b border-slate-700 sticky top-0 z-50">
        <Container className="py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Features</h1>
            <p className="text-sm opacity-80">{product?.name}</p>
          </div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 text-white hover:text-ladybug-crimson text-sm font-semibold transition"
          >
            ← Back to Products
          </button>
        </Container>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-ladybug-dark">Product Features</h2>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Feature'}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-300 p-8 mb-12"
            >
              <h3 className="text-2xl font-bold text-ladybug-dark mb-6">
                {editingId ? 'Edit Feature' : 'Add New Feature'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Feature Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Smart Scheduling"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Feature description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit">
                    {editingId ? 'Update Feature' : 'Add Feature'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Features List */}
          {features.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No features yet. Click "Add Feature" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-300 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-ladybug-dark opacity-70">#{index + 1}</span>
                        <h3 className="text-xl font-bold text-ladybug-dark">{feature.title}</h3>
                      </div>
                      <p className="text-base text-ladybug-dark opacity-75">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(feature)}
                    >
                      Edit
                    </Button>

                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
                    >
                      ↑ Up
                    </button>

                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === features.length - 1}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition"
                    >
                      ↓ Down
                    </button>

                    <button
                      onClick={() => handleDelete(feature.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-semibold transition"
                    >
                      Delete
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
