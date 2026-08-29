import React from 'react';

export const CoPoMappingPage: React.FC = () => {
  const coPoData = [
    { co: 'CO1: Understand core data structures & complexity analysis', po1: 3, po2: 3, po3: 2, po4: 1, po5: 2 },
    { co: 'CO2: Implement linear & hierarchical data structures in C++', po1: 3, po2: 3, po3: 3, po4: 2, po5: 2 },
    { co: 'CO3: Evaluate graph algorithms for real-world networks', po1: 2, po2: 3, po3: 3, po4: 3, po5: 2 },
    { co: 'CO4: Design efficient searching & sorting algorithms', po1: 3, po2: 2, po3: 2, po4: 1, po5: 1 },
  ];

  return (
    <div className="space-y-6 text-black">
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">Outcome-Based Education (OBE) Standard</div>
          <h2 className="text-xl font-black text-black tracking-tight">Course Outcome (CO) to Program Outcome (PO) Matrix</h2>
          <p className="text-xs text-black font-extrabold">Mapping course learning outcomes to AICTE Program Outcomes (PO1-PO12)</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-4">
        <div className="border-b-2 border-slate-300 pb-2 flex justify-between items-center">
          <h3 className="text-xs font-black text-black uppercase">
            Course: Data Structures & Algorithms (PCC-CS301)
          </h3>
          <span className="text-xs text-black font-black">Mapping Scale: 1 (Substantial), 2 (Moderate), 3 (High)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-goi-navy text-white font-black text-[12px] uppercase">
                <th className="p-3 border border-slate-700">Course Outcome (CO)</th>
                <th className="p-3 border border-slate-700 text-center">PO1 (Engineering Knowledge)</th>
                <th className="p-3 border border-slate-700 text-center">PO2 (Problem Analysis)</th>
                <th className="p-3 border border-slate-700 text-center">PO3 (Design / Development)</th>
                <th className="p-3 border border-slate-700 text-center">PO4 (Complex Investigations)</th>
                <th className="p-3 border border-slate-700 text-center">PO5 (Modern Tool Usage)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-black text-black">
              {coPoData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-100">
                  <td className="p-3 font-black text-black border-b border-slate-300">{row.co}</td>
                  <td className="p-3 text-center font-black text-black bg-blue-100/70 border-b border-slate-300 text-sm">{row.po1}</td>
                  <td className="p-3 text-center font-black text-black bg-blue-100/70 border-b border-slate-300 text-sm">{row.po2}</td>
                  <td className="p-3 text-center font-black text-black bg-blue-100/70 border-b border-slate-300 text-sm">{row.po3}</td>
                  <td className="p-3 text-center font-black text-black bg-blue-100/70 border-b border-slate-300 text-sm">{row.po4}</td>
                  <td className="p-3 text-center font-black text-black bg-blue-100/70 border-b border-slate-300 text-sm">{row.po5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
