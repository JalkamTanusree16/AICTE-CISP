import React, { useState } from 'react';
import { Save, Sparkles, Plus } from 'lucide-react';

export const CurriculumBuilderPage: React.FC = () => {
  const [semester, setSemester] = useState<number>(3);
  const [courseCode, setCourseCode] = useState('PCC-CS302');
  const [title, setTitle] = useState('Object Oriented Programming & Java');
  const [credits, setCredits] = useState<number>(4.0);
  const [lectureHours, setLectureHours] = useState<number>(3);
  const [tutorialHours, setTutorialHours] = useState<number>(1);
  const [practicalHours, setPracticalHours] = useState<number>(2);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs">
        <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Interactive Academic Builder</div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Structured Course & Syllabus Builder</h2>
        <p className="text-xs text-slate-700 font-medium">Create, configure, and align hierarchical course schemes (Semesters → Courses → Units → Outcomes)</p>
      </div>

      <div className="bg-white p-6 rounded border border-slate-300 shadow-2xs space-y-5">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs p-3 rounded font-semibold">
            ✓ Course saved to active curriculum draft successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Course Identity */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">
              Course Identity & Credit Structure
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Course Code</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Course Credits</label>
                <input
                  type="number"
                  step="0.5"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Lecture Hours / Week</label>
                <input type="number" value={lectureHours} onChange={(e) => setLectureHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Tutorial Hours / Week</label>
                <input type="number" value={tutorialHours} onChange={(e) => setTutorialHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">Practical Hours / Week</label>
                <input type="number" value={practicalHours} onChange={(e) => setPracticalHours(Number(e.target.value))}
                  className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Unit Builder */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">
              Syllabus Units & Topics
            </h4>

            <div className="space-y-3">
              {[1, 2, 3].map((unitNum) => (
                <div key={unitNum} className="border border-slate-300 rounded p-4 bg-slate-50 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-semibold text-slate-900 uppercase">Unit {unitNum}</h5>
                    <span className="text-xs text-slate-600 font-medium">~8 Hours Prescribed</span>
                  </div>
                  <input
                    type="text"
                    defaultValue={
                      unitNum === 1 ? `Unit ${unitNum}: Object Oriented Paradigm & Classes` :
                      unitNum === 2 ? `Unit ${unitNum}: Inheritance, Polymorphism & Interfaces` :
                      `Unit ${unitNum}: Collections Framework & Exception Handling`
                    }
                    className="w-full bg-white border border-slate-400 rounded p-2 text-xs font-medium text-slate-900 mb-2 focus:outline-none focus:border-slate-800"
                  />
                  <textarea
                    rows={2}
                    defaultValue={
                      unitNum === 1 ? "Encapsulation, Abstraction, Classes, Objects, Constructors, Destructors, Access Modifiers." :
                      unitNum === 2 ? "Single & Multiple Inheritance, Method Overloading, Method Overriding, Abstract Classes, Interfaces." :
                      "ArrayList, LinkedList, HashMap, TreeMap, Try-Catch, Throws, Custom Exceptions, Finally Block."
                    }
                    className="w-full bg-white border border-slate-400 rounded p-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                  ></textarea>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-400 font-medium text-xs px-4 py-2 rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-slate-900" />
              <span>Add Another Unit</span>
            </button>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <button
              type="button"
              className="bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold text-xs px-4 py-2 rounded shadow-2xs flex items-center space-x-1.5 border border-amber-500 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>AI Assist: Suggest Unit Topics</span>
            </button>

            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs px-5 py-2.5 rounded shadow-2xs flex items-center space-x-1.5 border border-amber-600 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-900" />
              <span>Save Course to Draft Curriculum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
