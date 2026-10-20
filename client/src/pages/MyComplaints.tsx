import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Inbox,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { Complaint, ComplaintStatus } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';

export const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [priority, setPriority] = useState<string>(searchParams.get('priority') || 'ALL');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10));

  const categories = [
    'Infrastructure',
    'Electricity',
    'Water Supply',
    'Cleanliness',
    'Internet and Wi-Fi',
    'Hostel',
    'Classroom',
    'Library',
    'Other',
  ];

  const statuses: { value: string; label: string }[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  useEffect(() => {
    async function fetchMyComplaints() {
      try {
        setLoading(true);
        const res = await api.getComplaints({
          status,
          category,
          priority,
          search,
          page,
          limit: 8,
        });

        setComplaints(res.complaints);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyComplaints();
  }, [status, category, priority, search, page]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setCategory('ALL');
    setPriority('ALL');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            My Registered Complaints
          </h2>
          <p className="text-xs text-slate-500">
            Search, filter, and monitor the resolution progress of your campus reports
          </p>
        </div>

        <button
          onClick={() => navigate('/submit')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference ID, title, or location..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter / Reset */}
          <div className="flex items-center gap-2">
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {(search || status !== 'ALL' || category !== 'ALL' || priority !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Complaints Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your complaint records...</div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">No complaints found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No complaint tickets match your current filters. Try resetting the search terms or log a new issue.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5">Reference ID</th>
                    <th className="py-3.5 px-4">Complaint Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-5 text-right">Details</th>
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
                        <p className="text-[11px] text-slate-500 truncate">{item.description}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[150px] truncate">
                        {item.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/complaint/${item.id}`);
                          }}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
              <span>
                Showing {complaints.length} of {total} records
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-medium text-slate-700">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
