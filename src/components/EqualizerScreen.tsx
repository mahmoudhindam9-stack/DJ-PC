import React, { useState } from 'react';
import { EQBand } from '../types';
import { INITIAL_EQ_BANDS, EQ_PRESETS } from '../lib/demoData';
import { Sliders, Sparkles, Power, RefreshCw } from 'lucide-react';

export const EqualizerScreen: React.FC = () => {
  const [bands, setBands] = useState<EQBand[]>(INITIAL_EQ_BANDS);
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState('Flat');
  const [isDolbyEnabled, setIsDolbyEnabled] = useState(true);
  const [dolbyProfile, setDolbyProfile] = useState('Dolby Music');
  const [dolbyStrength, setDolbyStrength] = useState(750); // 0..1000
  const [quickBass, setQuickBass] = useState(3);
  const [quickMid, setQuickMid] = useState(0);
  const [quickTreble, setQuickTreble] = useState(2);

  const dolbyProfiles = ['Dolby Music', 'Dolby Cinema', 'Dolby Dynamic', 'Dolby Voice', 'Dolby Game'];

  const applyPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const levels = EQ_PRESETS[presetName] || EQ_PRESETS['Flat'];
    setBands(
      bands.map((b, idx) => ({
        ...b,
        currentLevelDb: levels[idx] !== undefined ? levels[idx] : 0
      }))
    );
  };

  const handleBandChange = (id: number, val: number) => {
    setSelectedPreset('Custom');
    setBands(bands.map((b) => (b.id === id ? { ...b, currentLevelDb: val } : b)));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Header & Main Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e131b] p-5 rounded-2xl border border-[#222a36]">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-rose-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">PRO HARDWARE EQUALIZER</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            10-Band Precision DSP • Dolby Atmos 3D Spatializer Virtualization
          </p>
        </div>

        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all ${
            isEnabled
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
              : 'bg-[#18202c] text-gray-400 border border-[#263142]'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isEnabled ? 'EQ ACTIVE' : 'EQ BYPASSED'}</span>
        </button>
      </div>

      {/* Dolby Atmos 3D Spatializer Card */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider">DOLBY ATMOS 3D SPATIALIZER</h2>
              <p className="text-xs text-gray-400">Surround sound virtualization & AudioFX spatial bridge</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDolbyEnabled}
              onChange={(e) => setIsDolbyEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Profile Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-300 font-mono">DOLBY SOUND PROFILES</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {dolbyProfiles.map((p) => {
              const active = dolbyProfile === p;
              return (
                <button
                  key={p}
                  onClick={() => setDolbyProfile(p)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-900/40'
                      : 'bg-[#121722] border border-[#222a36] text-gray-300 hover:bg-[#1a2232]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Strength Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-gray-300">3D SPATIAL SURROUND STRENGTH</span>
            <span className="text-amber-400">{Math.round(dolbyStrength / 10)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={dolbyStrength}
            disabled={!isDolbyEnabled}
            onChange={(e) => setDolbyStrength(parseInt(e.target.value))}
            className="w-full h-2"
          />
        </div>
      </div>

      {/* Presets Row */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-300 font-mono">EQUALIZER PRESETS</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.keys(EQ_PRESETS).map((p) => {
            const active = selectedPreset === p;
            return (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/40'
                    : 'bg-[#121722] border border-[#222a36] text-gray-300 hover:bg-[#1a2232]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* GM Quick Control */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
          GM QUICK CONTROL (BASS / MID / TREBLE)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>BASS</span>
              <span className="text-rose-400 font-bold">{quickBass} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={quickBass}
              onChange={(e) => setQuickBass(parseInt(e.target.value))}
              className="w-full h-1.5"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>MID</span>
              <span className="text-rose-400 font-bold">{quickMid} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={quickMid}
              onChange={(e) => setQuickMid(parseInt(e.target.value))}
              className="w-full h-1.5"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>TREBLE</span>
              <span className="text-rose-400 font-bold">{quickTreble} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              value={quickTreble}
              onChange={(e) => setQuickTreble(parseInt(e.target.value))}
              className="w-full h-1.5"
            />
          </div>
        </div>
      </div>

      {/* 10 Band Faders Grid */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white font-mono tracking-widest uppercase">
            10-BAND GRAPHIC EQUALIZER
          </h2>
          <button
            onClick={() => applyPreset('Flat')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Flat</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {bands.map((b) => (
            <div
              key={b.id}
              className="bg-[#0a0e14] border border-[#1f2838] p-3 rounded-xl flex flex-col items-center gap-3 text-center"
            >
              <span className="text-xs font-mono font-bold text-rose-400">
                {b.currentLevelDb > 0 ? `+${b.currentLevelDb}` : b.currentLevelDb} dB
              </span>

              <div className="h-32 flex items-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={b.currentLevelDb}
                  onChange={(e) => handleBandChange(b.id, parseInt(e.target.value))}
                  className="w-24 h-2 -rotate-90 origin-center cursor-pointer"
                />
              </div>

              <span className="text-[10px] font-mono text-gray-300 font-bold">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
