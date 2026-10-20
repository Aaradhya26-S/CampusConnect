import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Phone, Building, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROHIBITED_STUDENT_ID, isValidStudentId } from '../utils/studentId';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const departmentsList = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Information Technology',
    'Biotechnology',
    'Business Administration',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (studentId.trim()) {
      if (studentId.trim() === PROHIBITED_STUDENT_ID) {
        setError('The entered Student ID is strictly prohibited from use.');
        return;
      }
      if (!isValidStudentId(studentId.trim())) {
        setError('Student ID must start with 5900 followed by 5 digits (e.g. 590014298).');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        studentId: studentId.trim() || undefined,
        department,
        phone,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* Left Brand Panel */}
      <div className="lg:w-5/12 bg-navy-950 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/25">
            <GraduationCap className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              Campus <span className="text-teal-400">Connect</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
              Student Registration Portal
            </p>
          </div>
        </div>

        <div className="relative z-10 my-8 space-y-4 max-w-sm">
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Join your university digital campus helpdesk.
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Report facility disruptions, electrical defects, Wi-Fi anomalies, or sanitation issues directly to university maintenance departments.
          </p>

          <div className="space-y-2 pt-2">
            {[
              'Automated 5900-series Student ID generation',
              'Real-time notifications on ticket dispatch',
              'Full transparency on department resolutions',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500">
          Campus Connect Student Onboarding • v1.0.0
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-navy-900">Create student account</h3>
            <p className="text-xs text-slate-500">
              Fill in your university credentials to access the campus complaint system
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campusconnect.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Student Roll ID (Optional)</label>
                  <span className="text-[10px] text-teal-600 font-medium">5900XXXXX format</span>
                </div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Leave blank for auto-generation"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  If left blank, an official 5900-series ID will be automatically generated.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Department</label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {departmentsList.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
