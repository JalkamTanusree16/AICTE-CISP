import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs">
        <div className="text-xs font-semibold text-amber-950 uppercase tracking-wider">Governance & Traceability System</div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">System Audit & Activity Logs</h2>
        <p className="text-xs text-slate-700 font-medium">Immutable, auditable log of administrative uploads, semantic comparisons, reviews, and publication actions</p>
      </div>

      <div className="bg-white rounded border border-slate-300 shadow-2xs overflow-hidden p-4">
        {loading ? (
          <div className="py-8 text-center text-xs font-medium text-slate-700">Loading audit log entries from database...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-slate-700">No audit log entries found. System actions will appear here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-semibold text-[12px] uppercase">
                  <th className="p-3 border border-slate-700 font-semibold">Timestamp</th>
                  <th className="p-3 border border-slate-700 font-semibold">User Email</th>
                  <th className="p-3 border border-slate-700 font-semibold">Role</th>
                  <th className="p-3 border border-slate-700 font-semibold">Action</th>
                  <th className="p-3 border border-slate-700 font-semibold">Entity</th>
                  <th className="p-3 border border-slate-700 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-900">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 text-xs">
                    <td className="p-3 font-mono text-slate-900 font-medium border-b border-slate-200">{log.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                    <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{log.user_email}</td>
                    <td className="p-3 border-b border-slate-200">
                      <span className="bg-slate-100 text-slate-900 border border-slate-300 px-2 py-0.5 rounded font-sans font-medium text-[10px] whitespace-nowrap">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{log.action}</td>
                    <td className="p-3 text-slate-800 border-b border-slate-200 font-medium">{log.entity_type} #{log.entity_id || '—'}</td>
                    <td className="p-3 font-sans text-slate-800 border-b border-slate-200 font-medium">{log.details}</td>
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
