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
    super_admin: { label: "AICTE SUPER ADMIN", color: "bg-purple-100 text-purple-950 border-purple-400" },
    reviewer: { label: "NATIONAL REVIEWER", color: "bg-blue-100 text-blue-950 border-blue-400" },
    university_admin: { label: "UNIVERSITY NODAL OFFICER", color: "bg-emerald-100 text-emerald-950 border-emerald-400" },
    faculty: { label: "CURRICULUM DESIGNER", color: "bg-amber-100 text-amber-950 border-amber-400" },
    public: { label: "PUBLIC CITIZEN", color: "bg-slate-100 text-slate-900 border-slate-400" }
  };

  const currentRole = user?.role ? roleLabels[user.role] : roleLabels.public;

  return (
    <header className="bg-white border-b-2 border-slate-300 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Institutional Identity Banner */}
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 border-2 border-amber-600 shadow-xs shrink-0">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Ministry of Education • Statutory Body of GOI
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight leading-tight group-hover:text-amber-900 transition-colors">
              AICTE National Curriculum Intelligence & Standardization Portal
            </h1>
            <p className="text-xs text-slate-700 font-medium">
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
              className="w-full bg-white border border-slate-400 rounded px-3 py-1.5 pl-8 text-xs font-medium text-slate-900 placeholder:text-slate-500 shadow-2xs focus:outline-none focus:border-slate-800"
            />
            <Search className="w-4 h-4 text-slate-600 absolute left-2.5 top-2.5" />
          </form>

          {/* User Profile / Quick Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-400 px-3 py-1.5 rounded text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-slate-800" />
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-slate-900 line-clamp-1">{user.full_name}</div>
                  <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded border inline-block whitespace-nowrap ${currentRole.color}`}>
                    {currentRole.label}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-800" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-400 shadow-xl rounded z-50 p-2 text-xs text-slate-900">
                  <div className="px-2 py-1 border-b border-slate-200 mb-2">
                    <div className="font-semibold text-slate-900">{user.full_name}</div>
                    <div className="text-slate-600 text-[11px] font-medium">{user.email}</div>
                  </div>
                  
                  <div className="text-[10px] font-semibold text-slate-700 uppercase px-2 py-1 tracking-wide">
                    Quick Role Simulator (SIH Demo):
                  </div>
                  <div className="space-y-1 mb-2 font-medium">
                    <button onClick={() => { onQuickLogin('super_admin'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-purple-50 text-slate-900 rounded flex items-center justify-between cursor-pointer">
                      <span className="font-medium text-slate-900">AICTE Super Admin</span>
                      <span className="text-[9px] bg-purple-100 text-purple-950 border border-purple-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">Admin</span>
                    </button>
                    <button onClick={() => { onQuickLogin('reviewer'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-blue-50 text-slate-900 rounded flex items-center justify-between cursor-pointer">
                      <span className="font-medium text-slate-900">AICTE Reviewer</span>
                      <span className="text-[9px] bg-blue-100 text-blue-950 border border-blue-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">Review</span>
                    </button>
                    <button onClick={() => { onQuickLogin('university_admin'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-emerald-50 text-slate-900 rounded flex items-center justify-between cursor-pointer">
                      <span className="font-medium text-slate-900">University Nodal Officer</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-950 border border-emerald-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">IITB</span>
                    </button>
                    <button onClick={() => { onQuickLogin('faculty'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-amber-50 text-slate-900 rounded flex items-center justify-between cursor-pointer">
                      <span className="font-medium text-slate-900">Faculty Designer</span>
                      <span className="text-[9px] bg-amber-100 text-amber-950 border border-amber-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">Faculty</span>
                    </button>
                    <button onClick={() => { onQuickLogin('public'); setShowRoleDropdown(false); }} className="w-full text-left px-2 py-1.5 hover:bg-slate-100 text-slate-900 rounded flex items-center justify-between cursor-pointer">
                      <span className="font-medium text-slate-900">Public User</span>
                      <span className="text-[9px] bg-slate-100 text-slate-900 border border-slate-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">Read-only</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-200 pt-1">
                    <button
                      onClick={() => { onLogout(); setShowRoleDropdown(false); }}
                      className="w-full text-left px-2 py-1.5 hover:bg-red-50 text-red-950 font-medium rounded flex items-center space-x-1 cursor-pointer"
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
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-semibold px-4 py-2 rounded shadow-2xs transition-colors border border-amber-600"
            >
              Institutional Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
