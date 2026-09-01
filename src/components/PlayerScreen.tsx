import React, { useState } from 'react';
import { AudioItem, Playlist, RepeatOption } from '../types';
import {
  Search, Plus, Shuffle, FolderPlus, Music,
  Play, Pause, SkipBack, SkipForward, Repeat, ListMusic,
  Trash2, X, Check, Volume2, Maximize2
} from 'lucide-react';

interface PlayerScreenProps {
  songs: AudioItem[];
  playlists: Playlist[];
  currentSong: AudioItem | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  isShuffle: boolean;
  repeatOption: RepeatOption;
  onPlaySong: (song: AudioItem, queue?: AudioItem[]) => void;
  onTogglePlayPause: () => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  onSeek: (ms: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onAddSongToPlaylist: (playlistId: string, songId: string) => void;
  onMixPlaylists: (playlistIds: string[], shuffle: boolean) => void;
  onImportCustomSongs: (files: FileList) => void;
  onOpenFullPlayer: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  songs,
  playlists,
  currentSong,
  isPlaying,
  positionMs,
  durationMs,
  isShuffle,
  repeatOption,
  onPlaySong,
  onTogglePlayPause,
  onPlayNext,
  onPlayPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onCreatePlaylist,
  onDeletePlaylist,
  onAddSongToPlaylist,
  onMixPlaylists,
  onImportCustomSongs,
  onOpenFullPlayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [songForPlaylistModal, setSongForPlaylistModal] = useState<AudioItem | null>(null);
  const [showMixModal, setShowMixModal] = useState(false);
  const [selectedMixPlaylists, setSelectedMixPlaylists] = useState<string[]>([]);
  const [mixShuffle, setMixShuffle] = useState(true);
  const [showQueueSheet, setShowQueueSheet] = useState(false);

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (!selectedPlaylistId) return matchesSearch;
    const playlist = playlists.find((p) => p.id === selectedPlaylistId);
    if (!playlist) return matchesSearch;
    return playlist.songIds.includes(s.id) && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportCustomSongs(e.target.files);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e131b] p-5 rounded-2xl border border-[#222a36]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Music Library</h1>
          <p className="text-xs text-gray-400 mt-1">
            {songs.length} track(s) available • {playlists.length} custom playlist(s)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a2232] border border-[#2a364a] text-xs font-semibold text-rose-300 hover:bg-[#222d42] cursor-pointer transition-colors">
            <FolderPlus className="w-4 h-4 text-rose-400" />
            <span>Import Audio Files</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121722] border border-[#232a36] text-xs font-semibold text-gray-200 hover:bg-[#181f2c] transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Playlist</span>
          </button>

          {playlists.length >= 2 && (
            <button
              onClick={() => {
                setSelectedMixPlaylists(playlists.map((p) => p.id));
                setShowMixModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121722] border border-[#232a36] text-xs font-semibold text-gray-200 hover:bg-[#181f2c] transition-colors"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>Mix Playlists</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search title, artist, album..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e131b] border border-[#222a36] text-white text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-rose-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Playlists Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedPlaylistId(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlaylistId === null
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'bg-[#121722] border border-[#222a36] text-gray-300 hover:bg-[#1a2232]'
            }`}
          >
            All Tracks ({songs.length})
          </button>

          {playlists.map((pl) => {
            const active = selectedPlaylistId === pl.id;
            return (
              <div
                key={pl.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                    : 'bg-[#121722] border border-[#222a36] text-gray-300 hover:bg-[#1a2232]'
                }`}
              >
                <button onClick={() => setSelectedPlaylistId(pl.id)}>
                  {pl.name} ({pl.songIds.length})
                </button>
                <button
                  onClick={() => onDeletePlaylist(pl.id)}
                  className="p-0.5 hover:text-rose-300 rounded-full"
                  title="Delete Playlist"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Song List */}
      <div className="bg-[#0e131b] border border-[#222a36] rounded-2xl overflow-hidden">
        {filteredSongs.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Music className="w-12 h-12 mx-auto text-gray-600 stroke-[1.5]" />
            <p className="text-sm font-medium">No matching audio tracks found</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a212d]">
            {filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  className={`flex items-center justify-between p-3.5 hover:bg-[#141b26] transition-colors group ${
                    isCurrent ? 'bg-rose-950/20 border-l-4 border-rose-500' : ''
                  }`}
                >
                  <div
                    onClick={() => onPlaySong(song, filteredSongs)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 text-sm font-bold bg-gradient-to-br ${
                        song.coverColor || 'from-zinc-700 to-zinc-900'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Volume2 className="w-5 h-5 text-white animate-pulse" />
                      ) : (
                        <Music className="w-4 h-4 text-white/80" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isCurrent ? 'text-rose-400' : 'text-white'
                        }`}
                      >
                        {song.title}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {song.artist} • {song.album}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-xs font-mono text-gray-400">
                      {formatMs(song.durationMs)}
                    </span>

                    <button
                      onClick={() => setSongForPlaylistModal(song)}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2736] transition-colors"
                      title="Add to playlist"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onPlaySong(song, filteredSongs)}
                      className={`p-2 rounded-xl transition-all ${
                        isCurrent && isPlaying
                          ? 'bg-rose-600 text-white'
                          : 'bg-[#18202c] text-gray-300 hover:text-white hover:bg-rose-600/90'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Now Playing Card Footer */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d1118]/95 backdrop-blur-md border-t border-[#232a36] px-4 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Track Info & Fullscreen Trigger */}
            <div
              onClick={onOpenFullPlayer}
              className="flex items-center gap-3 cursor-pointer group min-w-0 w-full md:w-1/3"
            >
              <div
                className={`w-12 h-12 rounded-xl grid place-items-center flex-shrink-0 bg-gradient-to-br ${
                  currentSong.coverColor || 'from-rose-600 to-indigo-900'
                } shadow-md group-hover:scale-105 transition-transform`}
              >
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors">
                    {currentSong.title}
                  </h3>
                  <Maximize2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
            </div>

            {/* Playback Progress & Controls */}
            <div className="flex flex-col items-center gap-1.5 w-full md:w-1/2">
              <div className="flex items-center gap-4">
                <button
                  onClick={onToggleShuffle}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isShuffle ? 'text-rose-500 bg-rose-500/10' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={onPlayPrev}
                  className="p-1.5 text-gray-300 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={onTogglePlayPause}
                  className="w-10 h-10 rounded-full bg-rose-600 text-white grid place-items-center hover:bg-rose-500 transition-transform active:scale-95 shadow-lg shadow-rose-900/50"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={onPlayNext}
                  className="p-1.5 text-gray-300 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={onToggleRepeat}
                  className={`p-1.5 rounded-lg transition-colors ${
                    repeatOption !== RepeatOption.OFF
                      ? 'text-rose-500 bg-rose-500/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2 text-[11px] font-mono text-gray-400">
                <span className="w-9 text-right">{formatMs(positionMs)}</span>
                <input
                  type="range"
                  min="0"
                  max={durationMs || 100}
                  value={positionMs}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="flex-1 h-1.5"
                />
                <span className="w-9">{formatMs(durationMs)}</span>
              </div>
            </div>

            {/* Queue sheet trigger */}
            <div className="hidden md:flex items-center justify-end w-1/6">
              <button
                onClick={() => setShowQueueSheet(!showQueueSheet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18202c] border border-[#263142] text-xs font-medium text-gray-300 hover:text-white hover:bg-[#202b3c] transition-colors"
              >
                <ListMusic className="w-4 h-4 text-rose-400" />
                <span>Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-[#121722] border border-[#232a36] p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full bg-[#0a0e14] border border-[#232d3e] text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPlaylistName.trim()) {
                    onCreatePlaylist(newPlaylistName.trim());
                    setNewPlaylistName('');
                    setShowCreateModal(false);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Song To Playlist Modal */}
      {songForPlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-[#121722] border border-[#232a36] p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              Add "{songForPlaylistModal.title}" to Playlist
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {playlists.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  No playlists yet. Create a playlist first!
                </p>
              ) : (
                playlists.map((pl) => {
                  const inPlaylist = pl.songIds.includes(songForPlaylistModal.id);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => {
                        onAddSongToPlaylist(pl.id, songForPlaylistModal.id);
                        setSongForPlaylistModal(null);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a0e14] border border-[#222a36] hover:border-rose-500/50 text-left text-xs font-semibold text-white transition-colors"
                    >
                      <span>{pl.name}</span>
                      {inPlaylist ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSongForPlaylistModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mix Playlists Modal */}
      {showMixModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-[#121722] border border-[#232a36] p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Mix Playlists</h3>
            <p className="text-xs text-gray-400">
              Select playlists to combine into a unified playback queue.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((pl) => {
                const selected = selectedMixPlaylists.includes(pl.id);
                return (
                  <button
                    key={pl.id}
                    onClick={() => {
                      if (selected) {
                        setSelectedMixPlaylists(selectedMixPlaylists.filter((id) => id !== pl.id));
                      } else {
                        setSelectedMixPlaylists([...selectedMixPlaylists, pl.id]);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                      selected
                        ? 'bg-rose-950/30 border-rose-500 text-white'
                        : 'bg-[#0a0e14] border-[#222a36] text-gray-400'
                    }`}
                  >
                    <span>{pl.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {pl.songIds.length} track(s)
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mixShuffle}
                  onChange={(e) => setMixShuffle(e.target.checked)}
                  className="rounded border-gray-700 text-rose-600 focus:ring-rose-500"
                />
                <span>Shuffle combined queue</span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowMixModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onMixPlaylists(selectedMixPlaylists, mixShuffle);
                    setShowMixModal(false);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500"
                >
                  Play Mix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
