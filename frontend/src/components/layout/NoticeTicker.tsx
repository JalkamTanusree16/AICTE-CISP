import React from 'react';
import { Bell } from 'lucide-react';

interface NoticeTickerProps {
  notices: any[];
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="bg-amber-100 border-b-2 border-amber-500 text-black text-xs py-1.5 px-4 flex items-center shadow-inner overflow-hidden font-black">
      <div className="flex items-center space-x-1.5 font-black uppercase shrink-0 bg-amber-400 text-black border border-amber-600 px-2.5 py-1 rounded text-[11px] mr-3 shadow-2xs">
        <Bell className="w-3.5 h-3.5 text-black font-bold" />
        <span>Official Circulars:</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="animate-ticker space-x-8">
          {notices.map((n, idx) => (
            <span key={idx} className="inline-flex items-center space-x-2">
              <span className="font-black text-black bg-white px-1.5 py-0.5 rounded border border-amber-400">[{n.publish_date}]</span>
              <span className="hover:underline cursor-pointer text-black font-extrabold">{n.title}</span>
              <span className="text-amber-900 font-black">•</span>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {notices.map((n, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center space-x-2">
              <span className="font-black text-black bg-white px-1.5 py-0.5 rounded border border-amber-400">[{n.publish_date}]</span>
              <span className="hover:underline cursor-pointer text-black font-extrabold">{n.title}</span>
              <span className="text-amber-900 font-black">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
