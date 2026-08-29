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
    <div className="space-y-6 text-black">
      <div className="bg-white p-4 rounded border-2 border-slate-400 shadow-2xs">
        <div className="text-xs font-black text-amber-900 uppercase tracking-wider">Governance & Traceability System</div>
        <h2 className="text-xl font-black text-black tracking-tight">System Audit & Activity Logs</h2>
        <p className="text-xs text-black font-extrabold">Immutable, auditable log of administrative uploads, semantic comparisons, reviews, and publication actions</p>
      </div>

      <div className="bg-white rounded border-2 border-slate-400 shadow-2xs overflow-hidden p-4">
        {loading ? (
          <div className="py-8 text-center text-xs font-black text-black">Loading audit log entries from database...</div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs font-black text-black">No audit log entries found. System actions will appear here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-goi-navy text-white font-black text-[12px] uppercase">
                  <th className="p-3 border border-slate-700">Timestamp</th>
                  <th className="p-3 border border-slate-700">User Email</th>
                  <th className="p-3 border border-slate-700">Role</th>
                  <th className="p-3 border border-slate-700">Action</th>
                  <th className="p-3 border border-slate-700">Entity</th>
                  <th className="p-3 border border-slate-700">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-bold text-black">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-100 font-mono text-xs">
                    <td className="p-3 text-black font-black border-b border-slate-300">{log.timestamp?.replace('T', ' ').slice(0, 19)}</td>
                    <td className="p-3 font-black text-black border-b border-slate-300">{log.user_email}</td>
                    <td className="p-3 border-b border-slate-300">
                      <span className="bg-slate-200 text-black border-2 border-slate-400 px-2 py-0.5 rounded font-sans font-black text-[10px]">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="p-3 font-black text-black border-b border-slate-300">{log.action}</td>
                    <td className="p-3 text-black border-b border-slate-300 font-extrabold">{log.entity_type} #{log.entity_id || '—'}</td>
                    <td className="p-3 font-sans text-black border-b border-slate-300 font-extrabold">{log.details}</td>
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
