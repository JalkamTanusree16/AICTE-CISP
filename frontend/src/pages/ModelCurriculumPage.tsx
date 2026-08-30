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
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Title */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex justify-between items-center">
        <div>
          <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">AICTE Model Curriculum Registry</div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">National Reference Standard Curricula</h2>
          <p className="text-xs text-slate-700 font-medium">Statutory Outcome-Based Education (OBE) model standards for Indian Technical Universities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Reference Standards List */}
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Published Reference Standards
          </h3>

          {loading ? (
            <div className="py-4 text-center text-xs font-medium text-slate-700">Loading reference standards...</div>
          ) : (
            <div className="space-y-2">
              {refCurricula.map((ref) => (
                <button
                  key={ref.id}
                  onClick={() => loadRefDetails(ref.id)}
                  className={`w-full text-left p-3 rounded border text-xs transition-colors flex justify-between items-center cursor-pointer ${
                    selectedRef?.id === ref.id
                      ? 'bg-amber-100 border-amber-500 text-slate-900 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-900 font-medium'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{ref.program_name}</div>
                    <div className="text-[11px] text-slate-600 font-medium">{ref.academic_year} • Version {ref.version}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-800" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Detailed Syllabus Structure */}
        <div className="bg-white p-5 rounded border border-slate-300 shadow-2xs md:col-span-2 space-y-4">
          {selectedRef ? (
            <>
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <span className="bg-emerald-100 text-emerald-950 border border-emerald-400 text-[11px] font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                    {selectedRef.status}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mt-1">{selectedRef.program_name} ({selectedRef.academic_year})</h3>
                  <p className="text-xs text-slate-700 font-medium">{selectedRef.description}</p>
                  <p className="text-xs text-slate-800 font-semibold mt-1">Authority: {selectedRef.created_by}</p>
                </div>
              </div>

              {/* Course Listing */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-1">
                  <Layers className="w-4 h-4 text-slate-800" />
                  <span>Standard Courses & Modules Breakdown ({selectedRef.courses?.length || 0} Core Courses)</span>
                </h4>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {selectedRef.courses?.map((course: any) => (
                    <div key={course.id} className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-amber-100 text-amber-950 border border-amber-400 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">
                            Semester {course.semester} • {course.course_type || 'Core'}
                          </span>
                          <div className="font-semibold text-slate-900 text-sm mt-1">{course.code}: {course.title}</div>
                        </div>
                        <div className="text-right font-semibold text-slate-900">
                          <div>{course.credits} Credits</div>
                          <div className="text-[11px] text-slate-600 font-medium">L-T-P: {course.lecture_hours}-{course.tutorial_hours}-{course.practical_hours}</div>
                        </div>
                      </div>

                      {/* Course Outcomes */}
                      {course.outcomes && course.outcomes.length > 0 && (
                        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                          <div className="font-semibold text-slate-900 text-[11px] uppercase">Course Outcomes (COs):</div>
                          {course.outcomes.map((co: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-slate-800 font-medium">
                              <b className="text-slate-900 font-semibold">{co.co_code}:</b> {co.description}
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
            <div className="py-8 text-center text-xs font-medium text-slate-700">Select a reference model curriculum to inspect structure.</div>
          )}
        </div>
      </div>
    </div>
  );
};
