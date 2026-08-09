'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const CAREERS_EMAIL = 'careers@ladybugdata.com';

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('status', 'open')
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setJob(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-ladybug-bg min-h-screen flex items-center justify-center">
        <p className="text-ladybug-dark text-lg">Loading...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="bg-ladybug-bg min-h-screen">
        <Header />
        <section className="pt-32 pb-12 relative z-10 min-h-screen flex items-center">
          <Container>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-ladybug-dark mb-4">
                Job Not Found
              </h1>
              <p className="text-lg text-ladybug-dark opacity-85 mb-8">
                This job posting is no longer available.
              </p>
              <Link href="/careers">
                <Button variant="primary" size="lg">← Back to Careers</Button>
              </Link>
            </div>
          </Container>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-ladybug-bg min-h-screen">
      <Header />

      {/* Job Header */}
      <section className="pt-32 pb-12 border-b border-slate-300 relative z-10 bg-white">
        <Container>
          <Link href="/careers" className="text-ladybug-crimson font-semibold mb-6 inline-block hover:underline">
            ← Back to All Jobs
          </Link>

          <h1 className="text-5xl lg:text-6xl font-bold text-ladybug-dark mb-6 leading-tight">
            {job?.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-red-50 px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold text-ladybug-crimson">Department</p>
              <p className="text-base font-bold text-ladybug-dark">{job?.department}</p>
            </div>

            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold text-slate-600">Location</p>
              <p className="text-base font-bold text-ladybug-dark">{job?.location}</p>
            </div>

            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold text-slate-600">Type</p>
              <p className="text-base font-bold text-ladybug-dark capitalize">{job?.job_type}</p>
            </div>

            {job?.salary_range && (
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-green-700">Salary</p>
                <p className="text-base font-bold text-ladybug-dark">{job.salary_range}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            
              href={`mailto:${CAREERS_EMAIL}?subject=Application for ${job?.title}`}
              className="px-8 py-4 bg-ladybug-crimson text-white rounded-lg font-semibold hover:bg-red-700 transition text-center"
            >
              Apply Now
            </a>
            <button
              onClick={() => {
                const text = `Check out this job at LadybugData: ${job?.title} - ${window.location.href}`;
                navigator.share?.({
                  title: job?.title,
                  text: text,
                  url: window.location.href,
                });
              }}
              className="px-8 py-4 border-2 border-slate-300 text-ladybug-dark rounded-lg font-semibold hover:bg-slate-100 transition text-center"
            >
              Share
            </button>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Job Details */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="bg-white rounded-xl border border-slate-300 p-8 mb-8">
                <h2 className="text-3xl font-bold text-ladybug-dark mb-6">About This Role</h2>
                <div className="space-y-4 text-base text-ladybug-dark opacity-85 leading-relaxed">
                  {job?.description.split('\n').map((line, i) => (
                    line.trim() && <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {job?.requirements && (
                <div className="bg-white rounded-xl border border-slate-300 p-8">
                  <h2 className="text-3xl font-bold text-ladybug-dark mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.split('\n').map((req, i) => (
                      req.trim() && (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-ladybug-crimson font-bold text-xl mt-1">•</span>
                          <span className="text-base text-ladybug-dark opacity-85">{req.trim()}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div>
              {/* Apply Box */}
              <div className="bg-white rounded-xl border border-slate-300 p-8 sticky top-24 mb-8">
                <h3 className="text-2xl font-bold text-ladybug-dark mb-4">Ready to Apply?</h3>
                <p className="text-sm text-ladybug-dark opacity-85 mb-6">
                  Send your resume and a brief introduction to our careers team.
                </p>
                
                  href={`mailto:${CAREERS_EMAIL}?subject=Application for ${job?.title}`}
                  className="block w-full px-6 py-4 bg-ladybug-crimson text-white rounded-lg font-semibold hover:bg-red-700 transition text-center mb-4"
                >
                  Apply Now
                </a>
                <p className="text-xs text-slate-500 text-center">
                  Email: <span className="font-semibold">{CAREERS_EMAIL}</span>
                </p>
              </div>

              {/* Job Details Box */}
              <div className="bg-white rounded-xl border border-slate-300 p-8">
                <h3 className="text-xl font-bold text-ladybug-dark mb-6">Job Details</h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">DEPARTMENT</p>
                    <p className="text-base font-semibold text-ladybug-dark">{job?.department}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">LOCATION</p>
                    <p className="text-base font-semibold text-ladybug-dark">{job?.location}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">EMPLOYMENT TYPE</p>
                    <p className="text-base font-semibold text-ladybug-dark capitalize">{job?.job_type}</p>
                  </div>

                  {job?.salary_range && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1">SALARY RANGE</p>
                      <p className="text-base font-semibold text-ladybug-dark">{job.salary_range}</p>
                    </div>
                  )}

                  {job?.open_date && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1">POSTED ON</p>
                      <p className="text-base font-semibold text-ladybug-dark">
                        {new Date(job.open_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* More Jobs CTA */}
      <section className="py-12 bg-white border-t border-slate-300 relative z-10">
        <Container className="text-center">
          <p className="text-lg text-ladybug-dark opacity-85 mb-6">
            Interested in other opportunities?
          </p>
          <Link href="/careers">
            <Button variant="primary" size="lg">
              View All Open Positions
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
