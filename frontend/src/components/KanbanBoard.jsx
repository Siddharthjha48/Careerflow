import React, { useState } from 'react';
import { API_URL } from '../config.js';

const COLUMNS = [
  { id: 'applied', title: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'shortlisted', title: 'Shortlisted', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'interview', title: 'Interview', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'hired', title: 'Hired', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'rejected', title: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10' },
];

const KanbanBoard = ({ applications, onStatusChange }) => {
  const [draggedAppId, setDraggedAppId] = useState(null);

  const handleDragStart = (e, appId) => {
    setDraggedAppId(appId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    if (draggedAppId) {
      const app = applications.find(a => a._id === draggedAppId);
      if (app && app.status !== statusId) {
        onStatusChange(draggedAppId, statusId);
      }
      setDraggedAppId(null);
    }
  };

  const groupedApps = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(app => app.status === col.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="flex-shrink-0 w-72 bg-[#1E293B] border border-slate-700 rounded-xl p-4 flex flex-col min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${col.color}`}>{col.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${col.bg} ${col.color}`}>
              {groupedApps[col.id].length}
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {groupedApps[col.id].map((app) => (
              <div
                key={app._id}
                draggable
                onDragStart={(e) => handleDragStart(e, app._id)}
                className={`bg-[#0F172A] p-4 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing hover:border-slate-500 transition-colors ${draggedAppId === app._id ? 'opacity-50 border-dashed' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white truncate pr-2" title={app.job?.position}>
                    {app.job?.position || 'Unknown Role'}
                  </h4>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 truncate mb-1" title={app.job?.company}>
                  {app.job?.company || 'Unknown Company'}
                </p>
                
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <p className="text-sm text-slate-300 truncate">{app.applicant?.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500 truncate max-w-[150px]" title={app.applicant?.email}>
                      {app.applicant?.email}
                    </p>
                    {app.applicant?.resume && (
                      <a
                        href={app.applicant.resume.startsWith('http') ? app.applicant.resume : `${API_URL}/${app.applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {groupedApps[col.id].length === 0 && (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-lg p-4 text-center min-h-[100px]">
                <span className="text-sm text-slate-500">Drop here</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
