import React, { useState, useEffect } from 'react';

const JobForm = ({ onJobAdded, editingJob, onUpdateJob, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'pending',
    jobType: 'full-time',
    jobLocation: '',
  });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        company: editingJob.company,
        position: editingJob.position,
        status: editingJob.status,
        jobType: editingJob.jobType,
        jobLocation: editingJob.jobLocation,
      });
    } else {
      setFormData({
        company: '',
        position: '',
        status: 'pending',
        jobType: 'full-time',
        jobLocation: '',
      });
    }
  }, [editingJob]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingJob
        ? `http://localhost:3000/api/jobs/${editingJob._id}`
        : 'http://localhost:3000/api/jobs';
      const method = editingJob ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingJob) {
          onUpdateJob(data.job);
        } else {
          onJobAdded(data.job);
        }
        setFormData({
          company: '',
          position: '',
          status: 'pending',
          jobType: 'full-time',
          jobLocation: '',
        });
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 bg-[#1E293B] border-slate-700">
      <h3 className="text-lg font-semibold text-slate-50 mb-5 pb-2 border-b border-slate-700">
        {editingJob ? 'Edit Application' : 'New Application'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="declined">Declined</option>
            <option value="offer">Offer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
          <input
            type="text"
            name="jobLocation"
            value={formData.jobLocation}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {editingJob && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
        >
          {editingJob ? 'Save Changes' : 'Create Application'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
