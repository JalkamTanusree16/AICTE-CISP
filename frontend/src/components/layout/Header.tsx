import React, { useState } from 'react';
import { Search, ShieldCheck, UserCheck, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onQuickLogin: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onQuickLogin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const roleLabels: Record<string, { label: string; color: string }> = {
    super_admin: { label: "AICTE SUPER ADMIN", color: "bg-purple-200 text-purple-950 border-purple-600" },
    reviewer: { label: "NATIONAL REVIEWER", color: "bg-blue-200 text-blue-950 border-blue-600" },
    university_admin: { label: "UNIVERSITY NODAL OFFICER", color: "bg-emerald-200 text-emerald-950 border-emerald-600" },
    faculty: { label: "CURRICULUM DESIGNER", color: "bg-amber-200 text-amber-950 border-amber-600" },
    public: { label: "PUBLIC CITIZEN", color: "bg-slate-200 text-black border-slate-600" }
  };

  const currentRole = user?.role ? roleLabels[user.role] : roleLabels.public;

  return (
    <header className="bg-white border-b-2 border-slate-400 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Institutional Identity Banner */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-black border-2 border-amber-600 shadow-md shrink-0">
            <ShieldCheck className="w-8 h-8 text-black font-bold" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-900">
              Ministry of Education • Statutory Body of GOI
            </div>
            <h1 className="text-lg md:text-xl font-black text-black tracking-tight leading-tight group-hover:text-amber-900 transition-colors">
              AICTE National Curriculum Intelligence & Standardization Portal
            </h1>
            <p className="text-xs text-black font-extrabold">
              National Platform for Curriculum Mapping, Analysis, Gap Detection & Academic Governance (CISP)
            </p>
          </div>
        </Link>

        {/* Search & User Session Bar */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
            <input
              type="text"
              placeholder="Search curriculum, program, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-500 rounded px-3 py-1.5 pl-8 text-xs font-black text-black placeholder:text-slate-700 shadow-2xs focus:outline-none focus:border-black"
            />
            <Search className="w-4 h-4 text-black absolute left-2.5 top-2.5 font-bold" />
          </form>

          {/* User Profile / Quick Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-500 px-3 py-1.5 rounded text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-black font-bold" />
                <div className="text-left hidden lg:block">
                  <div className="font-black text-black line-clamp-1">{user.full_name}</div>
                  <div className={`text-[10px] font-black px-1.5 py-0.5 rounded border inline-block ${currentRole.color}`}>
                    {currentRole.label}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-black font-bold" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-white border-2 border-slate-500 shadow-2xl rounded z-50 p-2 text-xs text-black">
                  <div className="px-2 py-1 border-b-2 border-slate-300 mb-2">
                    <div className="font-black text-black">{user.full_name}</div>
                    <div className="text-black text-[11px] font-extrabold">{user.email}</div>
                  </div>
                  
                  <div className="text-[10px] font-black text-black uppercase px-2 py-1 tracking-wide">
                    Quick Role Simulator (SIH Demo):
                  </div>
                  <div className="space-y-1 mb-2 font-bold">
                    <button onClick={() => { onQuickLogin('super_admin'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-purple-100 text-black rounded flex items-center justify-between cursor-pointer">
                      <span className="font-black text-black">AICTE Super Admin</span>
                      <span className="text-[9px] bg-purple-200 text-purple-950 border border-purple-400 px-1.5 py-0.5 rounded font-black">Admin</span>
                    </button>
                    <button onClick={() => { onQuickLogin('reviewer'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-blue-100 text-black rounded flex items-center justify-between cursor-pointer">
                      <span className="font-black text-black">AICTE Reviewer</span>
                      <span className="text-[9px] bg-blue-200 text-blue-950 border border-blue-400 px-1.5 py-0.5 rounded font-black">Review</span>
                    </button>
                    <button onClick={() => { onQuickLogin('university_admin'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-emerald-100 text-black rounded flex items-center justify-between cursor-pointer">
                      <span className="font-black text-black">University Nodal Officer</span>
                      <span className="text-[9px] bg-emerald-200 text-emerald-950 border border-emerald-400 px-1.5 py-0.5 rounded font-black">IITB</span>
                    </button>
                    <button onClick={() => { onQuickLogin('faculty'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-amber-100 text-black rounded flex items-center justify-between cursor-pointer">
                      <span className="font-black text-black">Faculty Designer</span>
                      <span className="text-[9px] bg-amber-200 text-amber-950 border border-amber-400 px-1.5 py-0.5 rounded font-black">Faculty</span>
                    </button>
                    <button onClick={() => { onQuickLogin('public'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-slate-200 text-black rounded flex items-center justify-between cursor-pointer">
                      <span className="font-black text-black">Public User</span>
                      <span className="text-[9px] bg-slate-200 text-black border border-slate-400 px-1.5 py-0.5 rounded font-black">Read-only</span>
                    </button>
                  </div>

                  <div className="border-t-2 border-slate-300 pt-1">
                    <button
                      onClick={() => { onLogout(); setShowRoleDropdown(false); }}
                      className="w-full text-left px-2 py-1.5 hover:bg-red-100 text-red-950 font-black rounded flex items-center space-x-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-900" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-black px-4 py-2 rounded shadow-sm transition-colors border border-amber-600"
            >
              Institutional Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
