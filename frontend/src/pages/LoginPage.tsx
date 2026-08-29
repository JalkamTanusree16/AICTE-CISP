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
    <div className="max-w-md mx-auto my-8 space-y-6 text-black">
      {/* Institutional Identity Card */}
      <div className="bg-white p-6 rounded border-2 border-slate-400 shadow-md text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-400 text-black border-2 border-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-10 h-10 text-black font-bold" />
        </div>
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">Statutory Authentication Service</div>
          <h2 className="text-xl font-black text-black tracking-tight">AICTE CISP Portal Login</h2>
          <p className="text-xs text-black font-extrabold mt-1">Single Sign-On (SSO) for University Nodal Officers, National Reviewers & AICTE Authorities</p>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="bg-white p-6 rounded border-2 border-slate-400 shadow-md space-y-4">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-950 p-3 rounded text-xs font-black">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Official Email Address / AICTE ID
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="nodal.officer@university.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-slate-500 rounded p-2.5 pl-9 text-xs font-black text-black focus:outline-none focus:border-black placeholder:text-slate-700 shadow-2xs"
              />
              <Mail className="w-4 h-4 text-black absolute left-3 top-3 font-bold" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wide mb-1">
              Statutory Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-slate-500 rounded p-2.5 pl-9 text-xs font-black text-black focus:outline-none focus:border-black placeholder:text-slate-700 shadow-2xs"
              />
              <Lock className="w-4 h-4 text-black absolute left-3 top-3 font-bold" />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-400 text-amber-600 focus:ring-amber-500" />
              <span className="font-extrabold text-black">Remember session</span>
            </label>
            <a href="#" className="hover:underline text-black font-black">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-black font-black text-xs py-3 rounded shadow-sm transition-colors flex items-center justify-center space-x-2 border border-amber-600 cursor-pointer"
          >
            <span>{loading ? 'Authenticating Credentials...' : 'Authenticate & Access Portal'}</span>
            <ArrowRight className="w-4 h-4 text-black font-bold" />
          </button>
        </form>
      </div>

      {/* Role Simulator Box */}
      <div className="bg-slate-100 p-5 rounded border-2 border-slate-400 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 font-black text-black text-xs uppercase border-b-2 border-slate-300 pb-1">
          <UserCheck className="w-4 h-4 text-amber-800 font-bold" />
          <span>Evaluation Demo — One-Click Role Simulator:</span>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <button onClick={() => onQuickLogin('super_admin')} className="text-left bg-white p-2.5 rounded border-2 border-slate-400 hover:bg-purple-100 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-black text-black">AICTE Super Admin</div>
              <div className="text-[11px] text-black font-extrabold">admin@aicte.gov.in</div>
            </div>
            <span className="bg-purple-200 text-black border border-purple-400 text-[10px] font-black px-2 py-0.5 rounded">Login</span>
          </button>

          <button onClick={() => onQuickLogin('reviewer')} className="text-left bg-white p-2.5 rounded border-2 border-slate-400 hover:bg-blue-100 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-black text-black">National Reviewer</div>
              <div className="text-[11px] text-black font-extrabold">reviewer@aicte.gov.in</div>
            </div>
            <span className="bg-blue-200 text-black border border-blue-400 text-[10px] font-black px-2 py-0.5 rounded">Login</span>
          </button>

          <button onClick={() => onQuickLogin('university_admin')} className="text-left bg-white p-2.5 rounded border-2 border-slate-400 hover:bg-emerald-100 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-black text-black">University Nodal Officer (IIT Bombay)</div>
              <div className="text-[11px] text-black font-extrabold">admin@iitb.ac.in</div>
            </div>
            <span className="bg-emerald-200 text-black border border-emerald-400 text-[10px] font-black px-2 py-0.5 rounded">Login</span>
          </button>

          <button onClick={() => onQuickLogin('faculty')} className="text-left bg-white p-2.5 rounded border-2 border-slate-400 hover:bg-amber-100 flex justify-between items-center transition-colors shadow-2xs cursor-pointer">
            <div>
              <div className="font-black text-black">Curriculum Designer / Faculty</div>
              <div className="text-[11px] text-black font-extrabold">faculty@iitb.ac.in</div>
            </div>
            <span className="bg-amber-200 text-black border border-amber-400 text-[10px] font-black px-2 py-0.5 rounded">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
