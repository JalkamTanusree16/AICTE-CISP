import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ChevronRight, Layers } from 'lucide-react';

export const ModelCurriculumPage: React.FC = () => {
  const [refCurricula, setRefCurricula] = useState<any[]>([]);
  const [selectedRef, setSelectedRef] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferenceCurricula();
  }, []);

  const loadReferenceCurricula = async () => {
    setLoading(true);
    try {
      const data = await api.getReferenceCurricula();
      setRefCurricula(data);
      if (data.length > 0) {
        loadRefDetails(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRefDetails = async (id: number) => {
    try {
      const details = await api.getReferenceCurriculumById(id);
      setSelectedRef(details);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-black">
      {/* Title */}
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">AICTE Model Curriculum Registry</div>
          <h2 className="text-xl font-black text-black tracking-tight">National Reference Standard Curricula</h2>
          <p className="text-xs text-black font-extrabold">Statutory Outcome-Based Education (OBE) model standards for Indian Technical Universities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Reference Standards List */}
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-black uppercase tracking-wider border-b-2 border-slate-300 pb-1">
            Published Reference Standards
          </h3>

          {loading ? (
            <div className="py-4 text-center text-xs font-black text-black">Loading reference standards...</div>
          ) : (
            <div className="space-y-2">
              {refCurricula.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => loadRefDetails(ref.id)}
                  className={`w-full text-left p-3 rounded border-2 text-xs transition-colors flex justify-between items-center cursor-pointer ${
                    selectedRef?.id === ref.id
                      ? 'bg-amber-100 border-amber-600 text-black font-black shadow-2xs'
                      : 'bg-slate-50 border-slate-400 hover:bg-slate-100 text-black font-extrabold'
                  }`}
                >
                  <div>
                    <div className="font-black text-sm text-black">{ref.program_name}</div>
                    <div className="text-[11px] text-black font-extrabold">{ref.academic_year} • Version {ref.version}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-black font-black" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Detailed Syllabus Structure */}
        <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs md:col-span-2 space-y-4">
          {selectedRef ? (
            <>
              <div className="border-b-2 border-slate-300 pb-3 flex justify-between items-start">
                <div>
                  <span className="bg-emerald-100 text-black border-2 border-emerald-500 text-[11px] font-black px-2.5 py-0.5 rounded">
                    {selectedRef.status}
                  </span>
                  <h3 className="text-xl font-black text-black mt-1">{selectedRef.program_name} ({selectedRef.academic_year})</h3>
                  <p className="text-xs text-black font-extrabold">{selectedRef.description}</p>
                  <p className="text-xs text-black font-black mt-1">Authority: {selectedRef.created_by}</p>
                </div>
              </div>

              {/* Course Listing */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-1">
                  <Layers className="w-4 h-4 text-black font-bold" />
                  <span>Standard Courses & Modules Breakdown ({selectedRef.courses?.length || 0} Core Courses)</span>
                </h4>

                <div className="space-y-3">
                  {selectedRef.courses?.map((course: any) => (
                    <div key={course.id} className="bg-slate-50 border-2 border-slate-400 rounded p-3 text-xs space-y-2">
                      <div className="flex justify-between items-center font-black text-black border-b border-slate-300 pb-1">
                        <div>
                          <span className="bg-amber-200 text-black border border-amber-500 text-[10px] px-2 py-0.5 rounded font-mono font-bold mr-2">
                            Sem {course.semester} • {course.code}
                          </span>
                          <span className="text-sm font-black text-black">{course.title}</span>
                        </div>
                        <div className="text-black font-black text-[11px]">
                          {course.credits} Credits ({course.lecture_hours}L-{course.tutorial_hours}T-{course.practical_hours}P)
                        </div>
                      </div>

                      {/* Units */}
                      {course.units && course.units.length > 0 && (
                        <div className="space-y-1.5 pl-2">
                          <div className="text-xs font-black text-black uppercase">Prescribed Units:</div>
                          {course.units.map((unit: any, idx: number) => (
                            <div key={idx} className="bg-white p-2.5 rounded border border-slate-400 text-xs space-y-0.5 shadow-2xs">
                              <div className="font-black text-black">Unit {unit.unit_number}: {unit.title} ({unit.hours} Hours)</div>
                              <div className="text-black font-extrabold leading-normal"><b>Topics:</b> {unit.topics}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs font-black text-black">Select a reference curriculum standard to inspect detailed modules.</div>
          )}
        </div>
      </div>
    </div>
  );
};
