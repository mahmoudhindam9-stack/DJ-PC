import React from 'react';
import { AudioItem, RepeatOption } from '../types';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Music, Disc } from 'lucide-react';

interface FullPlayerProps {
  song: AudioItem | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  isShuffle: boolean;
  repeatOption: RepeatOption;
  onBack: () => void;
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  onSeek: (ms: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const FullPlayer: React.FC<FullPlayerProps> = ({
  song,
  isPlaying,
  positionMs,
  durationMs,
  isShuffle,
  repeatOption,
  onBack,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrev,
  onSeek,
  onToggleRepeat,
  onToggleShuffle
}) => {
  if (!song) {
    return (
      <div className="p-8 text-center">
        <button onClick={onBack} className="text-rose-400 underline">Back to library</button>
      </div>
    );
  }

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col min-h-[80vh] justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[#121722] border border-[#232a36] text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-mono tracking-widest text-rose-400 font-bold uppercase">NOW PLAYING</span>
          <h2 className="text-xs font-semibold text-gray-300 truncate max-w-xs">{song.album}</h2>
        </div>
        <div className="w-10 h-10" />
      </div>

      {/* Album Artwork / Vinyl Animation */}
      <div className="my-8 flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#182130] to-[#0a0e14] border border-[#232f42] grid place-items-center group">
          <div
            className={`w-48 h-48 md:w-60 md:h-60 rounded-full border-8 border-[#121722] shadow-2xl bg-gradient-to-tr ${
              song.coverColor || 'from-rose-600 to-indigo-900'
            } grid place-items-center ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
          >
            <div className="w-16 h-16 rounded-full bg-[#080a0f] border-4 border-[#232a36] grid place-items-center">
              <Disc className="w-8 h-8 text-rose-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Title & Artist */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">{song.title}</h1>
        <p className="text-sm text-gray-400 font-medium">{song.artist}</p>
      </div>

      {/* Progress & Time */}
      <div className="space-y-2 mt-6">
        <input
          type="range"
          min="0"
          max={durationMs || 100}
          value={positionMs}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2"
        />
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span>{formatMs(positionMs)}</span>
          <span>{formatMs(durationMs)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-evenly mt-8">
        <button
          onClick={onToggleShuffle}
          className={`p-3 rounded-2xl transition-colors ${
            isShuffle ? 'text-rose-500 bg-rose-500/10 border border-rose-500/30' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={onPlayPrev}
          className="p-3 rounded-2xl text-gray-200 hover:text-white hover:bg-[#141b26] transition-colors"
        >
          <SkipBack className="w-7 h-7" />
        </button>

        <button
          onClick={onTogglePlayPause}
          className="w-16 h-16 rounded-full bg-rose-600 text-white grid place-items-center shadow-xl shadow-rose-900/50 hover:bg-rose-500 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        <button
          onClick={onPlayNext}
          className="p-3 rounded-2xl text-gray-200 hover:text-white hover:bg-[#141b26] transition-colors"
        >
          <SkipForward className="w-7 h-7" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-3 rounded-2xl transition-colors ${
            repeatOption !== RepeatOption.OFF
              ? 'text-rose-500 bg-rose-500/10 border border-rose-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Repeat className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
