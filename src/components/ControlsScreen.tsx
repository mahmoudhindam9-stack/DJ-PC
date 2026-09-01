import React, { useState } from 'react';
import { AudioItem } from '../types';
import { Radio, Volume2, ShieldCheck, Check, Smartphone, Layers, SlidersHorizontal } from 'lucide-react';

interface ControlsScreenProps {
  currentSong: AudioItem | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
}

export const ControlsScreen: React.FC<ControlsScreenProps> = ({
  currentSong,
  isPlaying,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrev
}) => {
  const [showNotificationControls, setShowNotificationControls] = useState(true);
  const [showLockscreenControls, setShowLockscreenControls] = useState(true);
  const [keepBackgroundAlive, setKeepBackgroundAlive] = useState(true);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e131b] p-5 rounded-2xl border border-[#222a36]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">EXTERNAL PLAYBACK & CONTROLS</h1>
          <p className="text-xs text-gray-400 mt-1">
            System Media Session API • Lockscreen Controls • Background Audio Service
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          MEDIA SESSION ACTIVE
        </span>
      </div>

      {/* System Media Session Simulation */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-rose-500" />
          <span>ANDROID & SYSTEM NOTIFICATION MEDIA CARD PREVIEW</span>
        </h2>

        <div className="bg-[#121822] border border-[#263246] rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-900 grid place-items-center font-bold text-white shadow-md">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {currentSong ? currentSong.title : 'No active track'}
              </h3>
              <p className="text-xs text-gray-400">
                {currentSong ? `${currentSong.artist} • ${currentSong.album}` : 'DJ Workstation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPlayPrev}
              className="px-3 py-1.5 rounded-lg bg-[#182130] text-xs font-bold text-gray-300 hover:text-white"
            >
              PREV
            </button>
            <button
              onClick={onTogglePlayPause}
              className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white hover:bg-rose-500"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <button
              onClick={onPlayNext}
              className="px-3 py-1.5 rounded-lg bg-[#182130] text-xs font-bold text-gray-300 hover:text-white"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {/* System Settings Toggles */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-3 shadow-xl">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
          BACKGROUND AUDIO PREFERENCES
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0e14] border border-[#1d2634]">
            <div>
              <h3 className="text-xs font-bold text-white">Notification Playback Controls</h3>
              <p className="text-[11px] text-gray-400">Display mini player inside OS notification drawer</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showNotificationControls}
                onChange={(e) => setShowNotificationControls(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0e14] border border-[#1d2634]">
            <div>
              <h3 className="text-xs font-bold text-white">Lockscreen Album Art & Media Metadata</h3>
              <p className="text-[11px] text-gray-400">Show album cover art and track metadata on lockscreen</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showLockscreenControls}
                onChange={(e) => setShowLockscreenControls(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0e14] border border-[#1d2634]">
            <div>
              <h3 className="text-xs font-bold text-white">Foreground Service Keep-Alive</h3>
              <p className="text-[11px] text-gray-400">Prevent system battery optimization from pausing audio</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={keepBackgroundAlive}
                onChange={(e) => setKeepBackgroundAlive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
