import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../types';

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  const config: Record<
    ComplaintStatus,
    { label: string; bg: string; text: string; dot: string; border: string }
  > = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      border: 'border-blue-200',
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      dot: 'bg-teal-500 animate-pulse',
      border: 'border-teal-200',
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    CLOSED: {
      label: 'Closed',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
      border: 'border-slate-200',
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
    },
  };

  const current = config[status] || {
    label: status,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    border: 'border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} shadow-sm font-medium tracking-wide`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ComplaintPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs font-semibold';

  const config: Record<
    ComplaintPriority,
    { label: string; bg: string; text: string; border: string; icon: string }
  > = {
    LOW: {
      label: 'Low',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: '↓',
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: '→',
    },
    HIGH: {
      label: 'High',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '↑',
    },
    URGENT: {
      label: 'Urgent',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: '▲',
    },
  };

  const current = config[priority] || {
    label: priority,
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: '•',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <span className="font-bold">{current.icon}</span>
      {current.label}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-navy-50 text-navy-800 border border-navy-200">
      {category}
    </span>
  );
};
