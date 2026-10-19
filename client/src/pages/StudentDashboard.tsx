import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Inbox,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Complaint, NotificationItem } from '../types';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';
import { StatusDonutChart } from '../components/Charts';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [complaintsRes, statsRes, notifsRes] = await Promise.all([
          api.getComplaints({ limit: 5 }),
          api.getStudentStats(),
          api.getNotifications(),
        ]);

        setComplaints(complaintsRes.complaints);
        setStats(statsRes);
        setRecentNotifications(notifsRes.notifications.slice(0, 4));
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Status breakdown data for the Donut Chart
  const statusChartData = [
    { label: 'Pending Review', count: stats.pending, color: '#F59E0B' },
    { label: 'In Progress', count: stats.inProgress, color: '#0D9488' },
    { label: 'Resolved', count: stats.resolved, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-6 sm:p-8 text-white shadow-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Campus Connect Student Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Student'}!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Track university facility maintenance, report classroom or hostel anomalies, and stay updated with official technician dispatches.
            </p>
            {user?.studentId && (
              <p className="text-xs text-teal-300 font-mono">
                Student Roll ID: <span className="font-bold underline">{user.studentId}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/submit')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-600 transition"
            >
              <PlusCircle className="h-4 w-4 stroke-[2.5]" />
              <span>Submit a Complaint</span>
            </button>
            <button
              onClick={() => navigate('/my-complaints')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800/80 hover:bg-navy-700/80 px-4 py-3 text-sm font-semibold text-slate-200 border border-slate-700/60 transition"
            >
              <FileText className="h-4 w-4" />
              <span>View History</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          description="Registered tickets"
          accentColor="navy"
          onClick={() => navigate('/my-complaints')}
        />
        <MetricCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          description="Awaiting department triage"
          accentColor="amber"
          onClick={() => navigate('/my-complaints?status=SUBMITTED')}
        />
        <MetricCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          description="Assigned & being repaired"
          accentColor="teal"
          onClick={() => navigate('/my-complaints?status=IN_PROGRESS')}
        />
        <MetricCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          description="Successfully completed"
          accentColor="emerald"
          onClick={() => navigate('/my-complaints?status=RESOLVED')}
        />
      </div>

      {/* Main Dashboard Grid: Status Breakdown & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown Chart Card */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 lg:col-span-1 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-navy-900 tracking-tight">Complaint Status Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution of your active & completed cases</p>
          </div>

          <div className="py-2">
            <StatusDonutChart data={statusChartData} />
          </div>

          <div className="border-t border-slate-100 pt-3 text-center">
            <button
              onClick={() => navigate('/submit')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              Have a new issue to report? Click here <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Recent Activity / Notifications Panel */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-navy-900 tracking-tight">Recent Activity & Updates</h3>
              <p className="text-xs text-slate-500">Real-time status alerts on your submissions</p>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 my-2">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity notifications yet.
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div key={notif.id} className="py-3 flex items-start gap-3 group">
                  <div className="mt-0.5 rounded-lg bg-teal-50 p-2 text-teal-600 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-navy-900 truncate">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Official Campus Connect Dispatch Desk</span>
            <span className="text-teal-600 font-medium">Standard SLA: 24-48 hours</span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-base text-navy-900">Recent Complaints</h3>
            <p className="text-xs text-slate-500">Latest tickets logged under your student account</p>
          </div>
          <button
            onClick={() => navigate('/my-complaints')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
          >
            <span>See all complaints</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">No complaints registered yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no active or historical complaints logged. Click below to submit a facility issue.
            </p>
            <button
              onClick={() => navigate('/submit')}
              className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Submit First Complaint</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Reference ID</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/complaint/${item.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-navy-900">
                      {item.referenceId}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-navy-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{item.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/complaint/${item.id}`);
                        }}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
