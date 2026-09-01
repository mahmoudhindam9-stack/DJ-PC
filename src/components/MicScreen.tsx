import React, { useState } from 'react';
import { VocalFilter } from '../types';
import { audioEngine } from '../lib/audioEngine';
import { Mic, MicOff, Download, Radio } from 'lucide-react';

export const MicScreen: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [micVolume, setMicVolume] = useState(1.0);
  const [echoLevel, setEchoLevel] = useState(0.3);
  const [reverbLevel, setReverbLevel] = useState(0.4);
  const [vocalFilter, setVocalFilter] = useState<VocalFilter>('Clean');
  const [voiceProcessing, setVoiceProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filters: VocalFilter[] = [
    'Clean',
    'Reverb Hall',
    'Megaphone',
    'Robot',
    'Telephone',
    'Deep Pitch',
    'Radio',
    'Alien'
  ];

  const handleToggleMic = async () => {
    if (isMicOn) {
      audioEngine.disableMicrophone();
      setIsMicOn(false);
    } else {
      setErrorMessage(null);
      await audioEngine.enableMicrophone(
        () => setIsMicOn(true),
        (err) => setErrorMessage(err),
        {
          volume: micVolume,
          echo: echoLevel,
          reverb: reverbLevel,
          vocalFilter,
          voiceProcessing
        }
      );
    }
  };

  const handleUpdate = () => {
    audioEngine.updateMicSettings({
      volume: micVolume,
      echo: echoLevel,
      vocalFilter
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e131b] p-5 rounded-2xl border border-[#222a36]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">KARAOKE & MIC STUDIO</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-Time Vocal Monitoring • Echo DSP • Acoustic Voice Filters
          </p>
        </div>

        <button
          onClick={handleToggleMic}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
            isMicOn
              ? 'bg-rose-600 text-white shadow-rose-900/50 animate-pulse'
              : 'bg-[#18202c] text-gray-300 border border-[#263142] hover:bg-[#202b3c]'
          }`}
        >
          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-gray-400" />}
          <span>{isMicOn ? 'MICROPHONE LIVE' : 'ENABLE MICROPHONE'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Mic Audio DSP Sliders */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-5 shadow-xl">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
          VOCAL MIX & DSP EFFECT KNOBS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>MIC INPUT VOLUME</span>
              <span className="text-rose-400 font-bold">{Math.round(micVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.01"
              value={micVolume}
              onChange={(e) => {
                setMicVolume(parseFloat(e.target.value));
                handleUpdate();
              }}
              className="w-full h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>ECHO / DELAY LEVEL</span>
              <span className="text-rose-400 font-bold">{Math.round(echoLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={echoLevel}
              onChange={(e) => {
                setEchoLevel(parseFloat(e.target.value));
                handleUpdate();
              }}
              className="w-full h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>REVERB DEPTH</span>
              <span className="text-rose-400 font-bold">{Math.round(reverbLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={reverbLevel}
              onChange={(e) => {
                setReverbLevel(parseFloat(e.target.value));
                handleUpdate();
              }}
              className="w-full h-1.5"
            />
          </div>
        </div>
      </div>

      {/* Vocal Filters */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-3 shadow-xl">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
          ACOUSTIC VOCAL FILTER PRESETS
        </h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => {
            const active = vocalFilter === f;
            return (
              <button
                key={f}
                onClick={() => {
                  setVocalFilter(f);
                  handleUpdate();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                    : 'bg-[#0a0e14] border border-[#1f2838] text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Processing Toggles */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
          MICROPHONE SIGNAL CLEANING
        </h2>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0e14] border border-[#1d2634]">
          <div>
            <h3 className="text-xs font-bold text-white">Echo Cancellation & Noise Suppression</h3>
            <p className="text-[11px] text-gray-400">Eliminates feedback loops and ambient noise</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={voiceProcessing}
              onChange={(e) => setVoiceProcessing(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
