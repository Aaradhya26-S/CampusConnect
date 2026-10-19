import React, { useState, useEffect } from 'react';
import { Building2, PlusCircle, Mail, User, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Department } from '../types';
import { Modal } from '../components/Modal';

export const AdminDepartment: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadDepts() {
      try {
        setLoading(true);
        const data = await api.getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createDepartment({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        headName: headName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        description: description.trim() || undefined,
      });

      setDepartments((prev) => [...prev, created]);
      setShowAddModal(false);
      setName('');
      setCode('');
      setHeadName('');
      setContactEmail('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            University Maintenance Departments
          </h2>
          <p className="text-xs text-slate-500">
            Authorized campus operational cells and engineering divisions handling service tickets
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading department registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-soft p-5 flex flex-col justify-between hover:shadow-card transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="rounded-xl p-2.5 bg-navy-50 text-navy-900 border border-navy-100">
                    <Building2 className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {dept.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dept.description || 'General maintenance and campus services division.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                {dept.headName && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-medium">Head: {dept.headName}</span>
                  </div>
                )}
                {dept.contactEmail && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{dept.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Campus Department"
        description="Add a new administrative cell to the complaint assignment directory."
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Laboratory Safety & Chemical Maintenance"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department Code (Short Acronym) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={10}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. LSCM"
              className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department Head / Officer In-Charge</label>
            <input
              type="text"
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              placeholder="e.g. Dr. Ramesh Gupta"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Dispatch Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="dept@campusconnect.edu"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Functional Scope & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of responsibilities and maintenance coverage..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
