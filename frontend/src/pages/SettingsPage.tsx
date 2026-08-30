import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [weights, setWeights] = useState({
    weight_subject: 0.25,
    weight_topic: 0.25,
    weight_credit: 0.15,
    weight_practical: 0.15,
    weight_co: 0.10,
    weight_emerging_tech: 0.10,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data.weight_subject) {
        setWeights({
          weight_subject: parseFloat(data.weight_subject),
          weight_topic: parseFloat(data.weight_topic),
          weight_credit: parseFloat(data.weight_credit),
          weight_practical: parseFloat(data.weight_practical),
          weight_co: parseFloat(data.weight_co),
          weight_emerging_tech: parseFloat(data.weight_emerging_tech),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateWeights(weights);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  const weightFields = [
    { key: 'weight_subject', label: 'Subject Title Alignment Weight', default: '0.25 (25%)' },
    { key: 'weight_topic', label: 'Topic Coverage Alignment Weight', default: '0.25 (25%)' },
    { key: 'weight_credit', label: 'Credit Structure Weight', default: '0.15 (15%)' },
    { key: 'weight_practical', label: 'Practical & Lab Component Weight', default: '0.15 (15%)' },
    { key: 'weight_co', label: 'Course Outcome (CO) Mapping Weight', default: '0.10 (10%)' },
    { key: 'weight_emerging_tech', label: 'Emerging Technology Coverage Weight', default: '0.10 (10%)' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900 font-sans">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs">
        <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">AICTE Administrative Council Settings</div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Configurable Alignment Scoring Weights</h2>
        <p className="text-xs text-slate-700 font-medium">Configure statutory weight distribution for calculating national curriculum alignment percentages</p>
      </div>

      <div className="bg-white p-6 rounded border border-slate-300 shadow-2xs space-y-5">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs p-3 rounded font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>AICTE Alignment Scoring Weights saved to database successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weightFields.map((field) => (
              <div key={field.key} className="p-3 bg-slate-50 border border-slate-300 rounded space-y-1">
                <label className="block font-semibold text-slate-900 text-xs uppercase tracking-wide">{field.label}</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={(weights as any)[field.key]}
                  onChange={(e) => setWeights({ ...weights, [field.key]: parseFloat(e.target.value) })}
                  className="w-full bg-white border border-slate-400 rounded p-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                />
                <span className="text-[11px] text-slate-600 font-medium">Default: {field.default}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-300 p-3 rounded text-xs text-slate-900 font-medium space-y-1">
            <div className="font-semibold text-slate-900">Current Total Weight:</div>
            <div className="text-sm font-semibold text-slate-900">
              {(Object.values(weights).reduce((a, b) => a + b, 0) * 100).toFixed(0)}% 
              {' '}
              <span className={Object.values(weights).reduce((a, b) => a + b, 0) === 1.0 ? 'text-slate-900' : 'text-red-950 underline'}>
                (Must sum to exactly 100%)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold text-xs px-5 py-2.5 rounded shadow-2xs flex items-center space-x-1.5 border border-amber-600 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-900" />
            <span>Update AICTE Scoring Formula in Database</span>
          </button>
        </form>
      </div>
    </div>
  );
};
