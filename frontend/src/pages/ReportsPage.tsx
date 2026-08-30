import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Download, FileSpreadsheet, Bell } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    api.getNotices().then(setNotices).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs">
        <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Statutory Documents & Reports Bureau</div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Official Reports, Circulars & Guidelines Hub</h2>
        <p className="text-xs text-slate-700 font-medium">Download officially generated standardization PDF/Excel reports and statutory AICTE circulars</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Printable PDF/Excel Reports Generator */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Generated Institutional Analysis Reports
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-semibold text-slate-900 text-sm">IIT Bombay B.Tech CSE (2027–28) Standardization Report</div>
                <div className="text-xs text-slate-600 font-medium">Overall Alignment Score: 84.7% • Generated via ReportLab</div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={api.getPdfReportUrl(1)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-amber-600 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" />
                  <span>PDF</span>
                </a>
                <a
                  href={api.getExcelReportUrl(1)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-300 hover:bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-emerald-500 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-950" />
                  <span>XLS</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-semibold text-slate-900 text-sm">Anna University B.Tech CSE (2027–28) Standardization Report</div>
                <div className="text-xs text-slate-600 font-medium">Overall Alignment Score: 82.0% • Generated via ReportLab</div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={api.getPdfReportUrl(2)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-amber-600 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" />
                  <span>PDF</span>
                </a>
                <a
                  href={api.getExcelReportUrl(2)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-300 hover:bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-emerald-500 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-950" />
                  <span>XLS</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded flex justify-between items-center shadow-2xs">
              <div>
                <div className="font-semibold text-slate-900 text-sm">VTU Belagavi B.Tech CSE (2026–27) Standardization Report</div>
                <div className="text-xs text-slate-600 font-medium">Overall Alignment Score: 78.3% • Generated via ReportLab</div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={api.getPdfReportUrl(3)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-amber-600 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" />
                  <span>PDF</span>
                </a>
                <a
                  href={api.getExcelReportUrl(3)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-300 hover:bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 border border-emerald-500 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-950" />
                  <span>XLS</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Circulars & Policy Bulletins */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center space-x-1">
            <Bell className="w-4 h-4 text-slate-800" />
            <span>AICTE Circulars & Policy Notifications</span>
          </h3>

          <div className="space-y-3 text-xs">
            {notices.length === 0 ? (
              <div className="text-center py-4 text-slate-600 font-medium">Loading notices from backend...</div>
            ) : (
              notices.map((n) => (
                <div key={n.id} className="p-3 bg-amber-50 border border-amber-300 rounded space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-200 text-amber-950 border border-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">{n.publish_date}</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{n.title}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
