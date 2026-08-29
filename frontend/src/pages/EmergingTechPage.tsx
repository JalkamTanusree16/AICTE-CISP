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
    <div className="space-y-6 text-black">
      {/* Title */}
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">National Technology Monitoring Bureau</div>
          <h2 className="text-xl font-black text-black tracking-tight">Emerging Technology Taxonomy & National Gap Heatmap</h2>
          <p className="text-xs text-black font-extrabold">Tracking institution-wise curriculum coverage for modern technical domains across India</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-4">
        <div className="flex justify-between items-center border-b-2 border-slate-300 pb-2">
          <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-1">
            <Grid className="w-4 h-4 text-black font-bold" />
            <span>National University Technology Coverage Matrix</span>
          </h3>

          <div className="flex items-center space-x-3 text-xs font-black">
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-emerald-600 rounded-full border border-emerald-800"></span> <span className="text-black">Covered (100%)</span></span>
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-amber-500 rounded-full border border-amber-800"></span> <span className="text-black">Partial (50%)</span></span>
            <span className="flex items-center space-x-1"><span className="w-3.5 h-3.5 bg-red-600 rounded-full border border-red-800"></span> <span className="text-black">Missing (0%)</span></span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-black text-black">Loading national technology heatmap...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-goi-navy text-white font-black text-[12px] uppercase">
                  <th className="p-3 border border-slate-700">Emerging Domain</th>
                  <th className="p-3 border border-slate-700">Category</th>
                  <th className="p-3 border border-slate-700 text-center">IIT Bombay</th>
                  <th className="p-3 border border-slate-700 text-center">Anna University</th>
                  <th className="p-3 border border-slate-700 text-center">VTU Belagavi</th>
                  <th className="p-3 border border-slate-700 text-center">JNTU Hyderabad</th>
                  <th className="p-3 border border-slate-700 text-center">NIT Trichy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-black text-black">
                {heatmap.map((tech) => (
                  <tr key={tech.tech_id} className="hover:bg-slate-100">
                    <td className="p-3 font-black text-black border-b border-slate-300 text-sm">{tech.tech_name}</td>
                    <td className="p-3 font-extrabold text-black border-b border-slate-300">{tech.category}</td>
                    {tech.coverage.map((c: any, idx: number) => (
                      <td key={idx} className="p-3 text-center border-b border-slate-300">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-black border-2 ${
                          c.status === 'Covered' ? 'bg-emerald-100 text-black border-emerald-600' :
                          c.status === 'Partial' ? 'bg-amber-100 text-black border-amber-600' :
                          'bg-red-100 text-black border-red-600'
                        }`}>
                          {c.status === 'Covered' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-900 font-bold" />}
                          {c.status === 'Partial' && <AlertTriangle className="w-3.5 h-3.5 text-amber-900 font-bold" />}
                          {c.status === 'Missing' && <XCircle className="w-3.5 h-3.5 text-red-900 font-bold" />}
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
