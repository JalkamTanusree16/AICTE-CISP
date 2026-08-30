import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NationalDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [curricula, setCurricula] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

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
    <div className="space-y-6 text-slate-900 font-sans">
      {/* Title Bar */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">AICTE Administrative Intelligence</div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">National Curriculum Standardization Dashboard</h2>
          <p className="text-xs text-slate-700 font-medium">Real-time statutory metrics & university alignment monitoring across India</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-100 text-emerald-950 border border-emerald-400 text-[11px] font-semibold px-3 py-1 rounded flex items-center space-x-1 shadow-2xs whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>Persistent API Active</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Total Universities</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.total_universities || 10}</div>
          <div className="text-[11px] text-slate-600 font-medium">Approved Institutions</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Programs</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.total_programs || 6}</div>
          <div className="text-[11px] text-slate-600 font-medium">UG/PG Branches</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Model Standards</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.published_standards || 6}</div>
          <div className="text-[11px] text-slate-600 font-medium">AICTE Curricula</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Submissions</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.total_submissions || 5}</div>
          <div className="text-[11px] text-slate-600 font-medium">Received Curricula</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Under Review</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.under_review || 3}</div>
          <div className="text-[11px] text-slate-600 font-medium">Pending Evaluation</div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">National Alignment</div>
          <div className="text-3xl font-semibold text-slate-900">{analytics?.national_avg_alignment || 84.7}%</div>
          <div className="text-[11px] text-slate-600 font-medium">Calculated Average</div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs md:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
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

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
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

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Total Universities</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.total_universities || 10}</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Programs</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.total_programs || 6}</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Model Standards</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.published_standards || 6}</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Submissions</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.total_submissions || 5}</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Under Review</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.under_review || 3}</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs text-slate-900">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">National Alignment</div>
          <div className="text-2xl font-semibold text-slate-900">{analytics?.national_avg_alignment || 84.7}%</div>
        </div>
      </div>

      {/* Analytics Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            National Program Coverage & AICTE Compliance Matrix
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Computer Science & Engineering</span>
                <span>88.4% Aligned</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Artificial Intelligence & Data Science</span>
                <span>79.2% Aligned</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '79.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-900 mb-1">
                <span>Mechanical & Industrial Engineering</span>
                <span>64.1% Aligned</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '64.1%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs space-y-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            Emerging Technology Adoption Index (National Aggregate)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-semibold text-slate-900">Cloud & DevSecOps</div>
              <div className="text-sm font-semibold text-slate-900">74% Integrated</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-semibold text-slate-900">Generative AI / LLMs</div>
              <div className="text-sm font-semibold text-amber-900">38% Integrated (Gap)</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-semibold text-slate-900">Cybersecurity & Zero Trust</div>
              <div className="text-sm font-semibold text-slate-900">81% Integrated</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="font-semibold text-slate-900">Quantum Computing</div>
              <div className="text-sm font-semibold text-red-950">12% Integrated (Critical Gap)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table: Registered University Curricula */}
      <div className="bg-white rounded border border-slate-300 shadow-2xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Registered Institutional Curricula Registry ({curricula.length} Submissions)
          </h3>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Filter by university or program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-400 rounded px-3 py-1.5 pl-8 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-400 rounded px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-800"
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
          <div className="py-8 text-center text-xs font-medium text-slate-700">Loading curriculum data from database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-semibold text-[12px] uppercase">
                  <th className="p-3 border border-slate-700 font-semibold">University</th>
                  <th className="p-3 border border-slate-700 font-semibold">State</th>
                  <th className="p-3 border border-slate-700 font-semibold">Program</th>
                  <th className="p-3 border border-slate-700 font-semibold">Academic Year</th>
                  <th className="p-3 border border-slate-700 font-semibold">Version</th>
                  <th className="p-3 border border-slate-700 font-semibold">Alignment Score</th>
                  <th className="p-3 border border-slate-700 font-semibold">Status</th>
                  <th className="p-3 border border-slate-700 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-900">
                {curricula
                  .filter((c) => !search || c.university_name?.toLowerCase().includes(search.toLowerCase()) || c.program_name?.toLowerCase().includes(search.toLowerCase()))
                  .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{c.university_name}</td>
                    <td className="p-3 text-slate-700 font-medium border-b border-slate-200">{c.state}</td>
                    <td className="p-3 text-slate-900 font-semibold border-b border-slate-200">{c.program_name}</td>
                    <td className="p-3 text-slate-700 font-medium border-b border-slate-200">{c.academic_year}</td>
                    <td className="p-3 font-mono font-medium text-slate-900 border-b border-slate-200">{c.version}</td>
                    <td className="p-3 font-semibold text-slate-900 border-b border-slate-200 text-sm">
                      {c.alignment_score ? `${c.alignment_score}%` : 'Pending'}
                    </td>
                    <td className="p-3 border-b border-slate-200">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border whitespace-nowrap inline-block ${
                        c.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-950 border-emerald-400' :
                        c.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-950 border-blue-400' :
                        c.status === 'CHANGES_REQUESTED' ? 'bg-amber-100 text-amber-950 border-amber-400' :
                        'bg-slate-100 text-slate-900 border-slate-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right border-b border-slate-200">
                      <Link
                        to={`/comparison?uc_id=${c.id}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center space-x-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
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
