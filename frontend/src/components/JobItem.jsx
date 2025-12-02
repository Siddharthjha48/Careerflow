import React from 'react';

const JobItem = ({ job, onDelete, onEdit, role }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${job._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          onDelete(job._id);
        } else {
          alert('Failed to delete job');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    }
  };

  const handleApply = () => {
    alert('Application submitted successfully! (Mock)');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'interview': return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10';
      case 'declined': return 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10';
      case 'offer': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className="card flex flex-col h-full hover:shadow-md transition-shadow duration-200 group">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusStyle(job.status)}`}>
            {job.status}
          </div>
          <div className="flex gap-1">
            {role === 'recruiter' ? (
              <>
                <button
                  onClick={() => onEdit(job)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={handleApply}
                className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
              >
                Apply
              </button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1">{job.position}</h3>
        <p className="text-slate-500 font-medium mb-4">{job.company}</p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {job.jobLocation}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-1.086-1.036" />
            </svg>
            <span className="capitalize">{job.jobType}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-between items-center">
        <p className="text-xs text-slate-400 font-medium">
          Added {formatDate(job.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default JobItem;
