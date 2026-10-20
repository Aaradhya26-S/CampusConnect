import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Tag,
  AlertTriangle,
  Upload,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { ComplaintPriority, Complaint } from '../types';
import { Modal } from '../components/Modal';

export const ComplaintSubmit: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [priority, setPriority] = useState<ComplaintPriority>('MEDIUM');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Success Confirmation State
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const categories = [
    { name: 'Infrastructure', desc: 'Civil works, broken windows, doors, structural issues' },
    { name: 'Electricity', desc: 'Lighting, fans, ACs, power outlets, switchboards' },
    { name: 'Water Supply', desc: 'Coolers, taps, plumbing, restroom facilities' },
    { name: 'Cleanliness', desc: 'Waste disposal, sanitation, common area hygiene' },
    { name: 'Internet and Wi-Fi', desc: 'Campus LAN, Wi-Fi access points, slow speed' },
    { name: 'Hostel', desc: 'Room furniture, hostel mess, laundry, resident services' },
    { name: 'Classroom', desc: 'Projectors, smart boards, benches, audio systems' },
    { name: 'Library', desc: 'Reading hall amenities, catalog terminals, books' },
    { name: 'Other', desc: 'General campus utility issues not listed above' },
  ];

  const priorities: {
    level: ComplaintPriority;
    label: string;
    desc: string;
    color: string;
    border: string;
  }[] = [
    {
      level: 'LOW',
      label: 'Low',
      desc: 'Minor issue, non-disruptive',
      color: 'bg-slate-50 text-slate-700',
      border: 'border-slate-200 hover:border-slate-400',
    },
    {
      level: 'MEDIUM',
      label: 'Medium',
      desc: 'Normal priority, routine fix',
      color: 'bg-sky-50 text-sky-800',
      border: 'border-sky-200 hover:border-sky-400',
    },
    {
      level: 'HIGH',
      label: 'High',
      desc: 'Disrupts academic or daily work',
      color: 'bg-orange-50 text-orange-800',
      border: 'border-orange-200 hover:border-orange-400',
    },
    {
      level: 'URGENT',
      label: 'Urgent',
      desc: 'Critical safety or infrastructure failure',
      color: 'bg-rose-50 text-rose-800',
      border: 'border-rose-200 hover:border-rose-400',
    },
  ];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Create local object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setAttachmentUrl(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (location.trim().length < 3) {
      setError('Please provide specific campus location details.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Please provide a descriptive explanation (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const complaint = await api.createComplaint({
        title: title.trim(),
        category,
        priority,
        location: location.trim(),
        description: description.trim(),
        attachmentUrl: attachmentUrl || undefined,
      });

      setSubmittedComplaint(complaint);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title & Guidelines */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-navy-900">
              Submit a Campus Issue or Complaint
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Logged tickets are automatically routed to the responsible university department.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>Automatic Department Routing</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Complaint Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Issue Classification */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-teal-600" />
              1. Issue Classification & Category
            </h3>
            <p className="text-xs text-slate-500">Select the facility category that best represents the disruption</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <div
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                      {cat.name}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Severity & Priority */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              2. Urgency & Priority Level
            </h3>
            <p className="text-xs text-slate-500">
              Please indicate urgency honestly to prevent delay of critical safety issues
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {priorities.map((p) => {
              const isSelected = priority === p.level;
              return (
                <div
                  key={p.level}
                  onClick={() => setPriority(p.level)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-navy-900 bg-navy-900 text-white shadow-md'
                      : `border-slate-200 bg-white hover:border-slate-300 ${p.border}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-navy-900'}`}>
                      {p.label}
                    </span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-300" />}
                  </div>
                  <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Complaint Specifics */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/90 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              3. Complaint Details & Physical Location
            </h3>
            <p className="text-xs text-slate-500">Provide clear context for the dispatched maintenance crew</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fluorescent tube light flickering in Lecture Hall B-204"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Precise Campus Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Academic Block B, 2nd Floor, Room 204 or Boys Hostel 4, Room 312"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Mention the Block, Wing, Floor, and Room number to help field technicians locate the issue quickly.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Comprehensive Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">{description.length}/2000 chars</span>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is broken, how long it has been occurring, and any immediate safety hazards..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Supporting Photo / Evidence (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition">
                <Upload className="h-4 w-4 text-slate-500" />
                <span>Choose Image or File</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <span className="text-xs font-mono text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200 truncate max-w-xs">
                  {fileName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition shadow-md disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Complaint Ticket</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Submission Success Confirmation Modal */}
      <Modal
        isOpen={!!submittedComplaint}
        onClose={() => {
          setSubmittedComplaint(null);
          navigate('/my-complaints');
        }}
        title="Complaint Lodged Successfully"
        description="Your issue has entered the campus maintenance resolution queue."
      >
        {submittedComplaint && (
          <div className="space-y-4">
            <div className="rounded-xl bg-teal-50/70 border border-teal-200 p-4 text-center space-y-1">
              <span className="text-xs font-medium text-teal-800">Your Official Reference ID</span>
              <p className="text-2xl font-black font-mono tracking-wider text-teal-900">
                {submittedComplaint.referenceId}
              </p>
              <p className="text-[11px] text-teal-700">Please quote this ID in any administrative inquiries</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border border-slate-100 rounded-xl p-3 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-400">Title:</span>
                <span className="font-semibold text-navy-900 truncate max-w-[200px]">{submittedComplaint.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-navy-900">{submittedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority:</span>
                <span className="font-semibold text-navy-900">{submittedComplaint.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-navy-900 truncate max-w-[200px]">{submittedComplaint.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSubmittedComplaint(null);
                  navigate('/my-complaints');
                }}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Go to My Complaints
              </button>
              <button
                onClick={() => {
                  const id = submittedComplaint.id;
                  setSubmittedComplaint(null);
                  navigate(`/complaint/${id}`);
                }}
                className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800"
              >
                Inspect Ticket Details →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
