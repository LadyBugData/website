'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/app/components/ui/Container';
import Button from '@/app/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  job_type: string;
  salary_range: string;
  requirements: string;
  open_date: string;
  close_date: string;
  status: string;
  created_at: string;
}

export default function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    job_type: 'full-time',
    salary_range: '',
    requirements: '',
    open_date: '',
    close_date: '',
    status: 'open',
  });
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error:', err);
      alert('Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('jobs')
          .update({
            ...formData,
            updated_at: new Date(),
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('✓ Job updated!');
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([formData]);

        if (error) throw error;
        alert('✓ Job created!');
      }

      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        job_type: 'full-time',
        salary_range: '',
        requirements: '',
        open_date: '',
        close_date: '',
        status: 'open',
      });
      setEditingId(null);
      setShowForm(false);
      fetchJobs();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      job_type: job.job_type,
      salary_range: job.salary_range,
      requirements: job.requirements,
      open_date: job.open_date,
      close_date: job.close_date,
      status: job.status,
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchJobs();
      alert('✓ Job deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      job_type: 'full-time',
      salary_range: '',
      requirements: '',
      open_date: '',
      close_date: '',
      status: 'open',
    });
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
            <h2 className="text-4xl font-bold text-ladybug-dark">Manage Job Openings</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add Job'}
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
                {editingId ? 'Edit Job' : 'Add New Job'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Full-Stack Developer"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    required
                  />
                </div>

                {/* Department & Location */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Engineering"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>
                </div>

                {/* Job Type & Salary */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={formData.salary_range}
                      onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                      placeholder="e.g., $120k - $150k"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter job description..."
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Requirements
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Enter requirements (one per line)..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm resize-none"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Open Date
                    </label>
                    <input
                      type="date"
                      value={formData.open_date}
                      onChange={(e) => setFormData({ ...formData, open_date: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                      Close Date
                    </label>
                    <input
                      type="date"
                      value={formData.close_date}
                      onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-ladybug-dark mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-ladybug-crimson text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="lg" type="submit" disabled={saving}>
                    {saving ? '⏳ Saving...' : editingId ? 'Update Job' : 'Add Job'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Jobs Grid */}
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center">
              <p className="text-ladybug-dark">No jobs yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-slate-300 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-ladybug-dark">
                          {job.title}
                        </h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          job.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'closed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status === 'open' ? '🟢 Open' : job.status === 'closed' ? '🔴 Closed' : '⚪ Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-ladybug-dark opacity-70">
                        {job.department} • {job.location} • {job.job_type}
                      </p>
                      {job.salary_range && (
                        <p className="text-sm text-ladybug-dark opacity-70">
                          {job.salary_range}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-xs font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
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
