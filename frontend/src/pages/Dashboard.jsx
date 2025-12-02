import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobItem from '../components/JobItem';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [role, setRole] = useState('user');

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setRole(userRole);

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs);
        } else {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  const handleJobAdded = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowForm(false);
  };

  const handleJobDeleted = (jobId) => {
    setJobs(jobs.filter((job) => job._id !== jobId));
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs(jobs.map((job) => (job._id === updatedJob._id ? updatedJob : job)));
    setEditingJob(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-indigo-600 text-xl font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareerFlow</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {role === 'recruiter' ? 'Dashboard' : 'Find Jobs'}
            </h2>
            <p className="mt-1 text-slate-500">
              {role === 'recruiter' ? 'Manage your job postings' : 'Browse available opportunities'}
            </p>
          </div>
          {role === 'recruiter' && (
            <button
              onClick={() => {
                setEditingJob(null);
                setShowForm(!showForm);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"} />
              </svg>
              {showForm ? 'Cancel' : 'Post Job'}
            </button>
          )}
        </div>

        {showForm && role === 'recruiter' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <JobForm
              onJobAdded={handleJobAdded}
              editingJob={editingJob}
              onUpdateJob={handleUpdateJob}
              onCancelEdit={() => {
                setEditingJob(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobItem
              key={job._id}
              job={job}
              role={role}
              onDelete={handleJobDeleted}
              onEdit={handleEditClick}
            />
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto h-12 w-12 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-1.086-1.036" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No jobs found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {role === 'recruiter' ? 'Get started by creating a new job posting.' : 'Check back later for new opportunities.'}
            </p>
            {role === 'recruiter' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Post Job
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
