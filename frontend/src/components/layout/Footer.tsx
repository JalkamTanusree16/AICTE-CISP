import React from 'react';
import { ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-200 text-slate-900 text-xs border-t-4 border-amber-500 mt-12 font-medium">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 border-b-2 border-slate-300">
        
        {/* Col 1: Portal Overview */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm uppercase">
            <ShieldCheck className="w-5 h-5 text-amber-700 font-bold" />
            <span>AICTE CISP PORTAL</span>
          </div>
          <p className="text-slate-800 text-xs leading-relaxed font-medium">
            National Curriculum Intelligence & Standardization Platform — Statutory authority digital portal for standardizing course curricula across Indian technical universities.
          </p>
          <div className="text-[11px] text-slate-900 font-medium bg-amber-100 p-1.5 rounded border border-amber-500 inline-block shadow-2xs">
            Status: Fully Operational Persistent Engine v1.0.0
          </div>
        </div>

        {/* Col 2: Institutional Links */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-3 border-b-2 border-slate-300 pb-1 text-xs uppercase tracking-wider">
            Statutory Links
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="text-[#003366] hover:text-slate-900 underline flex items-center space-x-1">
                <span>Official AICTE Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#003366]"/>
              </a>
            </li>
            <li><a href="#" className="text-[#003366] hover:text-slate-900 underline">Model Curricula Guidelines 2027–28</a></li>
            <li><a href="#" className="text-[#003366] hover:text-slate-900 underline">Approved Universities Registry</a></li>
            <li><a href="#" className="text-[#003366] hover:text-slate-900 underline">National Credit Framework (NCrF)</a></li>
            <li><a href="#" className="text-[#003366] hover:text-slate-900 underline">Outcome-Based Education (OBE) Standard</a></li>
          </ul>
        </div>

        {/* Col 3: Technical Bureaus & Helpdesk */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-3 border-b-2 border-slate-300 pb-1 text-xs uppercase tracking-wider">
            Academic Bureau & Helpdesk
          </h4>
          <div className="space-y-2 text-slate-800 font-medium">
            <p className="font-semibold text-slate-900 text-xs">AICTE Academic Cell</p>
            <p className="flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-slate-800 shrink-0"/>
              <span className="font-medium text-slate-900">curriculum-helpdesk@aicte-india.org</span>
            </p>
            <p className="flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-slate-800 shrink-0"/>
              <span className="font-medium text-slate-900">+91-11-29581000 / Toll Free: 1800-11-1200</span>
            </p>
            <p className="text-slate-800 font-medium">Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</p>
          </div>
        </div>

        {/* Col 4: Statutory Disclaimer Box */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-3 border-b-2 border-slate-300 pb-1 text-xs uppercase tracking-wider">
            Statutory Notice
          </h4>
          <div className="bg-slate-900 text-slate-100 p-3 rounded border border-slate-700 text-[11px] leading-relaxed font-medium shadow-2xs">
            <p className="font-semibold text-amber-300 mb-1">Demonstration Disclaimer:</p>
            This prototype is developed for academic evaluation based on the Smart India Hackathon problem statement. AI-generated analyses are strictly labeled as{' '}
            <b className="text-amber-200 font-semibold">AI-Assisted Analysis</b> and require{' '}
            <b className="text-amber-200 font-semibold">Human/Authority Approval</b> for academic governance.
          </div>
        </div>
      </div>

      {/* Copyright & Version Strip */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-900 font-medium gap-2">
        <div className="text-slate-800">
          © 2026 All India Council for Technical Education (AICTE). All Rights Reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-[#003366] hover:text-slate-900 underline">Privacy Policy</a>
          <a href="#" className="text-[#003366] hover:text-slate-900 underline">Terms of Service</a>
          <a href="#" className="text-[#003366] hover:text-slate-900 underline">Accessibility Statement</a>
          <a href="#" className="text-[#003366] hover:text-slate-900 underline">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
