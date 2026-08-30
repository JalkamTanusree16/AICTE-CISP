import React from 'react';

export const CoPoMappingPage: React.FC = () => {
  const coPoData = [
    { co: 'CO1: Understand core data structures & complexity analysis', po1: 3, po2: 3, po3: 2, po4: 1, po5: 2 },
    { co: 'CO2: Implement linear & hierarchical data structures in C++', po1: 3, po2: 3, po3: 3, po4: 2, po5: 2 },
    { co: 'CO3: Evaluate graph algorithms for real-world networks', po1: 2, po2: 3, po3: 3, po4: 3, po5: 2 },
    { co: 'CO4: Design efficient searching & sorting algorithms', po1: 3, po2: 2, po3: 2, po4: 1, po5: 1 },
  ];

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Outcome-Based Education (OBE) Standard</div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Course Outcome (CO) to Program Outcome (PO) Matrix</h2>
          <p className="text-xs text-slate-700 font-medium">Mapping course learning outcomes to AICTE Program Outcomes (PO1-PO12)</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs space-y-4">
        <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
          <h3 className="text-xs font-semibold text-slate-900 uppercase">
            Course: Data Structures & Algorithms (PCC-CS301)
          </h3>
          <span className="text-xs text-slate-600 font-medium">Mapping Scale: 1 (Substantial), 2 (Moderate), 3 (High)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold text-[12px] uppercase">
                <th className="p-3 border border-slate-700 font-semibold">Course Outcome (CO)</th>
                <th className="p-3 border border-slate-700 text-center font-semibold">PO1 (Engineering Knowledge)</th>
                <th className="p-3 border border-slate-700 text-center font-semibold">PO2 (Problem Analysis)</th>
                <th className="p-3 border border-slate-700 text-center font-semibold">PO3 (Design / Development)</th>
                <th className="p-3 border border-slate-700 text-center font-semibold">PO4 (Complex Investigations)</th>
                <th className="p-3 border border-slate-700 text-center font-semibold">PO5 (Modern Tool Usage)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-normal text-slate-900">
              {coPoData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{row.co}</td>
                  <td className="p-3 text-center font-semibold text-slate-900 bg-blue-50 border-b border-slate-200 text-sm">{row.po1}</td>
                  <td className="p-3 text-center font-semibold text-slate-900 bg-blue-50 border-b border-slate-200 text-sm">{row.po2}</td>
                  <td className="p-3 text-center font-semibold text-slate-900 bg-blue-50 border-b border-slate-200 text-sm">{row.po3}</td>
                  <td className="p-3 text-center font-semibold text-slate-900 bg-blue-50 border-b border-slate-200 text-sm">{row.po4}</td>
                  <td className="p-3 text-center font-semibold text-slate-900 bg-blue-50 border-b border-slate-200 text-sm">{row.po5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
