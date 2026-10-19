import React from 'react';
import { ComplaintStatus, StatusHistory } from '../types';
import { Check, Clock, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: ComplaintStatus;
  history?: StatusHistory[];
  rejectionReason?: string;
  reopenReason?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history = [],
  rejectionReason,
  reopenReason,
}) => {
  const steps: { key: ComplaintStatus; label: string; desc: string }[] = [
    { key: 'SUBMITTED', label: 'Submitted', desc: 'Complaint logged in system' },
    { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'Assessed by admin desk' },
    { key: 'ASSIGNED', label: 'Assigned', desc: 'Dispatched to department' },
    { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Active maintenance underway' },
    { key: 'RESOLVED', label: 'Resolved', desc: 'Work completed & tested' },
    { key: 'CLOSED', label: 'Closed', desc: 'Confirmed and finalized' },
  ];

  const getStepIndex = (status: ComplaintStatus) => {
    return steps.findIndex((s) => s.key === status);
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900">Complaint Progress Timeline</h4>
          <p className="text-xs text-slate-500">Live operational lifecycle tracking from submission to resolution</p>
        </div>
        {reopenReason && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3 w-3" /> Reopened Ticket
          </span>
        )}
      </div>

      {isRejected ? (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50/70 p-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <h5 className="text-sm font-bold text-rose-900">Complaint Rejected</h5>
              <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                {rejectionReason || 'This complaint could not be processed as submitted.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {/* Desktop/Tablet Horizontal Steps */}
          <div className="hidden md:grid grid-cols-6 gap-2 relative">
            {steps.map((step, idx) => {
              const isPast = currentIndex > idx;
              const isCurrent = currentIndex === idx;
              return (
                <div key={step.key} className="flex flex-col items-center text-center relative group">
                  {/* Connecting Bar */}
                  {idx > 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 w-full h-0.5 -z-0 transition-colors ${
                        isPast || isCurrent ? 'bg-teal-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-teal-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-navy-900 text-teal-400 ring-4 ring-teal-100 shadow-md'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPast ? <Check className="h-4 w-4 stroke-[2.5]" /> : idx + 1}
                  </div>

                  <p
                    className={`mt-2 text-xs font-bold ${
                      isCurrent ? 'text-teal-700' : isPast ? 'text-navy-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 px-1">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Steps */}
          <div className="md:hidden space-y-4">
            {steps.map((step, idx) => {
              const isPast = currentIndex > idx;
              const isCurrent = currentIndex === idx;
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isPast
                        ? 'bg-teal-500 text-white'
                        : isCurrent
                        ? 'bg-navy-900 text-teal-400 ring-2 ring-teal-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isCurrent ? 'text-teal-700' : 'text-slate-800'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Status History Logs */}
      {history.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Audit Trail & Activity Notes</h5>
          <div className="space-y-2.5">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-start justify-between text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-200/60"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-medium text-navy-900">
                    <span className="font-semibold">{h.changedByName || 'Campus Staff'}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-teal-700 font-bold">{h.toStatus}</span>
                  </div>
                  {h.note && <p className="text-slate-600 text-[11px] italic">"{h.note}"</p>}
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                  {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
