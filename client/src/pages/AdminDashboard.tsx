import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { Complaint, AnalyticsData } from '../types';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';
import { CategoryBarChart, TrendLineChart, StatusDonutChart } from '../components/Charts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [pendingReviewComplaints, setPendingReviewComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [analyticsRes, complaintsRes, pendingRes] = await Promise.all([
          api.getDashboardAnalytics(),
          api.getComplaints({ limit: 6 }),
          api.getComplaints({ status: 'SUBMITTED', limit: 4 }),
        ]);

        setMetrics(analyticsRes);
        setRecentComplaints(complaintsRes.complaints);
        setPendingReviewComplaints(pendingRes.complaints);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const handleExportCsv = () => {
    window.open(api.getCsvExportUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            Administrative Operations & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time campus infrastructure oversight, ticket dispatching, and department resolution rates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-navy-900 hover:bg-slate-50 transition shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => navigate('/admin/complaints')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition shadow-md"
          >
            <span>Manage Queue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 5 Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Complaints"
          value={metrics?.total || 0}
          icon={FileText}
          description="All-time campus tickets"
          accentColor="navy"
          onClick={() => navigate('/admin/complaints')}
        />
        <MetricCard
          title="New / Triage"
          value={metrics?.pending || 0}
          icon={Clock}
          description="Needs desk assignment"
          accentColor="amber"
          onClick={() => navigate('/admin/complaints?status=SUBMITTED')}
        />
        <MetricCard
          title="In Progress"
          value={metrics?.inProgress || 0}
          icon={TrendingUp}
          description="Active field repairs"
          accentColor="teal"
          onClick={() => navigate('/admin/complaints?status=IN_PROGRESS')}
        />
        <MetricCard
          title="Resolved"
          value={metrics?.resolved || 0}
          icon={CheckCircle}
          description="Fixed & confirmed"
          accentColor="emerald"
          onClick={() => navigate('/admin/complaints?status=RESOLVED')}
        />
        <MetricCard
          title="Resolution Rate"
          value={`${metrics?.resolutionRate || 0}%`}
          icon={Zap}
          description={`Avg. ${metrics?.avgResolutionHours || 0}h turnaround`}
          accentColor="indigo"
          onClick={() => navigate('/admin/analytics')}
        />
      </div>

      {/* Analytics Charts Grid: Monthly Trends & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-navy-900 tracking-tight">Resolution Efficiency Trends</h3>
              <p className="text-xs text-slate-500">6-Month volume comparison: Incoming vs Resolved cases</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Live Audited
            </span>
          </div>

          <div className="py-2">
            {metrics?.monthlyTrends ? (
              <TrendLineChart trends={metrics.monthlyTrends} />
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
            )}
          </div>
        </div>

        {/* Category Breakdown (1 Col) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 lg:col-span-1 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-navy-900 tracking-tight">Category Distribution</h3>
            <p className="text-xs text-slate-500">Highest issue frequency by campus facility</p>
          </div>

          <div className="py-1">
            {metrics?.categoriesDistribution ? (
              <CategoryBarChart categories={metrics.categoriesDistribution.slice(0, 5)} />
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">Loading categories...</div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 text-center">
            <button
              onClick={() => navigate('/admin/analytics')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              View detailed report breakdown <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Workspace: Pending Administrative Actions & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions Triage Panel (1 Col) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-navy-900 tracking-tight">Immediate Action Required</h3>
              <p className="text-xs text-slate-500">Tickets awaiting department assignment</p>
            </div>
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold">
              {pendingReviewComplaints.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 my-2 space-y-2">
            {pendingReviewComplaints.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All submitted tickets have been assigned. Good job!
              </div>
            ) : (
              pendingReviewComplaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/complaint/${item.id}`)}
                  className="pt-2 cursor-pointer group hover:bg-slate-50 p-2 rounded-xl transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-navy-900">{item.referenceId}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>{item.category}</span>
                    <span className="text-teal-600 font-bold group-hover:underline">Review & Assign →</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => navigate('/admin/departments')}
              className="w-full rounded-xl bg-slate-50 hover:bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition border border-slate-200"
            >
              Manage Department Workloads
            </button>
          </div>
        </div>

        {/* Recent Master Complaints Queue (2 Cols) */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-navy-900">Recent Campus Complaints</h3>
              <p className="text-xs text-slate-500">Incoming student tickets across university facilities</p>
            </div>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              Open Full Master Queue <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/complaint/${c.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-navy-900">{c.referenceId}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{c.studentName || 'Student'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{c.studentRollNumber || ''}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-700 font-medium">{c.title}</td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {c.assignedDepartmentName || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/complaint/${c.id}`);
                        }}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
