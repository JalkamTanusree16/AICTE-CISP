import React, { useEffect, useState } from 'react';
import { Eye, Globe, Type, Activity } from 'lucide-react';
import { api } from '../../services/api';

export const GoiTopBar: React.FC = () => {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    api.getSystemStatus()
      .then(setSystemStatus)
      .catch(() => setSystemStatus({ backend: "offline", embedding_model: "Disconnected" }));
  }, []);

  const changeFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    document.documentElement.className = document.documentElement.className
      .replace(/font-(sm|md|lg)/g, '') + ` font-${size}`;
  };

  const toggleContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <div className="bg-slate-200 text-black text-xs border-b-2 border-slate-400 select-none font-black">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        {/* GOI Emblem Representation & Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-3.5 w-6 rounded-xs overflow-hidden border border-slate-500">
            <div className="w-1/3 bg-[#ff9933]"></div>
            <div className="w-1/3 bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full border border-blue-900"></div>
            </div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>
          <span className="font-black tracking-wide text-black uppercase">
            Government of India • All India Council for Technical Education (AICTE)
          </span>
          {systemStatus && (
            <span className="hidden xl:inline-flex items-center space-x-1 bg-white px-2 py-0.5 rounded border border-slate-400 text-[10px]">
              <Activity className="w-3 h-3 text-emerald-700 font-bold" />
              <span>Backend: {systemStatus.backend?.toUpperCase()} | ML: {systemStatus.embedding_model}</span>
            </span>
          )}
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center space-x-4">
          <a href="#main-content" className="text-[#003366] hover:underline font-black hidden md:inline">
            Skip to main content
          </a>

          {/* Font Controls */}
          <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded border-2 border-slate-400">
            <Type className="w-3.5 h-3.5 text-black mr-1 font-bold" />
            <button
              onClick={() => changeFontSize('sm')}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${fontSize === 'sm' ? 'bg-amber-400 text-black font-black' : 'hover:bg-slate-200 text-black font-black'}`}
              title="Small font size"
            >
              A-
            </button>
            <button
              onClick={() => changeFontSize('md')}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${fontSize === 'md' ? 'bg-amber-400 text-black font-black' : 'hover:bg-slate-200 text-black font-black'}`}
              title="Normal font size"
            >
              A
            </button>
            <button
              onClick={() => changeFontSize('lg')}
              className={`px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${fontSize === 'lg' ? 'bg-amber-400 text-black font-black' : 'hover:bg-slate-200 text-black font-black'}`}
              title="Large font size"
            >
              A+
            </button>
          </div>

          {/* High Contrast */}
          <button
            onClick={toggleContrast}
            className="flex items-center space-x-1 px-2.5 py-0.5 bg-white hover:bg-slate-100 text-black font-black rounded border-2 border-slate-400 shadow-2xs cursor-pointer"
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-3.5 h-3.5 text-black font-bold" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-400 hover:bg-amber-500 text-black font-black rounded shadow-2xs cursor-pointer border border-amber-600"
          >
            <Globe className="w-3.5 h-3.5 text-black font-bold" />
            <span>{lang === 'EN' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
