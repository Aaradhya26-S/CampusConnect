import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Paperclip,
  Share2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Complaint, Department, ComplaintStatus } from '../types';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/Badge';
import { StatusTimeline } from '../components/StatusTimeline';
import { Modal } from '../components/Modal';

export const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment Form State
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState('');
  const [assignedDeptId, setAssignedDeptId] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Rejection Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Reopen Modal
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    async function loadComplaint() {
      if (!id) return;
      try {
        setLoading(true);
        const [cmp, depts] = await Promise.all([
          api.getComplaintById(id),
          api.getDepartments(),
        ]);
        setComplaint(cmp);
        setDepartments(depts);
        if (cmp.assignedDepartmentId) {
          setAssignedDeptId(cmp.assignedDepartmentId);
        }
        if (cmp.assignedStaffName) {
          setAssignedStaff(cmp.assignedStaffName);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load complaint');
      } finally {
        setLoading(false);
      }
    }
    loadComplaint();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !complaint) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(complaint.id, commentText.trim(), isInternalComment);
      setComplaint((prev) =>
        prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null
      );
      setCommentText('');
      setIsInternalComment(false);
    } catch (err: any) {
      alert(err.message || 'Failed to post reply');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!complaint) return;
    try {
      const updated = await api.updateComplaintStatus(complaint.id, selectedStatus, {
        note: statusNote || undefined,
        assignedDepartmentId: assignedDeptId || undefined,
        assignedStaffName: assignedStaff || undefined,
        resolutionNotes: resolutionNotes || undefined,
      });
      setComplaint(updated);
      setShowStatusModal(false);
      setStatusNote('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleRejectComplaint = async () => {
    if (!complaint) return;
    if (!rejectionReason.trim()) {
      alert('A detailed rejection reason is required.');
      return;
    }

    try {
      const updated = await api.updateComplaintStatus(complaint.id, 'REJECTED', {
        rejectionReason: rejectionReason.trim(),
        note: `Complaint rejected: ${rejectionReason.trim()}`,
      });
      setComplaint(updated);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject complaint');
    }
  };

  const handleReopenComplaint = async () => {
    if (!complaint) return;
    if (reopenReason.trim().length < 5) {
      alert('Please provide an explanation with at least 5 characters for reopening.');
      return;
    }

    try {
      const updated = await api.reopenComplaint(complaint.id, reopenReason.trim());
      setComplaint(updated);
      setShowReopenModal(false);
      setReopenReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reopen complaint');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading complaint investigation file...</div>;
  }

  if (error || !complaint) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center border border-slate-200 space-y-3">
        <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-navy-900">Complaint Record Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested ticket does not exist or access is restricted.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to previous screen
        </button>
      </div>
    );
  }

  const isEligibleForReopen = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Complaints</span>
        </button>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {isEligibleForReopen && (
            <button
              onClick={() => setShowReopenModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reopen Complaint</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={() => {
                  setSelectedStatus(complaint.status === 'SUBMITTED' ? 'UNDER_REVIEW' : 'IN_PROGRESS');
                  setShowStatusModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm"
              >
                <span>Update Status & Assign</span>
              </button>

              {complaint.status !== 'REJECTED' && complaint.status !== 'CLOSED' && (
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-sm"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject Ticket</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Ticket Summary Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-navy-900 text-teal-300 tracking-wider">
                {complaint.referenceId}
              </span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <CategoryBadge category={complaint.category} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-navy-900">
              {complaint.title}
            </h2>
          </div>

          <div className="text-right sm:text-right text-xs text-slate-500 shrink-0">
            <p>Logged on {new Date(complaint.createdAt).toLocaleDateString()}</p>
            <p className="text-[11px] text-slate-400">
              {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Problem Description</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Campus Location</span>
            </div>
            <p className="text-xs font-bold text-navy-900">{complaint.location}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <User className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Reported By</span>
            </div>
            <p className="text-xs font-bold text-navy-900">{complaint.studentName || 'Student'}</p>
            {complaint.studentRollNumber && (
              <p className="text-[11px] text-slate-400 font-mono">ID: {complaint.studentRollNumber}</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Building className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Assigned Department</span>
            </div>
            <p className="text-xs font-bold text-navy-900">
              {complaint.assignedDepartmentName || 'Awaiting Assignment'}
            </p>
            {complaint.assignedStaffName && (
              <p className="text-[11px] text-teal-700 font-medium">Staff: {complaint.assignedStaffName}</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Resolution State</span>
            </div>
            <p className="text-xs font-bold text-navy-900">
              {complaint.resolvedAt ? `Resolved on ${new Date(complaint.resolvedAt).toLocaleDateString()}` : 'Under Resolution'}
            </p>
          </div>
        </div>

        {/* Resolution Notes Banner */}
        {complaint.resolutionNotes && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Official Resolution Notes
            </h5>
            <p className="text-xs text-emerald-800 leading-relaxed">{complaint.resolutionNotes}</p>
          </div>
        )}

        {/* Reopen Reason Banner */}
        {complaint.reopenReason && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Student Reopening Explanation
            </h5>
            <p className="text-xs text-amber-800 leading-relaxed">{complaint.reopenReason}</p>
          </div>
        )}
      </div>

      {/* Progress Lifecycle Timeline */}
      <StatusTimeline
        currentStatus={complaint.status}
        history={complaint.statusHistory}
        rejectionReason={complaint.rejectionReason}
        reopenReason={complaint.reopenReason}
      />

      {/* Comments & Updates Conversation Thread */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              Ticket Activity & Communications
            </h3>
            <p className="text-xs text-slate-500">Discussion between student and maintenance administration</p>
          </div>
          <span className="text-xs text-slate-400">
            {complaint.comments?.length || 0} message{complaint.comments?.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Message Thread */}
        <div className="space-y-4">
          {!complaint.comments || complaint.comments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No comments posted yet.</p>
          ) : (
            complaint.comments.map((comm) => {
              const isStaff = comm.userRole === 'ADMIN';
              return (
                <div
                  key={comm.id}
                  className={`rounded-xl p-4 border transition ${
                    comm.isInternal
                      ? 'bg-amber-50/60 border-amber-200'
                      : isStaff
                      ? 'bg-indigo-50/40 border-indigo-100'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-navy-900">{comm.userName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isStaff ? 'bg-navy-900 text-teal-300' : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {comm.userRole}
                      </span>
                      {comm.isInternal && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          Internal Staff Note
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comm.createdAt).toLocaleDateString()} {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{comm.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Reply Box */}
        <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-bold text-navy-900">Add a Response or Query</label>
          <textarea
            rows={3}
            required
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex items-center justify-between">
            {isAdmin ? (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={isInternalComment}
                  onChange={(e) => setIsInternalComment(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-medium">Internal Note (Visible to admin staff only)</span>
              </label>
            ) : (
              <span className="text-[11px] text-slate-400">Replies will notify university supervisors</span>
            )}

            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post Reply</span>
            </button>
          </div>
        </form>
      </div>

      {/* ADMIN STATUS & ASSIGNMENT MODAL */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status & Department Assignment"
        description="Progress ticket through operational stages and record audit notes."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned to Department</option>
              <option value="IN_PROGRESS">In Progress (Active Maintenance)</option>
              <option value="RESOLVED">Resolved (Completed)</option>
              <option value="CLOSED">Closed (Finalized)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Responsible Department</label>
            <select
              value={assignedDeptId}
              onChange={(e) => setAssignedDeptId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Technician / Staff Name</label>
            <input
              type="text"
              value={assignedStaff}
              onChange={(e) => setAssignedStaff(e.target.value)}
              placeholder="e.g. Ramesh K. (Senior Technician)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {selectedStatus === 'RESOLVED' && (
            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1">Resolution Summary Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Details of fix applied, parts replaced, and post-service verification..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Audit Note</label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Dispatched maintenance team to location"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowStatusModal(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
            >
              Confirm Status Transition
            </button>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Complaint Ticket"
        description="Provide a clear explanation for rejecting this complaint. This will be visible to the student."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-rose-800 mb-1">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Duplicate issue already tracked under CC-2025-WIFI02, or issue does not fall under university facilities purview..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowRejectModal(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectComplaint}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>

      {/* REOPEN MODAL */}
      <Modal
        isOpen={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        title="Reopen Resolved Complaint"
        description="If the issue has recurred or was not resolved satisfactorily, please provide justification."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Explanation for Reopening <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="Explain why this ticket is being reopened (e.g. the light fixture started flickering again after 1 hour)..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowReopenModal(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleReopenComplaint}
              className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
            >
              Submit Reopen Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
