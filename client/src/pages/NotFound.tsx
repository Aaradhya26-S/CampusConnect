import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-card p-8 text-center space-y-4">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">404 — Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested page or ticket file could not be found in the Campus Connect system.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-navy-800 transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
