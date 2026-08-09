'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    status: 'active',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [productImages, setProductImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('order_index');

      if (error) throw error;
      setProductImages(data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;

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

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3 - productImages.length);
      setNewImages([...newImages, ...fileArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let logoUrl = editingId ? products.find(p => p.id === editingId)?.icon_url : '';

      if (logoFile) {
        logoUrl = await uploadFile(logoFile, 'logos');
      }

      const productData = { ...formData, icon_url: logoUrl };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      // Upload new product images
      if (newImages.length > 0 && editingId) {
        for (let i = 0; i < newImages.length; i++) {
          const imageUrl = await uploadFile(newImages[i], 'product-images');
          const { error } = await supabase
            .from('product_images')
            .insert({
              product_id: editingId,
              image_url: imageUrl,
              order_index: productImages.length + i,
            });
          if (error) throw error;
        }
      }

      setFormData({ name: '', description: '', slug: '', status: 'active' });
      setEditingId(null);
      setShowForm(false);
      setLogoFile(null);
      setLogoPreview('');
      setNewImages([]);
      setProductImages([]);
      fetchProducts();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      slug: product.slug,
      status: product.status,
    });
    if (product.icon_url) {
      setLogoPreview(product.icon_url);
    }
    setEditingId(product.id);
    setShowForm(true);
    fetchProductImages(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      if (editingId) fetchProductImages(editingId);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', slug: '', status: 'active' });
    setLogoFile(null);
    setLogoPreview('');
    setNewImages([]);
    setProductImages([]);
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Products</h2>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Product'}
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
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., MedFlow"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., medflow"
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
                    placeholder="Product description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Product Logo</label>
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

                {/* Product Images */}
                {editingId && (
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Product Images (up to 3)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      disabled={productImages.length + newImages.length >= 3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm"
                    />
                    
                    {/* Current Images */}
                    {productImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-ladybug-dark mb-2">Current Images</p>
                        <div className="grid grid-cols-3 gap-4">
                          {productImages.map((img) => (
                            <div key={img.id} className="relative">
                              <img src={img.image_url} alt="Product" className="w-full h-24 object-cover rounded" />
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Preview */}
                    {newImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-ladybug-dark mb-2">New Images to Upload</p>
                        <div className="grid grid-cols-3 gap-4">
                          {newImages.map((file, idx) => (
                            <div key={idx} className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                              <p className="text-xs text-gray-600">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit">
                    {editingId ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Products List */}
          {loading ? (
            <p className="text-ladybug-dark">Loading...</p>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-slate-300 p-8 hover:border-ladybug-crimson transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 items-start flex-1">
                      {product.icon_url && (
                        <img src={product.icon_url} alt={product.name} className="h-16 w-16 object-contain" />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-ladybug-dark">{product.name}</h3>
                        <p className="text-sm text-ladybug-dark opacity-70">slug: {product.slug}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>

                  <p className="text-base text-ladybug-dark opacity-80 mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product.id}/features`)}
                    >
                      Manage Features
                    </Button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
