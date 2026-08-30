import React from 'react';
import { Bell } from 'lucide-react';

interface NoticeTickerProps {
  notices: any[];
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-300 text-slate-900 text-xs py-1.5 px-4 flex items-center overflow-hidden font-medium">
      <div className="flex items-center space-x-1.5 font-semibold uppercase shrink-0 bg-amber-400 text-slate-900 border border-amber-600 px-2.5 py-1 rounded text-[11px] mr-3 shadow-2xs">
        <Bell className="w-3.5 h-3.5 text-slate-900" />
        <span>Official Circulars:</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="animate-ticker space-x-8">
          {notices.map((n, idx) => (
            <span key={idx} className="inline-flex items-center space-x-2">
              <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-amber-300">[{n.publish_date}]</span>
              <span className="hover:underline cursor-pointer text-slate-900 font-medium">{n.title}</span>
              <span className="text-amber-800 font-semibold">•</span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {notices.map((n, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center space-x-2">
              <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-amber-300">[{n.publish_date}]</span>
              <span className="hover:underline cursor-pointer text-slate-900 font-medium">{n.title}</span>
              <span className="text-amber-800 font-semibold">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
