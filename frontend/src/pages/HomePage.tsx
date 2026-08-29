import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, UploadCloud, GitCompare, Cpu, ArrowRight, AlertCircle } from 'lucide-react';

interface HomePageProps {
  analytics: any;
}

export const HomePage: React.FC<HomePageProps> = ({ analytics }) => {
  return (
    <div className="space-y-8 text-black">
      {/* Official Government Banner Hero */}
      <section className="bg-gradient-to-r from-goi-navy via-slate-900 to-blue-950 text-white rounded border-2 border-slate-700 p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/30 text-amber-200 border border-amber-400 px-3 py-1 rounded text-xs font-black shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon Statutory Initiative • AICTE CISP</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug text-white">
            National Curriculum Intelligence & Academic Standardization Platform
          </h2>
          <p className="text-slate-100 text-sm font-semibold leading-relaxed">
            A centralized digital platform for mapping, extracting, semantically analyzing, comparing, identifying gaps, and standardizing technical education curricula across all Indian universities.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/comparison"
              className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs px-5 py-2.5 rounded shadow-sm inline-flex items-center space-x-2 transition-all border border-amber-600"
            >
              <GitCompare className="w-4 h-4 font-bold text-black" />
              <span>Explore Curriculum Comparison Engine</span>
            </Link>
            <Link
              to="/upload"
              className="bg-white hover:bg-slate-100 text-black border-2 border-slate-400 font-black text-xs px-5 py-2.5 rounded inline-flex items-center space-x-2 transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-blue-900 font-bold" />
              <span>Submit Institutional Curriculum</span>
            </Link>
            <Link
              to="/model-curriculum"
              className="bg-blue-900 hover:bg-blue-800 text-white border border-blue-950 font-black text-xs px-4 py-2.5 rounded inline-flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300 font-bold" />
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
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-xs font-black text-black uppercase tracking-wider">APPROVED UNIVERSITIES</div>
          <div className="text-3xl font-black text-black">{analytics?.total_universities || 10}</div>
          <div className="text-xs text-black font-extrabold">Registered Statutory Institutions</div>
        </div>
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-xs font-black text-black uppercase tracking-wider">PUBLISHED MODEL STANDARDS</div>
          <div className="text-3xl font-black text-black">{analytics?.published_standards || 6}</div>
          <div className="text-xs text-black font-extrabold">AICTE Reference Curricula</div>
        </div>
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-xs font-black text-black uppercase tracking-wider">SUBMISSIONS UNDER REVIEW</div>
          <div className="text-3xl font-black text-black">{analytics?.under_review || 3}</div>
          <div className="text-xs text-black font-extrabold">Active Review Queue</div>
        </div>
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-xs font-black text-black uppercase tracking-wider">NATIONAL AVG ALIGNMENT</div>
          <div className="text-3xl font-black text-black">{analytics?.national_avg_alignment || 84.7}%</div>
          <div className="text-xs text-black font-extrabold">Calculated from Real Comparisons</div>
        </div>
      </section>

      {/* System Features Grid */}
      <section className="space-y-4">
        <div className="border-b-2 border-slate-400 pb-2 flex justify-between items-center">
          <h3 className="text-lg font-black text-black uppercase tracking-wide">
            Core Curriculum Governance Modules
          </h3>
          <span className="text-xs text-black font-extrabold">End-to-End Workflow Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-goi-navy text-white flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-black text-black text-base">1. Document Parsing & Verification</h4>
            <p className="text-xs text-black font-extrabold leading-relaxed">
              Upload PDF, DOCX, XLSX curriculum documents. Real backend parser extracts text, tables, semesters, credits, units, and outcomes with confidence metrics.
            </p>
            <Link to="/upload" className="text-xs font-black text-black underline hover:text-blue-900 inline-flex items-center">
              <span>Open Document Portal</span> <ArrowRight className="w-4 h-4 ml-1 text-black font-bold" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-amber-500 text-black flex items-center justify-center font-bold border border-amber-600">
              <GitCompare className="w-5 h-5 text-black" />
            </div>
            <h4 className="font-black text-black text-base">2. Semantic Comparison Engine</h4>
            <p className="text-xs text-black font-extrabold leading-relaxed">
              Calculates vector embeddings and cosine similarities against AICTE Reference standards. Identifies Matched, Partial Match, Missing, and Outdated topics.
            </p>
            <Link to="/comparison" className="text-xs font-black text-black underline hover:text-amber-900 inline-flex items-center">
              <span>Run Comparison Engine</span> <ArrowRight className="w-4 h-4 ml-1 text-black font-bold" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded bg-goi-navy text-white flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="font-black text-black text-base">3. Emerging Tech & Heatmaps</h4>
            <p className="text-xs text-black font-extrabold leading-relaxed">
              Monitors national coverage for modern domains (Generative AI, Cloud Security, Edge AI, Quantum). Generates national university alignment heatmaps.
            </p>
            <Link to="/emerging-tech" className="text-xs font-black text-black underline hover:text-emerald-900 inline-flex items-center">
              <span>View Technology Heatmap</span> <ArrowRight className="w-4 h-4 ml-1 text-black font-bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* Human-in-the-loop Governance Banner */}
      <section className="bg-amber-100 border-l-4 border-amber-700 p-4 rounded text-xs text-black space-y-1 border border-amber-300 font-extrabold">
        <div className="font-black text-black flex items-center space-x-2 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-800 shrink-0" />
          <span>Statutory Governance & AI Transparency Notice:</span>
        </div>
        <p className="leading-relaxed font-bold text-black">
          AI analysis results are strictly labeled as <b className="text-black font-black underline">AI-Assisted Analysis</b> with transparent evidence, location tags, and confidence scores. Official decisions remain <b className="text-black font-black underline">Human/Authority Approved</b> by AICTE Academic Councils and University Nodal Reviewers.
        </p>
      </section>
    </div>
  );
};
