import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginId.trim() || !password) {
      setError('Please provide your university email or student ID and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(loginId, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoStudentLogin = async () => {
    setLoginId('student@campusconnect.edu');
    setPassword('DemoStudent123!');
    setIsSubmitting(true);
    try {
      const user = await login('student@campusconnect.edu', 'DemoStudent123!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    setLoginId('admin@campusconnect.edu');
    setPassword('DemoAdmin123!');
    setIsSubmitting(true);
    try {
      const user = await login('admin@campusconnect.edu', 'DemoAdmin123!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* Left Brand Panel (Navy SaaS Showcase) */}
      <div className="lg:w-1/2 bg-navy-950 text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative geometric background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Ambient Teal Glow */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/25">
            <GraduationCap className="h-7 w-7 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Campus <span className="text-teal-400">Connect</span>
            </h1>
            <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              University Issue & Facility Management
            </p>
          </div>
        </div>

        {/* Hero Pitch */}
        <div className="relative z-10 my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>DevOps Certified University Portal</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Streamlined Campus Issue Tracking for Students & Administration.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Report facility disruptions, monitor maintenance tickets with live progress stages, and empower university departments with real-time operational analytics.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Direct department assignment and technician tracking',
              'Audited lifecycle history from submission to resolution',
              'Student complaint reopening with mandatory explanation',
              'Comprehensive operational reports and CSV data export',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          Campus Connect System • v1.0.0
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-navy-900">Sign in to your account</h3>
            <p className="text-xs text-slate-500">
              Enter your university email or 9-digit Student ID to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                University Email or Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="student@campusconnect.edu or 5900XXXXX"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy-900 py-3 text-sm font-semibold text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 transition shadow-md disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo One-Click Sign In */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or 1-Click Demo Login
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-50 hover:border-teal-300 text-teal-900 text-xs font-semibold transition group shadow-sm"
              >
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Student Role</span>
                <span className="mt-0.5 text-navy-900 font-bold">Aarav Sharma</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-900 text-xs font-semibold transition group shadow-sm"
              >
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Admin Role</span>
                <span className="mt-0.5 text-navy-900 font-bold">Vikram Oberoi</span>
              </button>
            </div>
          </div>

          {/* Registration Link */}
          <p className="text-center text-xs text-slate-500 pt-3">
            New university student?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              Create student account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
