import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Plus, Trash2, Edit3, ShieldAlert } from 'lucide-react';

interface ExtractionReviewModalProps {
  documentId: number;
  filename: string;
  extractedTextPreview: string;
  extractedStructure: any;
  confidence: number;
  confidenceLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ExtractionReviewModal: React.FC<ExtractionReviewModalProps> = ({
  filename,
  extractedTextPreview,
  extractedStructure,
  confidence,
  confidenceLabel,
  onClose,
  onConfirm
}) => {
  const [courses, setCourses] = useState<any[]>(extractedStructure?.courses || []);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleTitleChange = (idx: number, newTitle: string) => {
    const updated = [...courses];
    updated[idx].title = newTitle;
    setCourses(updated);
  };

  const handleCodeChange = (idx: number, newCode: string) => {
    const updated = [...courses];
    updated[idx].code = newCode;
    setCourses(updated);
  };

  const handleDeleteCourse = (idx: number) => {
    setCourses(courses.filter((_, i) => i !== idx));
  };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now(),
        semester: 3,
        code: `PCC-CS${300 + courses.length * 10}`,
        title: "New Extracted Course Module",
        credits: 4.0,
        lecture_hours: 3,
        tutorial_hours: 1,
        practical_hours: 2,
        confidence: 1.0,
        confidence_label: "HIGH",
        source_page: 1,
        units: [
          { unit_number: 1, title: "Module Introduction", topics: "Fundamentals & Concepts", hours: 8 }
        ]
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg border-2 border-amber-500 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col text-slate-900 font-sans">
        
        {/* Header */}
        <div className="bg-amber-400 p-4 border-b border-amber-600 flex justify-between items-center shrink-0">
          <div>
            <div className="text-[11px] font-semibold text-amber-950 uppercase tracking-wider">Human Verification & Extraction Review Step</div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Verify Extracted Curriculum Structure — {filename}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-900 hover:bg-amber-500 rounded cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body: Side-by-side */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          
          {/* Left Column: Raw Document Text & Confidence Rating */}
          <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-300">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <span className="font-semibold text-slate-900 uppercase tracking-wide flex items-center space-x-1">
                <FileText className="w-4 h-4 text-slate-800" />
                <span>Extracted Document Source Text</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap ${
                confidence >= 85 ? 'bg-emerald-100 text-emerald-950 border-emerald-400' : 'bg-amber-100 text-amber-950 border-amber-400'
              }`}>
                Extraction Confidence: {confidence}% ({confidenceLabel})
              </span>
            </div>

            <div className="bg-white p-3 rounded border border-slate-300 h-[60vh] overflow-y-auto font-mono text-[11px] text-slate-900 leading-relaxed whitespace-pre-wrap shadow-inner">
              {extractedTextPreview || "No raw text extracted from document."}
            </div>
          </div>

          {/* Right Column: Interactive Course Hierarchy Review */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <span className="font-semibold text-slate-900 uppercase tracking-wide">
                Detected Course Scheme ({courses.length} Core Modules)
              </span>
              <button
                onClick={handleAddCourse}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 border border-amber-600 px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-3 h-[60vh] overflow-y-auto pr-1">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-100 text-amber-950 border border-amber-400 px-1.5 py-0.5 rounded font-mono font-medium text-[10px] whitespace-nowrap">
                          Sem {course.semester} • Source Pg {course.source_page || 1}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-950 border border-emerald-400 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                          Conf: {Math.round((course.confidence || 0.9) * 100)}%
                        </span>
                      </div>
                      
                      {editingIdx === idx ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={course.code}
                            onChange={(e) => handleCodeChange(idx, e.target.value)}
                            className="w-full bg-white border border-slate-400 rounded p-1 text-xs font-mono font-medium text-slate-900"
                          />
                          <input
                            type="text"
                            value={course.title}
                            onChange={(e) => handleTitleChange(idx, e.target.value)}
                            className="w-full bg-white border border-slate-400 rounded p-1 text-xs font-medium text-slate-900"
                          />
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-900 text-sm">{course.code}: {course.title}</div>
                      )}
                    </div>

                    <div className="flex space-x-1 shrink-0">
                      <button
                        onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                        className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-800 cursor-pointer"
                        title="Edit Course"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-800" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(idx)}
                        className="p-1 bg-white border border-red-300 rounded hover:bg-red-50 text-red-950 cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-900" />
                      </button>
                    </div>
                  </div>

                  {/* Units Breakdown */}
                  {course.units && course.units.length > 0 && (
                    <div className="space-y-1 bg-white p-2.5 rounded border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-900 uppercase">Prescribed Units:</div>
                      {course.units.map((u: any, uIdx: number) => (
                        <div key={uIdx} className="text-[11px] text-slate-800 font-medium">
                          <b className="font-semibold text-slate-900">Unit {u.unit_number}:</b> {u.title} — <i>{u.topics}</i>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-300 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-800 font-medium flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Human verification locks extracted data to ensure 100% statutory auditing accuracy.</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-400 font-medium text-xs px-4 py-2 rounded shadow-2xs cursor-pointer"
            >
              Cancel & Re-Upload
            </button>
            <button
              onClick={onConfirm}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 border border-amber-600 font-semibold text-xs px-5 py-2 rounded shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>Confirm & Lock Extracted Structure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
