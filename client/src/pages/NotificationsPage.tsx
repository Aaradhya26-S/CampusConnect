import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, ArrowRight, Inbox, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const navigate = useNavigate();

  const filtered = filter === 'UNREAD' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            Notification Center
          </h2>
          <p className="text-xs text-slate-500">
            Real-time updates regarding complaint triage, department assignments, technician visits, and ticket closures
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition shadow-sm"
          >
            <CheckCheck className="h-4 w-4 text-teal-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'ALL'
              ? 'bg-navy-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'UNREAD'
              ? 'bg-navy-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List Container */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">No notifications to display</h4>
            <p className="text-xs text-slate-500">
              {filter === 'UNREAD' ? 'You have caught up with all notifications!' : 'Your notification stream is currently clear.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.isRead) markAsRead(item.id);
                if (item.complaintId) navigate(`/complaint/${item.complaintId}`);
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition ${
                !item.isRead ? 'bg-teal-50/30' : ''
              }`}
            >
              <div
                className={`mt-0.5 rounded-xl p-2.5 shrink-0 ${
                  !item.isRead ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs font-bold ${!item.isRead ? 'text-navy-900' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                {item.complaintId && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700">
                    Inspect complaint ticket <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>

              {!item.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(item.id);
                  }}
                  title="Mark as read"
                  className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-100 transition shrink-0"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
