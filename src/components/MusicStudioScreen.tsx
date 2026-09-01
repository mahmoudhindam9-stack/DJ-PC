import React, { useState, useEffect, useRef } from 'react';
import { StudioTrack, StudioNote } from '../types';
import { STUDIO_INSTRUMENTS, RHYTHM_PATTERNS } from '../lib/demoData';
import { audioEngine } from '../lib/audioEngine';
import { Play, Square, Plus, Trash2, Volume2, Music, Disc } from 'lucide-react';

export const MusicStudioScreen: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedScale, setSelectedScale] = useState('Major');
  const [selectedRhythmIdx, setSelectedRhythmIdx] = useState(0);

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const scales = ['Major', 'Minor', 'Pentatonic', 'Blues', 'Rast (رست)', 'Bayati (بياتي)', 'Hijaz (حجاز)', 'Sikah (سيكاه)'];

  const [tracks, setTracks] = useState<StudioTrack[]>([
    {
      id: 'trk-1',
      name: 'Melody Lead',
      instrument: 'Grand Piano',
      volume: 0.8,
      muted: false,
      solo: false,
      notes: [
        { id: 'n1', pitch: 60, startBeat: 0, durationBeats: 0.5, velocity: 1 },
        { id: 'n2', pitch: 64, startBeat: 0.5, durationBeats: 0.5, velocity: 1 },
        { id: 'n3', pitch: 67, startBeat: 1.0, durationBeats: 0.5, velocity: 1 },
        { id: 'n4', pitch: 72, startBeat: 1.5, durationBeats: 1.0, velocity: 1 }
      ]
    },
    {
      id: 'trk-2',
      name: 'Bass Line',
      instrument: 'Sub Bass',
      volume: 0.9,
      muted: false,
      solo: false,
      notes: [
        { id: 'n5', pitch: 48, startBeat: 0, durationBeats: 1.0, velocity: 1 },
        { id: 'n6', pitch: 48, startBeat: 1.0, durationBeats: 1.0, velocity: 1 }
      ]
    }
  ]);

  const [selectedTrackId, setSelectedTrackId] = useState('trk-1');
  const [currentStep, setCurrentStep] = useState(0);

  const timerRef = useRef<number | null>(null);

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];

  // Playhead step timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm / 2) * 1000;
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 16;
          // Play notes on this step
          tracks.forEach((track) => {
            if (!track.muted) {
              const currentBeat = next * 0.5;
              track.notes.forEach((note) => {
                if (Math.abs(note.startBeat - currentBeat) < 0.05) {
                  audioEngine.playStudioNote(note.pitch, track.instrument, note.durationBeats, bpm);
                }
              });
            }
          });

          // Play rhythm loop pad
          const rhythm = RHYTHM_PATTERNS[selectedRhythmIdx];
          if (rhythm) {
            const hit = rhythm.pattern[next % rhythm.pattern.length];
            if (hit && hit !== 'rest') {
              audioEngine.playDarbukaPad(hit);
            }
          }

          return next;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentStep(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, tracks, selectedRhythmIdx]);

  const toggleNote = (pitch: number, beat: number) => {
    const nextNotes = [...selectedTrack.notes];
    const idx = nextNotes.findIndex((n) => n.pitch === pitch && Math.abs(n.startBeat - beat) < 0.05);

    if (idx >= 0) {
      nextNotes.splice(idx, 1);
    } else {
      nextNotes.push({
        id: `note-${Date.now()}-${Math.random()}`,
        pitch,
        startBeat: beat,
        durationBeats: 0.5,
        velocity: 1
      });
      // Play note preview
      audioEngine.playStudioNote(pitch, selectedTrack.instrument, 0.5, bpm);
    }

    setTracks(
      tracks.map((t) => (t.id === selectedTrack.id ? { ...t, notes: nextNotes } : t))
    );
  };

  const addTrack = () => {
    const newTrk: StudioTrack = {
      id: `trk-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      instrument: 'Synth Lead',
      volume: 0.8,
      muted: false,
      solo: false,
      notes: []
    };
    setTracks([...tracks, newTrk]);
    setSelectedTrackId(newTrk.id);
  };

  const deleteTrack = (id: string) => {
    if (tracks.length <= 1) return;
    const next = tracks.filter((t) => t.id !== id);
    setTracks(next);
    if (selectedTrackId === id) setSelectedTrackId(next[0].id);
  };

  const noteName = (pitch: number) => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(pitch / 12) - 1;
    return `${names[pitch % 12]}${octave}`;
  };

  const pitches = Array.from({ length: 24 }, (_, i) => 72 - i); // C5 down to C3

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24">
      {/* Header & Transport */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e131b] p-5 rounded-2xl border border-[#222a36]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">MULTI-TRACK STUDIO ARRANGER</h1>
          <p className="text-xs text-gray-400 mt-1">
            Piano Roll • Multi-Instrument Sequencing • Oriental Darbuka Loops
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
              isPlaying
                ? 'bg-rose-600 text-white shadow-rose-900/50 animate-pulse'
                : 'bg-emerald-600 text-white shadow-emerald-900/50 hover:bg-emerald-500'
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            <span>{isPlaying ? 'STOP PLAYBACK' : 'START ARRANGEMENT'}</span>
          </button>
        </div>
      </div>

      {/* Song Setup Bar (BPM, Key, Scale) */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>BPM SPEED</span>
              <span className="text-rose-400 font-bold">{bpm}</span>
            </div>
            <input
              type="range"
              min="50"
              max="220"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full h-1.5"
            />
          </div>

          <div>
            <span className="text-xs font-mono text-gray-300 block mb-1">KEY SELECTOR</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {keys.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedKey === k ? 'bg-rose-600 text-white' : 'bg-[#0a0e14] border border-[#1f2838] text-gray-400'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-gray-300 block mb-1">SCALE / MAQAM</span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {scales.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedScale(s)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedScale === s ? 'bg-amber-500 text-black font-bold' : 'bg-[#0a0e14] border border-[#1f2838] text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Track Selector & Details */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tracks.map((t) => {
              const active = selectedTrackId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrackId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                      : 'bg-[#121722] border border-[#222a36] text-gray-400 hover:text-white'
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
            <button
              onClick={addTrack}
              className="px-3 py-1.5 rounded-xl bg-[#141c2b] border border-[#232f44] text-xs font-bold text-emerald-400 hover:bg-[#1a2538] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>

          {tracks.length > 1 && (
            <button
              onClick={() => deleteTrack(selectedTrack.id)}
              className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg"
              title="Delete track"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected Track Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
          <div>
            <span className="text-xs font-mono text-gray-300 block mb-1">INSTRUMENT SOUND</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {STUDIO_INSTRUMENTS.map((inst) => {
                const sel = selectedTrack.instrument === inst;
                return (
                  <button
                    key={inst}
                    onClick={() =>
                      setTracks(
                        tracks.map((t) => (t.id === selectedTrack.id ? { ...t, instrument: inst } : t))
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      sel ? 'bg-cyan-500 text-black font-bold' : 'bg-[#0a0e14] border border-[#1f2838] text-gray-400'
                    }`}
                  >
                    {inst}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                <span>TRACK VOLUME</span>
                <span className="text-rose-400">{Math.round(selectedTrack.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedTrack.volume}
                onChange={(e) =>
                  setTracks(
                    tracks.map((t) =>
                      t.id === selectedTrack.id ? { ...t, volume: parseFloat(e.target.value) } : t
                    )
                  )
                }
                className="w-full h-1.5"
              />
            </div>

            <button
              onClick={() =>
                setTracks(
                  tracks.map((t) =>
                    t.id === selectedTrack.id ? { ...t, muted: !t.muted } : t
                  )
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedTrack.muted
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#0a0e14] border border-[#1f2838] text-gray-400'
              }`}
            >
              MUTE
            </button>
          </div>
        </div>
      </div>

      {/* Piano Roll Grid */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-4 shadow-xl space-y-2 overflow-x-auto">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">
          PIANO ROLL GRID — {selectedTrack.name} ({selectedTrack.instrument})
        </h2>

        <div className="min-w-[700px] border border-[#1f2838] rounded-xl overflow-hidden bg-[#0a0e14]">
          {/* Header Step Numbers */}
          <div className="flex border-b border-[#1f2838] bg-[#0d121a]">
            <div className="w-16 h-7 text-[10px] font-mono text-gray-400 font-bold grid place-items-center border-r border-[#1f2838]">
              KEY
            </div>
            {Array.from({ length: 16 }).map((_, stepIdx) => (
              <div
                key={stepIdx}
                className={`flex-1 h-7 text-[10px] font-mono grid place-items-center border-r border-[#1f2838] ${
                  currentStep === stepIdx ? 'bg-rose-600 text-white font-bold' : 'text-gray-400'
                }`}
              >
                {stepIdx + 1}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-[#18202d]">
            {pitches.map((pitch) => (
              <div key={pitch} className="flex h-7">
                <div className="w-16 text-[10px] font-mono text-gray-300 font-bold grid place-items-center bg-[#0d121a] border-r border-[#1f2838]">
                  {noteName(pitch)}
                </div>

                {Array.from({ length: 16 }).map((_, stepIdx) => {
                  const beat = stepIdx * 0.5;
                  const hasNote = selectedTrack.notes.some(
                    (n) => n.pitch === pitch && Math.abs(n.startBeat - beat) < 0.05
                  );
                  const isCurrent = currentStep === stepIdx;

                  return (
                    <div
                      key={stepIdx}
                      onClick={() => toggleNote(pitch, beat)}
                      className={`flex-1 border-r border-[#151c27] cursor-pointer transition-colors ${
                        hasNote
                          ? 'bg-rose-500 border-rose-400 shadow-sm shadow-rose-900'
                          : isCurrent
                          ? 'bg-white/5'
                          : stepIdx % 4 === 0
                          ? 'bg-[#101620]'
                          : 'bg-[#0a0e14]'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🥁 Darbuka Live Pads (طبلة شرقية) */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-2">
          <h2 className="text-sm font-bold text-rose-400 tracking-wider">
            🥁 DARBUKA LIVE PADS (طبلة شرقية)
          </h2>
          <span className="text-xs font-mono text-gray-400">Tap to play live drums</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'doom', label: 'دوم (Doom)' },
            { id: 'tak', label: 'تاك (Tak)' },
            { id: 'sak', label: 'صك (Sak)' },
            { id: 'ka', label: 'كاب (Ka)' },
            { id: 'riq', label: 'رق (Riq)' },
            { id: 'bandir', label: 'بندير (Bandir)' },
          ].map((pad) => (
            <button
              key={pad.id}
              onClick={() => audioEngine.playDarbukaPad(pad.id)}
              className="py-4 px-2 rounded-xl bg-gradient-to-br from-[#182130] to-[#0a0e14] border border-[#232f42] hover:border-rose-500 text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
            >
              {pad.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rhythm Patterns & Oriental Loops */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl p-5 space-y-3 shadow-xl">
        <h2 className="text-sm font-bold text-white tracking-wider">
          RHYTHM PATTERNS & ORIENTAL LOOPS (إيقاعات وطبلة لووب)
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {RHYTHM_PATTERNS.map((r, idx) => {
            const active = selectedRhythmIdx === idx;
            return (
              <button
                key={r.name}
                onClick={() => setSelectedRhythmIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-900/40'
                    : 'bg-[#0a0e14] border border-[#1f2838] text-gray-300 hover:bg-[#121822]'
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
