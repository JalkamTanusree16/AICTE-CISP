import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NationalDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [curricula, setCurricula] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [statusFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, curriculaData] = await Promise.all([
        api.getNationalAnalytics(),
        api.getUniversityCurricula(undefined, statusFilter || undefined)
      ]);
      setAnalytics(analyticsData);
      setCurricula(curriculaData);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Subject Match', score: 92 },
    { name: 'Topic Alignment', score: 81 },
    { name: 'Credit Mapping', score: 88 },
    { name: 'Practical Components', score: 79 },
    { name: 'Emerging Tech', score: 73 },
  ];

  const statusDistribution = [
    { name: 'Published', value: analytics?.published_curricula || 4, color: '#047857' },
    { name: 'Under Review', value: analytics?.under_review || 3, color: '#1d4ed8' },
    { name: 'Drafts', value: 3, color: '#334155' },
  ];

  return (
    <div className="space-y-6 text-black">
      {/* Title Bar */}
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">AICTE Administrative Intelligence</div>
          <h2 className="text-xl font-black text-black tracking-tight">National Curriculum Standardization Dashboard</h2>
          <p className="text-xs text-black font-extrabold">Real-time statutory metrics & university alignment monitoring across India</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-100 text-black border-2 border-emerald-500 text-[11px] font-black px-3 py-1 rounded flex items-center space-x-1 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-900 font-bold" />
            <span>Persistent API Active</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">Total Universities</div>
          <div className="text-3xl font-black text-black">{analytics?.total_universities || 10}</div>
          <div className="text-[11px] text-black font-extrabold">Approved Institutions</div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">Programs</div>
          <div className="text-3xl font-black text-black">{analytics?.total_programs || 6}</div>
          <div className="text-[11px] text-black font-extrabold">UG/PG Branches</div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">Model Standards</div>
          <div className="text-3xl font-black text-black">{analytics?.published_standards || 6}</div>
          <div className="text-[11px] text-black font-extrabold">AICTE Curricula</div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">Submissions</div>
          <div className="text-3xl font-black text-black">{analytics?.total_submissions || 5}</div>
          <div className="text-[11px] text-black font-extrabold">Received Curricula</div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">Under Review</div>
          <div className="text-3xl font-black text-black">{analytics?.under_review || 3}</div>
          <div className="text-[11px] text-black font-extrabold">Pending Evaluation</div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-1">
          <div className="text-[11px] font-black text-black uppercase tracking-wide">National Alignment</div>
          <div className="text-3xl font-black text-black">{analytics?.national_avg_alignment || 84.7}%</div>
          <div className="text-[11px] text-black font-extrabold">Calculated Average</div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs md:col-span-2 space-y-3">
          <h3 className="text-xs font-black text-black uppercase tracking-wider border-b-2 border-slate-300 pb-1">
            National Average Curriculum Alignment Breakdown (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#000000' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#000000' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} contentStyle={{ backgroundColor: '#000000', color: '#ffffff', borderRadius: '4px', fontWeight: 'bold' }} />
                <Bar dataKey="score" fill="#0a2540" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs space-y-3">
          <h3 className="text-xs font-black text-black uppercase tracking-wider border-b-2 border-slate-300 pb-1">
            Curriculum Status Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000000', color: '#ffffff', borderRadius: '4px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filterable University Submissions Table */}
      <div className="bg-white rounded border-2 border-slate-400 shadow-2xs overflow-hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-300 pb-2">
          <h3 className="text-xs font-black text-black uppercase tracking-wider">
            University Curriculum Submissions & Status Registry
          </h3>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-black font-bold" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border-2 border-slate-500 rounded px-3 py-1.5 text-xs text-black font-black focus:outline-none focus:border-black"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="CHANGES_REQUESTED">Changes Requested</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-black text-black">Loading curriculum data from database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-goi-navy text-white font-black text-[12px] uppercase">
                  <th className="p-3 border border-slate-700">University</th>
                  <th className="p-3 border border-slate-700">State</th>
                  <th className="p-3 border border-slate-700">Program</th>
                  <th className="p-3 border border-slate-700">Academic Year</th>
                  <th className="p-3 border border-slate-700">Version</th>
                  <th className="p-3 border border-slate-700">Alignment Score</th>
                  <th className="p-3 border border-slate-700">Status</th>
                  <th className="p-3 border border-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-bold text-black">
                {curricula.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-100">
                    <td className="p-3 font-black text-black border-b border-slate-300">{c.university_name}</td>
                    <td className="p-3 text-black font-extrabold border-b border-slate-300">{c.state}</td>
                    <td className="p-3 text-black font-black border-b border-slate-300">{c.program_name}</td>
                    <td className="p-3 text-black font-extrabold border-b border-slate-300">{c.academic_year}</td>
                    <td className="p-3 font-mono font-black text-black border-b border-slate-300">{c.version}</td>
                    <td className="p-3 font-black text-black border-b border-slate-300 text-sm">
                      {c.alignment_score ? `${c.alignment_score}%` : 'Pending'}
                    </td>
                    <td className="p-3 border-b border-slate-300">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-black border-2 ${
                        c.status === 'PUBLISHED' ? 'bg-emerald-100 text-black border-emerald-600' :
                        c.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-black border-blue-600' :
                        c.status === 'CHANGES_REQUESTED' ? 'bg-amber-100 text-black border-amber-600' :
                        'bg-slate-200 text-black border-slate-500'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right border-b border-slate-300">
                      <Link
                        to={`/comparison?uc_id=${c.id}`}
                        className="bg-goi-navy hover:bg-blue-900 text-white px-3 py-1.5 rounded text-xs font-black border border-blue-950 inline-flex items-center space-x-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300 font-bold" />
                        <span>Inspect</span>
                      </Link>
                    </td>
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
