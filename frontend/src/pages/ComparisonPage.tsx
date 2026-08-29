import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { GitCompare, Download, FileSpreadsheet, ShieldAlert, Layers, Cpu } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ucIdParam = searchParams.get('uc_id') || '1';
  const ucId = parseInt(ucIdParam, 10);

  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadComparisonData();
  }, [ucId]);

  const loadComparisonData = async () => {
    setLoading(true);
    try {
      const data = await api.getComparison(ucId);
      setComparison(data);
    } catch (err) {
      console.log("No comparison existing yet, will allow running comparison.");
      setComparison(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRunComparison = async () => {
    setRunning(true);
    try {
      const data = await api.runComparison(ucId, 1);
      setComparison(data);
      setMessage("Semantic NLP vector similarity engine executed successfully against AICTE Reference Standard.");
    } catch (err: any) {
      setMessage(`Comparison failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    try {
      await api.submitCurriculum(ucId);
      setMessage("Curriculum successfully submitted to AICTE National Review Queue!");
    } catch (err: any) {
      setMessage(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-black">
      {/* Title Bar */}
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">Semantic Vector Alignment Engine</div>
          <h2 className="text-xl font-black text-black tracking-tight">Institutional vs AICTE Model Curriculum Comparison</h2>
          <p className="text-xs text-black font-extrabold">Vector cosine similarity & evidence-based gap identification for B.Tech Computer Science & Engineering</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunComparison}
            disabled={running}
            className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-4 py-2 rounded shadow-2xs flex items-center space-x-1.5 transition-colors border border-amber-600 disabled:opacity-50 cursor-pointer"
          >
            <GitCompare className="w-4 h-4 font-bold text-black" />
            <span>{running ? 'Calculating Vectors...' : 'Run Backend Comparison'}</span>
          </button>

          {comparison && (
            <>
              <a
                href={api.getPdfReportUrl(ucId)}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-300 hover:bg-amber-400 text-black font-black text-xs px-3 py-2 rounded shadow-2xs flex items-center space-x-1.5 border border-amber-500"
              >
                <Download className="w-4 h-4 text-black font-bold" />
                <span>Export PDF</span>
              </a>
              <a
                href={api.getExcelReportUrl(ucId)}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-300 hover:bg-emerald-400 text-black font-black text-xs px-3 py-2 rounded shadow-2xs flex items-center space-x-1.5 border border-emerald-500"
              >
                <FileSpreadsheet className="w-4 h-4 text-black font-bold" />
                <span>Export Excel</span>
              </a>
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-blue-100 border-2 border-blue-400 text-black text-xs p-3 rounded flex items-center justify-between font-black shadow-2xs">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-black underline font-black text-xs">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs font-black text-black">Fetching semantic comparison matrix from database...</div>
      ) : comparison ? (
        <>
          {/* Alignment Score Summary Card */}
          <div className="bg-white p-5 rounded border-2 border-slate-400 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b-2 border-slate-300 pb-3 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-black uppercase tracking-wider">Dynamically Calculated Overall Alignment</span>
                  <span className="bg-purple-200 text-black border border-purple-400 text-[10px] font-black px-2 py-0.5 rounded flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-black font-bold" />
                    <span>ML Engine: {comparison.embedding_engine || "SentenceTransformer"}</span>
                  </span>
                </div>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-4xl font-black text-black">{comparison.overall_score}%</span>
                  <span className="text-xs font-black text-black bg-emerald-200 border-2 border-emerald-500 px-2.5 py-0.5 rounded">
                    High Statutory Alignment
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-5 py-2.5 rounded shadow-2xs flex items-center space-x-2 border border-amber-600 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-black font-bold" />
                <span>{submitting ? 'Submitting...' : 'Submit to AICTE Review Queue'}</span>
              </button>
            </div>

            {/* Sub-scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-1">
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">Subject Match (25%)</div>
                <div className="text-2xl font-black text-black">{comparison.subject_score}%</div>
              </div>
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">Topic Coverage (25%)</div>
                <div className="text-2xl font-black text-black">{comparison.topic_score}%</div>
              </div>
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">Credits (15%)</div>
                <div className="text-2xl font-black text-black">{comparison.credit_score}%</div>
              </div>
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">Practicals (15%)</div>
                <div className="text-2xl font-black text-black">{comparison.practical_score}%</div>
              </div>
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">CO Outcomes (10%)</div>
                <div className="text-2xl font-black text-black">{comparison.co_score}%</div>
              </div>
              <div className="bg-slate-100 p-3 rounded border-2 border-slate-400 text-center">
                <div className="text-[11px] font-black text-black uppercase">Emerging Tech (10%)</div>
                <div className="text-2xl font-black text-black">{comparison.emerging_tech_score}%</div>
              </div>
            </div>
          </div>

          {/* Explainable Comparison Table */}
          <div className="bg-white rounded border-2 border-slate-400 shadow-2xs overflow-hidden p-4 space-y-3">
            <div className="flex justify-between items-center border-b-2 border-slate-300 pb-2">
              <h3 className="text-xs font-black text-black uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-4 h-4 text-black font-bold" />
                <span>Side-by-Side Itemized Mapping & Gap Evidence Matrix</span>
              </h3>
              <span className="text-xs text-black font-black italic">Engine: {comparison.embedding_engine || "SentenceTransformer (all-MiniLM-L6-v2)"}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-goi-navy text-white font-black text-[12px] uppercase">
                    <th className="p-3 border border-slate-700">AICTE Reference Course</th>
                    <th className="p-3 border border-slate-700">University Course</th>
                    <th className="p-3 border border-slate-700 text-center">Similarity</th>
                    <th className="p-3 border border-slate-700">Classification</th>
                    <th className="p-3 border border-slate-700">Evidence / Gap Analysis</th>
                    <th className="p-3 border border-slate-700">AI Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-bold text-black">
                  {comparison.items?.map((item: any) => (
                    <tr key={item.id} className={item.status === 'Missing' ? 'bg-amber-100/60' : 'hover:bg-slate-100'}>
                      <td className="p-3 font-black text-black border-b border-slate-300">
                        <div className="text-sm">{item.ref_course_title}</div>
                        <div className="text-[11px] text-black font-extrabold">{item.ref_topic}</div>
                      </td>

                      <td className="p-3 font-black text-black border-b border-slate-300">
                        <div className="text-sm">{item.uni_course_title}</div>
                        <div className="text-[11px] text-black font-extrabold">{item.uni_topic}</div>
                      </td>

                      <td className="p-3 text-center font-black font-mono text-black border-b border-slate-300 text-sm">
                        {Math.round(item.similarity_score * 100)}%
                      </td>

                      <td className="p-3 border-b border-slate-300">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-black border-2 ${
                          item.status === 'Matched' ? 'bg-emerald-200 text-black border-emerald-600' :
                          item.status === 'Partial Match' ? 'bg-amber-200 text-black border-amber-600' :
                          item.status === 'Missing' ? 'bg-red-200 text-black border-red-600' :
                          'bg-slate-200 text-black border-slate-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3 text-black border-b border-slate-300">
                        <div className="text-[11px] font-black text-black">{item.evidence_location}</div>
                        {item.gap_description && (
                          <div className="text-[11px] text-black font-black mt-1 bg-red-100 p-1.5 rounded border-2 border-red-400">
                            Gap: {item.gap_description}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-black border-b border-slate-300">
                        {item.recommendation ? (
                          <div className="bg-amber-100 p-2 rounded border-2 border-amber-400 text-[11px] text-black font-black">
                            💡 {item.recommendation}
                          </div>
                        ) : (
                          <span className="text-[11px] text-black font-black bg-emerald-200 px-2 py-0.5 rounded border-2 border-emerald-500">
                            Fully Aligned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded border-2 border-slate-400 shadow-2xs text-center space-y-4">
          <GitCompare className="w-12 h-12 text-black mx-auto font-bold" />
          <h3 className="text-base font-black text-black">No Active Semantic Comparison Computed</h3>
          <p className="text-xs text-black font-black max-w-md mx-auto">
            Click the button below to trigger the backend NLP vector similarity engine against the AICTE CSE 2027–28 Reference Standard.
          </p>
          <button
            onClick={handleRunComparison}
            className="bg-amber-400 hover:bg-amber-500 text-black font-black text-xs px-5 py-2.5 rounded shadow-xs inline-flex items-center space-x-2 border border-amber-600 cursor-pointer"
          >
            <GitCompare className="w-4 h-4 text-black font-bold" />
            <span>Run Semantic Comparison Engine Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
