import React, { useState, useEffect, useRef } from 'react';
import { AudioItem, DJEffectType } from '../types';
import { Play, Pause, SkipBack, SkipForward, Disc, Volume2, Sliders, Flame, Music } from 'lucide-react';

interface DJDeckState {
  track: AudioItem | null;
  isPlaying: boolean;
  positionSec: number;
  pitch: number;
  gain: number;
  lowEq: number;
  midEq: number;
  highEq: number;
  vol: number;
  activeEffects: Set<DJEffectType>;
}

interface DJMixerScreenProps {
  songs: AudioItem[];
}

const ALL_29_FX: DJEffectType[] = [
  'Echo', 'Reverb', 'Flanger', 'Phaser', 'Pitch Shift',
  'Filter Lowpass', 'Filter Highpass', 'Delay', 'Distortion', 'Tremolo',
  'Vibrato', 'WahWah', 'Bitcrusher', 'Chorus', 'Compressor',
  'Limiter', 'AutoPan', 'RingMod', 'Noise', 'Stutter',
  'VinylScratch', 'TapeStop', 'Gater', 'Reverse', 'Brake',
  'Roll', 'DistortionHeavy', 'Overdrive', 'SubBass'
];

export const DJMixerScreen: React.FC<DJMixerScreenProps> = ({ songs }) => {
  const [deckA, setDeckA] = useState<DJDeckState>({
    track: songs[0] || null,
    isPlaying: false,
    positionSec: 0,
    pitch: 0,
    gain: 1.0,
    lowEq: 0,
    midEq: 0,
    highEq: 0,
    vol: 1.0,
    activeEffects: new Set(['Echo', 'Reverb'])
  });

  const [deckB, setDeckB] = useState<DJDeckState>({
    track: songs[1] || null,
    isPlaying: false,
    positionSec: 0,
    pitch: 0,
    gain: 1.0,
    lowEq: 0,
    midEq: 0,
    highEq: 0,
    vol: 1.0,
    activeEffects: new Set(['Filter Lowpass'])
  });

  const [crossfader, setCrossfader] = useState(0.5);
  const [fxAmount, setFxAmount] = useState(0.65);
  const [beatDivision, setBeatDivision] = useState('1/4');
  const [loadModalDeck, setLoadModalDeck] = useState<'A' | 'B' | null>(null);

  const canvasRefA = useRef<HTMLCanvasElement | null>(null);
  const canvasRefB = useRef<HTMLCanvasElement | null>(null);

  // Animate Waveforms
  useEffect(() => {
    const drawWave = (canvas: HTMLCanvasElement | null, playing: boolean, color: string) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width = canvas.parentElement?.clientWidth || 300;
      const h = canvas.height = 80;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0a0e14';
      ctx.fillRect(0, 0, w, h);

      const bars = 60;
      const barW = w / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(i * 0.2 + (playing ? Date.now() * 0.005 : 0)) * 25 + 30;
        ctx.fillStyle = i % 2 === 0 ? color : '#202a3a';
        ctx.fillRect(i * barW, (h - height) / 2, barW - 1, height);
      }

      // Playhead center
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(w * 0.45, 0, 2, h);
    };

    const interval = setInterval(() => {
      drawWave(canvasRefA.current, deckA.isPlaying, '#38bdf8');
      drawWave(canvasRefB.current, deckB.isPlaying, '#f43f5e');
    }, 100);

    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckB.isPlaying]);

  const toggleEffect = (deck: 'A' | 'B', fx: DJEffectType) => {
    if (deck === 'A') {
      const next = new Set(deckA.activeEffects);
      if (next.has(fx)) next.delete(fx); else next.add(fx);
      setDeckA({ ...deckA, activeEffects: next });
    } else {
      const next = new Set(deckB.activeEffects);
      if (next.has(fx)) next.delete(fx); else next.add(fx);
      setDeckB({ ...deckB, activeEffects: next });
    }
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-[#0e131b] p-4 rounded-2xl border border-[#222a36]">
        <div className="flex items-center gap-3">
          <Disc className="w-8 h-8 text-rose-500 animate-[spin_6s_linear_infinite]" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">MIXXX DJ WORKSTATION</h1>
            <p className="text-xs text-gray-400">
              Dual-Deck Mixer • 29 Live DSP FX Rack • Crossfader Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            AUDIO ENGINE READY
          </span>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DECK A */}
        <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-black text-sm grid place-items-center border border-cyan-500/30">
                A
              </span>
              <div>
                <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                  {deckA.track ? deckA.track.title : 'No Track Loaded'}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {deckA.track ? deckA.track.artist : 'Tap LOAD A to pick track'}
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-cyan-400">
              {formatSec(deckA.positionSec)} / {deckA.track ? formatSec(deckA.track.durationMs / 1000) : '0:00'}
            </div>
          </div>

          {/* Waveform */}
          <div className="relative rounded-xl overflow-hidden border border-[#1b2331] bg-[#0a0e14]">
            <canvas ref={canvasRefA} className="w-full h-20 block" />
          </div>

          {/* Transport */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDeckA({ ...deckA, positionSec: 0 })}
              className="px-3 py-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-xs font-bold text-gray-300 hover:text-white"
            >
              CUE
            </button>
            <button
              onClick={() => setDeckA({ ...deckA, positionSec: Math.max(0, deckA.positionSec - 10) })}
              className="p-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-gray-300 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeckA({ ...deckA, isPlaying: !deckA.isPlaying })}
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                deckA.isPlaying
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-900/40'
                  : 'bg-[#182130] text-white hover:bg-[#202c40]'
              }`}
            >
              {deckA.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{deckA.isPlaying ? 'PAUSE' : 'PLAY A'}</span>
            </button>
            <button
              onClick={() => setDeckA({ ...deckA, positionSec: deckA.positionSec + 10 })}
              className="p-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-gray-300 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLoadModalDeck('A')}
              className="px-3 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:bg-cyan-600/30"
            >
              LOAD A
            </button>
          </div>

          {/* Deck Controls */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-400">
            <div>
              <div className="flex justify-between mb-1">
                <span>Pitch Shift</span>
                <span className="text-cyan-400 font-bold">{deckA.pitch.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.1"
                value={deckA.pitch}
                onChange={(e) => setDeckA({ ...deckA, pitch: parseFloat(e.target.value) })}
                className="w-full h-1.5"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Gain</span>
                <span className="text-cyan-400 font-bold">{(deckA.gain * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.01"
                value={deckA.gain}
                onChange={(e) => setDeckA({ ...deckA, gain: parseFloat(e.target.value) })}
                className="w-full h-1.5"
              />
            </div>
          </div>
        </div>

        {/* DECK B */}
        <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 font-black text-sm grid place-items-center border border-rose-500/30">
                B
              </span>
              <div>
                <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                  {deckB.track ? deckB.track.title : 'No Track Loaded'}
                </h3>
                <p className="text-[11px] text-gray-400">
                  {deckB.track ? deckB.track.artist : 'Tap LOAD B to pick track'}
                </p>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-rose-400">
              {formatSec(deckB.positionSec)} / {deckB.track ? formatSec(deckB.track.durationMs / 1000) : '0:00'}
            </div>
          </div>

          {/* Waveform */}
          <div className="relative rounded-xl overflow-hidden border border-[#1b2331] bg-[#0a0e14]">
            <canvas ref={canvasRefB} className="w-full h-20 block" />
          </div>

          {/* Transport */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDeckB({ ...deckB, positionSec: 0 })}
              className="px-3 py-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-xs font-bold text-gray-300 hover:text-white"
            >
              CUE
            </button>
            <button
              onClick={() => setDeckB({ ...deckB, positionSec: Math.max(0, deckB.positionSec - 10) })}
              className="p-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-gray-300 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeckB({ ...deckB, isPlaying: !deckB.isPlaying })}
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                deckB.isPlaying
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-[#182130] text-white hover:bg-[#202c40]'
              }`}
            >
              {deckB.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{deckB.isPlaying ? 'PAUSE' : 'PLAY B'}</span>
            </button>
            <button
              onClick={() => setDeckB({ ...deckB, positionSec: deckB.positionSec + 10 })}
              className="p-2 rounded-xl bg-[#141b26] border border-[#232d3e] text-gray-300 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLoadModalDeck('B')}
              className="px-3 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-xs font-bold text-rose-300 hover:bg-rose-600/30"
            >
              LOAD B
            </button>
          </div>

          {/* Deck Controls */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-400">
            <div>
              <div className="flex justify-between mb-1">
                <span>Pitch Shift</span>
                <span className="text-rose-400 font-bold">{deckB.pitch.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.1"
                value={deckB.pitch}
                onChange={(e) => setDeckB({ ...deckB, pitch: parseFloat(e.target.value) })}
                className="w-full h-1.5"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Gain</span>
                <span className="text-rose-400 font-bold">{(deckB.gain * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.01"
                value={deckB.gain}
                onChange={(e) => setDeckB({ ...deckB, gain: parseFloat(e.target.value) })}
                className="w-full h-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mixer Channel & Crossfader Panel */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-5 shadow-xl">
        <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Sliders className="w-4 h-4 text-rose-500" />
          <span>MIXER CHANNEL CONTROLS</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Deck A Equalizer */}
          <div className="space-y-2 bg-[#0a0e14] p-3.5 rounded-xl border border-[#1d2634]">
            <span className="text-xs font-bold font-mono text-cyan-400">DECK A EQ</span>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-gray-400">
              <div>
                <span>LOW</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckA.lowEq}
                  onChange={(e) => setDeckA({ ...deckA, lowEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>MID</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckA.midEq}
                  onChange={(e) => setDeckA({ ...deckA, midEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>HIGH</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckA.highEq}
                  onChange={(e) => setDeckA({ ...deckA, highEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={deckA.vol}
                  onChange={(e) => setDeckA({ ...deckA, vol: parseFloat(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>

          {/* Crossfader */}
          <div className="text-center space-y-2 px-2">
            <span className="text-xs font-bold text-gray-300 tracking-wider">CROSSFADER</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={crossfader}
              onChange={(e) => setCrossfader(parseFloat(e.target.value))}
              className="w-full h-2"
            />
            <div className="flex justify-between text-[11px] font-mono font-bold">
              <span className="text-cyan-400">A {Math.round((1 - crossfader) * 100)}%</span>
              <span className="text-rose-400">B {Math.round(crossfader * 100)}%</span>
            </div>
          </div>

          {/* Deck B Equalizer */}
          <div className="space-y-2 bg-[#0a0e14] p-3.5 rounded-xl border border-[#1d2634]">
            <span className="text-xs font-bold font-mono text-rose-400">DECK B EQ</span>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-gray-400">
              <div>
                <span>LOW</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckB.lowEq}
                  onChange={(e) => setDeckB({ ...deckB, lowEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>MID</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckB.midEq}
                  onChange={(e) => setDeckB({ ...deckB, midEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>HIGH</span>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={deckB.highEq}
                  onChange={(e) => setDeckB({ ...deckB, highEq: parseInt(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
              <div>
                <span>VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={deckB.vol}
                  onChange={(e) => setDeckB({ ...deckB, vol: parseFloat(e.target.value) })}
                  className="w-full h-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 29 Live DSP FX Rack */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2838] pb-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>MIXXX FX RACK — 29 LIVE DSP EFFECTS</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Tap any effect tile to toggle per deck • Real-time audio DSP filter chain
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">29 ACTIVE FX ENGINES</span>
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {ALL_29_FX.map((fx) => {
            const activeA = deckA.activeEffects.has(fx);
            const activeB = deckB.activeEffects.has(fx);
            const activeAny = activeA || activeB;

            return (
              <div
                key={fx}
                className={`p-2 rounded-xl border text-center transition-all ${
                  activeAny
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-md shadow-rose-950'
                    : 'bg-[#0a0e14] border-[#1d2634] hover:border-gray-600'
                }`}
              >
                <div className="text-[10px] font-bold text-gray-200 truncate mb-1">{fx}</div>
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => toggleEffect('A', fx)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                      activeA ? 'bg-cyan-500 text-black' : 'bg-[#182130] text-gray-400'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => toggleEffect('B', fx)}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                      activeB ? 'bg-rose-500 text-white' : 'bg-[#182130] text-gray-400'
                    }`}
                  >
                    B
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global FX Amount & Beat Division */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold font-mono text-gray-300 mb-1">
              <span>FX AMOUNT (WET / DRY)</span>
              <span className="text-rose-400">{Math.round(fxAmount * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={fxAmount}
              onChange={(e) => setFxAmount(parseFloat(e.target.value))}
              className="w-full h-1.5"
            />
          </div>

          <div>
            <div className="text-xs font-bold font-mono text-gray-300 mb-1">BEAT DIVISION</div>
            <div className="flex gap-1.5">
              {['1/16', '1/8', '1/4', '1/2', '1'].map((div) => {
                const sel = beatDivision === div;
                return (
                  <button
                    key={div}
                    onClick={() => setBeatDivision(div)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      sel
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                        : 'bg-[#0a0e14] border border-[#1d2634] text-gray-400 hover:text-white'
                    }`}
                  >
                    {div}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Load Track Modal */}
      {loadModalDeck && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-[#121722] border border-[#232a36] p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Load Track into Deck {loadModalDeck}</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {songs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (loadModalDeck === 'A') {
                      setDeckA({ ...deckA, track: s, positionSec: 0 });
                    } else {
                      setDeckB({ ...deckB, track: s, positionSec: 0 });
                    }
                    setLoadModalDeck(null);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a0e14] border border-[#222a36] hover:border-rose-500 text-left transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{s.title}</div>
                    <div className="text-[11px] text-gray-400">{s.artist}</div>
                  </div>
                  <Music className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLoadModalDeck(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
