import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onQuickLogin: (role: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onQuickLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid institutional login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 text-slate-900 font-sans">
      {/* Institutional Identity Card */}
      <div className="bg-white p-6 rounded border border-slate-300 shadow-2xs text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 border-2 border-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShieldCheck className="w-10 h-10 text-slate-900" />
        </div>
        <div>
          <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Statutory Authentication Service</div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">AICTE CISP Portal Login</h2>
          <p className="text-xs text-slate-700 font-medium mt-1">Single Sign-On (SSO) for University Nodal Officers, National Reviewers & AICTE Authorities</p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="bg-white p-6 rounded border border-slate-300 shadow-2xs space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-950 p-3 rounded text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wide mb-1">
              Official Email Address / AICTE ID
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="nodal.officer@university.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-400 rounded p-2.5 pl-9 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800 placeholder:text-slate-500 shadow-2xs"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wide mb-1">
              Statutory Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-400 rounded p-2.5 pl-9 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800 placeholder:text-slate-500 shadow-2xs"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-400 text-amber-600 focus:ring-amber-500" />
              <span className="font-medium text-slate-800">Remember session</span>
            </label>
            <a href="#" className="hover:underline text-slate-900 font-semibold">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs py-3 rounded shadow-2xs transition-colors flex items-center justify-center space-x-2 border border-amber-600 cursor-pointer"
          >
            <span>{loading ? 'Authenticating Credentials...' : 'Authenticate & Access Portal'}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </form>
      </div>

      {/* Role Simulator Box */}
      <div className="bg-slate-50 p-5 rounded border border-slate-300 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 font-semibold text-slate-900 text-xs uppercase border-b border-slate-200 pb-1">
          <UserCheck className="w-4 h-4 text-amber-800" />
          <span>Evaluation Demo — One-Click Role Simulator:</span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <button onClick={() => onQuickLogin('super_admin')} className="text-left bg-white p-2.5 rounded border border-slate-300 hover:bg-purple-50 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">AICTE Super Admin</div>
              <div className="text-[11px] text-slate-600 font-medium">admin@aicte.gov.in</div>
            </div>
            <span className="bg-purple-100 text-purple-950 border border-purple-300 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">Login</span>
          </button>

          <button onClick={() => onQuickLogin('reviewer')} className="text-left bg-white p-2.5 rounded border border-slate-300 hover:bg-blue-50 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">National Reviewer</div>
              <div className="text-[11px] text-slate-600 font-medium">reviewer@aicte.gov.in</div>
            </div>
            <span className="bg-blue-100 text-blue-950 border border-blue-300 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">Login</span>
          </button>

          <button onClick={() => onQuickLogin('university_admin')} className="text-left bg-white p-2.5 rounded border border-slate-300 hover:bg-emerald-50 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">University Nodal Officer (IIT Bombay)</div>
              <div className="text-[11px] text-slate-600 font-medium">admin@iitb.ac.in</div>
            </div>
            <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">Login</span>
          </button>

          <button onClick={() => onQuickLogin('faculty')} className="text-left bg-white p-2.5 rounded border border-slate-300 hover:bg-amber-50 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">Curriculum Designer / Faculty</div>
              <div className="text-[11px] text-slate-600 font-medium">faculty@iitb.ac.in</div>
            </div>
            <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
