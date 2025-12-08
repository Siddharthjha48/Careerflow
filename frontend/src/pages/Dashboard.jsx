import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobItem from '../components/JobItem';
import NotificationBell from '../components/NotificationBell';
import ProfileModal from '../components/ProfileModal';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      const userName = localStorage.getItem('name');
      setRole(userRole);
      setName(userName);

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
            localStorage.removeItem('name');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/applications/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchJobs();
    fetchAnalytics();
    fetchApplications();
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
    localStorage.removeItem('name');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-indigo-500 text-xl font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <nav className="bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">C</div>
              <h1 className="text-xl font-bold text-slate-50 tracking-tight">CareerFlow</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={() => setShowProfile(true)}
                className="text-slate-400 hover:text-white transition-colors"
                title="My Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              <span className="text-slate-400 font-medium">Hello, <span className="text-indigo-400 font-bold">{name || 'User'}</span></span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
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
            <h2 className="text-3xl font-bold text-indigo-500">
              {role === 'recruiter' ? 'Dashboard' : 'Find Jobs'}
            </h2>
            <p className="mt-1 text-slate-400">
              <span className="text-purple-400 font-bold">Welcome back,</span> <span className="text-indigo-400 font-bold">{name || 'User'}</span>! {role === 'recruiter' ? 'Manage your job postings' : 'Browse available opportunities'}
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

        {/* Analytics Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 bg-[#1E293B] border-slate-700">
              <h3 className="text-slate-400 text-sm font-medium">Total {role === 'recruiter' ? 'Applications Received' : 'Applications Sent'}</h3>
              <p className="text-3xl font-bold text-white mt-2">{role === 'recruiter' ? stats.totalApplications : stats.totalApplications}</p>
            </div>
            {stats.statusBreakdown.map((status) => (
              <div key={status._id} className="card p-6 bg-[#1E293B] border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium capitalize">{status._id}</h3>
                <p className="text-3xl font-bold text-white mt-2">{status.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Applications List */}
        {applications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {role === 'recruiter' ? 'Recent Applications' : 'My Applications'}
            </h3>
            <div className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#0F172A] text-slate-200 uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Position</th>
                    <th className="px-4 py-3 whitespace-nowrap">Company</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                    {role === 'recruiter' && <th className="px-4 py-3 whitespace-nowrap">Applicant</th>}
                    {role === 'recruiter' && <th className="px-4 py-3 whitespace-nowrap">Resume</th>}
                    {role === 'recruiter' && <th className="px-4 py-3 whitespace-nowrap">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-white whitespace-nowrap">{app.job?.position || 'Unknown'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{app.job?.company || 'Unknown'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${app.status === 'applied' ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${app.status === 'shortlisted' ? 'bg-amber-500/10 text-amber-400' : ''}
                          ${app.status === 'interview' ? 'bg-purple-500/10 text-purple-400' : ''}
                          ${app.status === 'rejected' ? 'bg-red-500/10 text-red-400' : ''}
                          ${app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                      {role === 'recruiter' && (
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-white whitespace-nowrap">{app.applicant?.name}</p>
                            <p className="text-xs truncate max-w-[150px]" title={app.applicant?.email}>{app.applicant?.email}</p>
                          </div>
                        </td>
                      )}
                      {role === 'recruiter' && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          {app.applicant?.resume ? (
                            <a
                              href={`http://localhost:3000/${app.applicant.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 underline text-xs"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-slate-500 text-xs">N/A</span>
                          )}
                        </td>
                      )}
                      {role === 'recruiter' && (
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            value={app.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const token = localStorage.getItem('token');
                              try {
                                const res = await fetch(`http://localhost:3000/api/applications/${app._id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ status: newStatus }),
                                });
                                if (res.ok) {
                                  // Update local state
                                  setApplications(applications.map(a => a._id === app._id ? { ...a, status: newStatus } : a));
                                  // Refresh stats
                                  const statsRes = await fetch('http://localhost:3000/api/applications/analytics', {
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  if (statsRes.ok) {
                                    const data = await statsRes.json();
                                    setStats(data.stats);
                                  }
                                }
                              } catch (err) {
                                console.error('Error updating status:', err);
                              }
                            }}
                            className="bg-[#0F172A] border border-slate-600 text-slate-300 text-xs rounded p-1 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interview</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
          <div className="text-center py-20 bg-[#1E293B] rounded-xl border border-dashed border-slate-700">
            <div className="mx-auto h-12 w-12 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-1.086-1.036" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-slate-50">No jobs found</h3>
            <p className="mt-1 text-sm text-slate-400">
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
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default Dashboard;
