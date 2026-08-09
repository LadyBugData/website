'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
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
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const CAREERS_EMAIL = 'careers@ladybugdata.com';

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, selectedDepartment, selectedLocation]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query)
      );
    }
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }
    setFilteredJobs(filtered);
  };

  const departments = ['all', ...new Set(jobs.map(job => job.department))];
  const locations = ['all', ...new Set(jobs.map(job => job.location))];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-ladybug-bg min-h-screen">
      <Header />
      <section className="pt-32 pb-12 border-b border-slate-300 relative z-10">
        <Container>
          <h1 className="text-5xl font-bold text-ladybug-dark mb-4">Join Our Team</h1>
          <p className="text-lg text-ladybug-dark opacity-85">Help us build the future of healthcare technology.</p>
        </Container>
      </section>

      <section className="py-12 relative z-10">
        <Container>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-300 p-16 text-center">
              <h3 className="text-3xl font-bold text-ladybug-dark mb-4">No Open Positions Right Now</h3>
              <p className="text-lg text-ladybug-dark opacity-85 mb-8">Send us your resume</p>
              <a href={`mailto:${CAREERS_EMAIL}`} className="inline-block px-8 py-4 bg-ladybug-crimson text-white rounded-lg font-semibold hover:bg-red-700">
                Email Your Resume
              </a>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-slate-300 p-8 mb-12">
                <h3 className="text-2xl font-bold text-ladybug-dark mb-6">Search & Filter</h3>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-6"
                />
                <div className="grid grid-cols-2 gap-6">
                  <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="px-4 py-3 border border-slate-300 rounded-lg">
                    {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
                  </select>
                  <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="px-4 py-3 border border-slate-300 rounded-lg">
                    {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All Locations' : l}</option>)}
                  </select>
                </div>
                <p className="text-sm text-ladybug-dark opacity-70 mt-6">Showing {filteredJobs.length} of {jobs.length} positions</p>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-300 p-12 text-center">
                  <p className="text-lg text-ladybug-dark opacity-85">No jobs match your criteria</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-xl border border-slate-300 p-8">
                      <h3 className="text-2xl font-bold text-ladybug-dark mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="text-sm font-semibold text-ladybug-crimson bg-red-50 px-3 py-1 rounded-full">{job.department}</span>
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{job.location}</span>
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{job.job_type}</span>
                        {job.salary_range && <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">{job.salary_range}</span>}
                      </div>
                      <p className="text-base text-ladybug-dark opacity-85 mb-6">{job.description.substring(0, 150)}...</p>
                      <Link href={`/careers/${job.id}`}>
                        <Button variant="primary" size="md">View Details & Apply</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {jobs.length > 0 && (
        <section className="py-12 bg-white border-t border-slate-300 relative z-10">
          <Container className="text-center">
            <p className="text-lg text-ladybug-dark opacity-85 mb-4">Don't see your fit?</p>
            <a href={`mailto:${CAREERS_EMAIL}`} className="inline-block px-6 py-3 border-2 border-ladybug-crimson text-ladybug-crimson rounded-lg font-semibold hover:bg-red-50">
              Send Your Resume
            </a>
          </Container>
        </section>
      )}

      <Footer />
    </div>
  );
}
