'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function ClientsManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    testimonial: '',
    featured: false,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `logos/${fileName}`;

    const { error } = await supabase.storage
      .from('product-assets')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('product-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const fetchClientProducts = async (clientId: string) => {
    try {
      const { data } = await supabase
        .from('client_products')
        .select('product_id')
        .eq('client_id', clientId);

      setSelectedProducts(data?.map((cp: any) => cp.product_id) || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let logoUrl = editingId ? clients.find(c => c.id === editingId)?.logo_url : '';

      if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const clientData = { ...formData, logo_url: logoUrl };

      if (editingId) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingId);

        if (error) throw error;

        // Update product links
        await supabase
          .from('client_products')
          .delete()
          .eq('client_id', editingId);

        for (const productId of selectedProducts) {
          await supabase.from('client_products').insert({
            client_id: editingId,
            product_id: productId,
            status: 'active',
          });
        }
      } else {
        const { data: newClient, error: insertError } = await supabase
          .from('clients')
          .insert([clientData])
          .select()
          .single();

        if (insertError) throw insertError;

        // Link products
        for (const productId of selectedProducts) {
          await supabase.from('client_products').insert({
            client_id: newClient.id,
            product_id: productId,
            status: 'active',
          });
        }
      }

      setFormData({ name: '', industry: '', testimonial: '', featured: false });
      setEditingId(null);
      setShowForm(false);
      setLogoFile(null);
      setLogoPreview('');
      setSelectedProducts([]);
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = async (client: any) => {
    setFormData({
      name: client.name,
      industry: client.industry,
      testimonial: client.testimonial,
      featured: client.featured,
    });
    if (client.logo_url) {
      setLogoPreview(client.logo_url);
    }
    setEditingId(client.id);
    await fetchClientProducts(client.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;

    try {
      await supabase.from('client_products').delete().eq('client_id', id);
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', industry: '', testimonial: '', featured: false });
    setLogoFile(null);
    setLogoPreview('');
    setSelectedProducts([]);
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Clients</h2>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Client'}
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
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Clinic Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Central Clinic"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Healthcare, Neurology"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm"
                  />
                  {logoPreview && (
                    <div className="mt-4">
                      <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-contain" />
                    </div>
                  )}
                </div>

                {/* Testimonial */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Testimonial</label>
                  <textarea
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    placeholder="What clients say about the product..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                </div>

                {/* Select Products */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-3">Which Products Does This Client Use?</label>
                  <div className="space-y-2 bg-ladybug-bg p-4 rounded-lg">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-sm text-ladybug-dark">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-ladybug-dark">Featured on website</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit">
                    {editingId ? 'Update Client' : 'Add Client'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Clients List */}
          {loading ? (
            <p className="text-ladybug-dark">Loading...</p>
          ) : clients.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No clients yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-300 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-start flex-1">
                      {client.logo_url && (
                        <img src={client.logo_url} alt={client.name} className="h-16 w-16 object-contain" />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-ladybug-dark">{client.name}</h3>
                        <p className="text-sm text-ladybug-dark opacity-70">{client.industry}</p>
                        {client.featured && (
                          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-ladybug-dark opacity-80 mb-4 italic">
                    "{client.testimonial}"
                  </p>

                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(client)}
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(client.id)}
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
