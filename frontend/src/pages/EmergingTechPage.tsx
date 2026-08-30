import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertTriangle, XCircle, Grid } from 'lucide-react';

export const EmergingTechPage: React.FC = () => {
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatmap();
  }, []);

  const loadHeatmap = async () => {
    setLoading(true);
    try {
      const data = await api.getEmergingTechHeatmap();
      setHeatmap(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Title */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">National Technology Monitoring Bureau</div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Emerging Technology Taxonomy & National Gap Heatmap</h2>
          <p className="text-xs text-slate-700 font-medium">Tracking institution-wise curriculum coverage for modern technical domains across India</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-1">
            <Grid className="w-4 h-4 text-slate-800" />
            <span>National University Technology Coverage Matrix</span>
          </h3>

          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border border-emerald-700"></span> <span className="text-slate-900">Covered (100%)</span></span>
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-amber-400 rounded-full border border-amber-600"></span> <span className="text-slate-900">Partial (50%)</span></span>
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-700"></span> <span className="text-slate-900">Missing (0%)</span></span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-medium text-slate-700">Loading national technology heatmap...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-semibold text-[12px] uppercase">
                  <th className="p-3 border border-slate-700 font-semibold">Emerging Domain</th>
                  <th className="p-3 border border-slate-700 font-semibold">Category</th>
                  <th className="p-3 border border-slate-700 text-center font-semibold">IIT Bombay</th>
                  <th className="p-3 border border-slate-700 text-center font-semibold">Anna University</th>
                  <th className="p-3 border border-slate-700 text-center font-semibold">VTU Belagavi</th>
                  <th className="p-3 border border-slate-700 text-center font-semibold">JNTU Hyderabad</th>
                  <th className="p-3 border border-slate-700 text-center font-semibold">NIT Trichy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-900">
                {heatmap.map((tech) => (
                  <tr key={tech.tech_id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 border-b border-slate-200 text-sm">{tech.tech_name}</td>
                    <td className="p-3 font-medium text-slate-600 border-b border-slate-200">{tech.category}</td>
                    {tech.coverage.map((c: any, idx: number) => (
                      <td key={idx} className="p-3 text-center border-b border-slate-200">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-semibold border whitespace-nowrap ${
                          c.status === 'Covered' ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                          c.status === 'Partial' ? 'bg-amber-100 text-amber-950 border-amber-400' :
                          'bg-red-100 text-red-950 border-red-400'
                        }`}>
                          {c.status === 'Covered' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                          {c.status === 'Partial' && <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />}
                          {c.status === 'Missing' && <XCircle className="w-3.5 h-3.5 text-red-800" />}
                          <span>{c.status}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
