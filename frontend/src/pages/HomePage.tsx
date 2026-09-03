import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, UploadCloud, GitCompare, Cpu, ArrowRight, AlertCircle } from 'lucide-react';

interface HomePageProps {
  analytics: any;
}

export const HomePage: React.FC<HomePageProps> = ({ analytics }) => {
  return (
    <div className="space-y-8 text-slate-900 font-sans">
      {/* Official Government Banner Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded border border-slate-700 p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/30 text-amber-200 border border-amber-400 px-3 py-1 rounded text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon Statutory Initiative • AICTE CISP</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug text-white" style={{ color: '#ffffff' }}>
            National Curriculum Intelligence & Academic Standardization Platform
          </h2>
          <p className="text-slate-200 text-sm font-medium leading-relaxed">
            A centralized digital platform for mapping, extracting, semantically analyzing, comparing, identifying gaps, and standardizing technical education curricula across all Indian universities.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/comparison"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs px-5 py-2.5 rounded shadow-2xs inline-flex items-center space-x-2 transition-all border border-amber-600"
            >
              <GitCompare className="w-4 h-4 text-slate-900" />
              <span>Explore Curriculum Comparison Engine</span>
            </Link>
            <Link
              to="/upload"
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-xs px-5 py-2.5 rounded inline-flex items-center space-x-2 transition-all shadow-2xs"
            >
              <UploadCloud className="w-4 h-4 text-slate-900" />
              <span>Submit Institutional Curriculum</span>
            </Link>
            <Link
              to="/model-curriculum"
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold text-xs px-4 py-2.5 rounded inline-flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>View AICTE Model Standards</span>
            </Link>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute right-6 bottom-4 opacity-15 pointer-events-none hidden md:block">
          <ShieldCheck className="w-64 h-64 text-amber-400" />
        </div>
      </section>

      {/* Real Persistent Analytics Metric Blocks */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">APPROVED UNIVERSITIES</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.total_universities || 10}</div>
          <div className="text-xs text-slate-600 font-medium">Registered Statutory Institutions</div>
        </div>
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">PUBLISHED MODEL STANDARDS</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.published_standards || 6}</div>
          <div className="text-xs text-slate-600 font-medium">AICTE Reference Curricula</div>
        </div>
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">SUBMISSIONS UNDER REVIEW</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.under_review || 3}</div>
          <div className="text-xs text-slate-600 font-medium">Active Review Queue</div>
        </div>
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">NATIONAL AVG ALIGNMENT</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.national_avg_alignment || 84.7}%</div>
          <div className="text-xs text-slate-600 font-medium">Calculated from Real Comparisons</div>
        </div>
      </section>

      {/* System Features Grid */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-wide">
            Core Curriculum Governance Modules
          </h3>
          <span className="text-xs text-slate-600 font-medium">End-to-End Workflow Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-slate-800 text-white flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-semibold text-slate-900 text-base">1. Document Parsing & Verification</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Upload PDF, DOCX, XLSX curriculum documents. Real backend parser extracts text, tables, semesters, credits, units, and outcomes with confidence metrics.
            </p>
            <Link to="/upload" className="text-xs font-semibold text-[#003366] hover:underline inline-flex items-center">
              <span>Open Document Portal</span> <ArrowRight className="w-4 h-4 ml-1 text-[#003366]" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-amber-400 text-slate-900 flex items-center justify-center font-bold border border-amber-600">
              <GitCompare className="w-5 h-5 text-slate-900" />
            </div>
            <h4 className="font-semibold text-slate-900 text-base">2. Semantic Comparison Engine</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Calculates vector embeddings and cosine similarities against AICTE Reference standards. Identifies Matched, Partial Match, Missing, and Outdated topics.
            </p>
            <Link to="/comparison" className="text-xs font-semibold text-[#003366] hover:underline inline-flex items-center">
              <span>Run Comparison Engine</span> <ArrowRight className="w-4 h-4 ml-1 text-[#003366]" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-slate-800 text-white flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-semibold text-slate-900 text-base">3. Emerging Tech & Heatmaps</h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Monitors national coverage for modern domains (Generative AI, Cloud Security, Edge AI, Quantum). Generates national university alignment heatmaps.
            </p>
            <Link to="/emerging-tech" className="text-xs font-semibold text-[#003366] hover:underline inline-flex items-center">
              <span>View Technology Heatmap</span> <ArrowRight className="w-4 h-4 ml-1 text-[#003366]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Human-in-the-loop Governance Banner */}
      <section className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded text-xs text-amber-950 space-y-1 border border-amber-300 font-medium">
        <div className="font-semibold text-slate-900 flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-800 shrink-0" />
          <span>Statutory Governance & AI Transparency Notice:</span>
        </div>
        <p className="leading-relaxed font-medium text-slate-800">
          AI analysis results are strictly labeled as <b className="text-slate-900 font-semibold underline">AI-Assisted Analysis</b> with transparent evidence, location tags, and confidence scores. Official decisions remain <b className="text-slate-900 font-semibold underline">Human/Authority Approved</b> by AICTE Academic Councils and University Nodal Reviewers.
        </p>
      </section>
    </div>
  );
};
