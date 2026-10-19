import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import { MetricCard } from '../components/MetricCard';
import { TrendLineChart, CategoryBarChart, StatusDonutChart } from '../components/Charts';

export const AnalyticsReports: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await api.getDashboardAnalytics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleExportCsv = () => {
    window.open(api.getCsvExportUrl(), '_blank');
  };

  const statusDonutData = metrics?.statusDistribution
    ? metrics.statusDistribution.map((s) => ({ label: s.label, count: s.count }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            Campus Operational Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500">
            Statistical breakdown of complaint volumes, resolution time KPIs, and category distributions
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition"
        >
          <Download className="h-4 w-4" />
          <span>Export Full CSV Dataset</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Resolution Rate"
          value={`${metrics?.resolutionRate || 0}%`}
          icon={CheckCircle2}
          description="Completed complaints ratio"
          accentColor="emerald"
        />
        <MetricCard
          title="Average Resolution Turnaround"
          value={`${metrics?.avgResolutionHours || 0} hrs`}
          icon={Clock}
          description="Average ticket closure duration"
          accentColor="teal"
        />
        <MetricCard
          title="Total Lifetime Tickets"
          value={metrics?.total || 0}
          icon={BarChart3}
          description="Logged in Campus Connect"
          accentColor="navy"
        />
        <MetricCard
          title="Active Open Tickets"
          value={(metrics?.pending || 0) + (metrics?.inProgress || 0)}
          icon={AlertCircle}
          description="Under review & maintenance"
          accentColor="amber"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-navy-900 tracking-tight">
              Monthly Volume & Resolution Trajectory
            </h3>
            <p className="text-xs text-slate-500">Comparative trend of reported cases vs solved cases</p>
          </div>

          <div className="py-2">
            {metrics?.monthlyTrends ? (
              <TrendLineChart trends={metrics.monthlyTrends} />
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">Loading trends...</div>
            )}
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-navy-900 tracking-tight">Status Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of tickets across lifecycle stages</p>
          </div>

          <div className="py-2">
            <StatusDonutChart data={statusDonutData} />
          </div>
        </div>
      </div>

      {/* Category Breakdown Full Width Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-navy-900 tracking-tight">Category Breakdown</h3>
          <p className="text-xs text-slate-500">Facility distribution and issue frequency ranking</p>
        </div>

        <div className="py-2 max-w-2xl">
          {metrics?.categoriesDistribution ? (
            <CategoryBarChart categories={metrics.categoriesDistribution} />
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">Loading categories...</div>
          )}
        </div>
      </div>
    </div>
  );
};
