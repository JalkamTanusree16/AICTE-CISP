import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, BookOpen, UploadCloud, GitCompare, ShieldAlert, Cpu, Award, FileText, Activity, Settings } from 'lucide-react';

interface NavbarProps {
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navItems = [
    { to: "/", label: "Portal Home", icon: Home },
    { to: "/dashboard", label: "National Dashboard", icon: LayoutDashboard },
    { to: "/model-curriculum", label: "Model Curricula", icon: BookOpen },
    { to: "/upload", label: "Submit Curriculum", icon: UploadCloud },
    { to: "/builder", label: "Curriculum Builder", icon: BookOpen },
    { to: "/comparison", label: "Semantic Comparer", icon: GitCompare },
    { to: "/reviewer", label: "Review Queue", icon: ShieldAlert },
    { to: "/emerging-tech", label: "Emerging Tech Heatmap", icon: Cpu },
    { to: "/co-po-mapping", label: "CO-PO Matrix", icon: Award },
    { to: "/reports", label: "Reports & Circulars", icon: FileText },
    { to: "/audit-logs", label: "Audit Log", icon: Activity },
    { to: "/settings", label: "Scoring Weights", icon: Settings },
  ];

  return (
    <nav className="bg-slate-200 text-black border-b-4 border-amber-500 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth py-2 space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded whitespace-nowrap transition-all border-2 ${
                    isActive
                      ? 'bg-amber-400 text-slate-900 border-amber-600 shadow-xs'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-amber-100 hover:text-slate-900 hover:border-amber-400 shadow-2xs'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-900" />
                <span className="tracking-tight text-slate-900 font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
