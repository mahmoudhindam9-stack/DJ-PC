import React from 'react';
import { NavTab } from '../types';
import { Play, Disc, Sliders, Music, Mic, Settings, Radio } from 'lucide-react';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isRecording: boolean;
  recordingDurationSec: number;
  onToggleRecording: () => void;
  masterDb: number;
  masterVolume: number;
  onMasterVolumeChange: (val: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  isRecording,
  recordingDurationSec,
  onToggleRecording,
  masterDb,
  masterVolume,
  onMasterVolumeChange
}) => {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'player', label: 'Player', icon: <Play className="w-4 h-4" /> },
    { id: 'dj', label: 'DJ Mixer', icon: <Disc className="w-4 h-4" /> },
    { id: 'equalizer', label: 'Equalizer', icon: <Sliders className="w-4 h-4" /> },
    { id: 'studio', label: 'Studio', icon: <Music className="w-4 h-4" /> },
    { id: 'mic', label: 'Mic / Karaoke', icon: <Mic className="w-4 h-4" /> },
    { id: 'controls', label: 'Controls', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#0d1118] border-b border-[#232a36] sticky top-0 z-40 select-none">
      {/* Top Brand & Master Meter Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 grid place-items-center font-black text-white shadow-lg shadow-rose-900/40">
            ★
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-lg font-bold tracking-wider leading-none text-white">
              <span>DJ</span>
              <span className="text-rose-500 font-extrabold">WORKSTATION</span>
            </div>
            <span className="text-[10px] text-gray-400 tracking-widest block font-mono uppercase mt-0.5">
              PRO AUDIO ENGINE
            </span>
          </div>
        </div>

        {/* Master Meter & Level */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs bg-[#121722] px-3 py-1.5 rounded-lg border border-[#232d3d]">
          <span className="text-[10px] font-mono font-bold text-gray-400">MASTER</span>
          <div className="h-2 bg-[#1b2330] rounded-full overflow-hidden flex-1 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-500 transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(10, (masterDb + 30) * 3))}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-300 w-10 text-right">
            {masterDb.toFixed(1)} dB
          </span>
        </div>

        {/* Master Vol Quick Slider */}
        <div className="hidden lg:flex items-center gap-2 bg-[#121722] px-3 py-1.5 rounded-lg border border-[#232d3d]">
          <span className="text-[10px] font-mono text-gray-400">VOL</span>
          <input
            type="range"
            min="0"
            max="1.2"
            step="0.01"
            value={masterVolume}
            onChange={(e) => onMasterVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-1.5"
          />
        </div>

        {/* Recording & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRecording}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900/50'
                : 'bg-rose-950/60 text-rose-300 border border-rose-800/80 hover:bg-rose-900/70'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-rose-500'}`} />
            {isRecording ? `REC ${formatTime(recordingDurationSec)}` : '● REC MIX'}
          </button>

          <button
            onClick={() => onTabChange('controls')}
            className="p-2 rounded-lg bg-[#121722] border border-[#232a36] text-gray-300 hover:text-white hover:bg-[#181f2c] transition-colors"
            title="External Controls & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="border-t border-[#1a212d] bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  active
                    ? 'border-rose-500 text-white bg-rose-500/10'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#121722]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
