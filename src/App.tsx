import React, { useState, useEffect, useRef } from 'react';
import { AudioItem, Playlist, RepeatOption, NavTab } from './types';
import { INITIAL_SONGS, INITIAL_PLAYLISTS } from './lib/demoData';
import { audioEngine } from './lib/audioEngine';
import { Navigation } from './components/Navigation';
import { PlayerScreen } from './components/PlayerScreen';
import { FullPlayer } from './components/FullPlayer';
import { DJMixerScreen } from './components/DJMixerScreen';
import { EqualizerScreen } from './components/EqualizerScreen';
import { MusicStudioScreen } from './components/MusicStudioScreen';
import { MicScreen } from './components/MicScreen';
import { ControlsScreen } from './components/ControlsScreen';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('player');
  const [songs, setSongs] = useState<AudioItem[]>(INITIAL_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);

  // Playback State
  const [currentSong, setCurrentSong] = useState<AudioItem | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(INITIAL_SONGS[0].durationMs);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(RepeatOption.OFF);
  const [playbackQueue, setPlaybackQueue] = useState<AudioItem[]>(INITIAL_SONGS);

  // Master Volume & Recording State
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [masterDb, setMasterDb] = useState(-6.0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState(0);

  const playbackTimerRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying && currentSong) {
      playbackTimerRef.current = window.setInterval(() => {
        setPositionMs((prev) => {
          if (prev >= durationMs) {
            handlePlayNext();
            return 0;
          }
          return prev + 1000;
        });

        // Simulate master DB fluctuation
        setMasterDb(-12 + Math.sin(Date.now() * 0.005) * 8 + Math.random() * 2);
      }, 1000);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      setMasterDb(-30);
    }

    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, currentSong, durationMs]);

  // Recording ticker
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDurationSec((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingDurationSec(0);
    }

    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handlePlaySong = (song: AudioItem, queue?: AudioItem[]) => {
    setCurrentSong(song);
    setPositionMs(0);
    setDurationMs(song.durationMs);
    setIsPlaying(true);
    if (queue) setPlaybackQueue(queue);
  };

  const handleTogglePlayPause = () => {
    if (!currentSong && songs.length > 0) {
      handlePlaySong(songs[0]);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlayNext = () => {
    if (playbackQueue.length === 0) return;
    const currentIdx = playbackQueue.findIndex((s) => s.id === currentSong?.id);
    let nextIdx = (currentIdx + 1) % playbackQueue.length;

    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * playbackQueue.length);
    }

    const nextSong = playbackQueue[nextIdx];
    if (nextSong) {
      setCurrentSong(nextSong);
      setPositionMs(0);
      setDurationMs(nextSong.durationMs);
      setIsPlaying(true);
    }
  };

  const handlePlayPrev = () => {
    if (playbackQueue.length === 0) return;
    const currentIdx = playbackQueue.findIndex((s) => s.id === currentSong?.id);
    const prevIdx = (currentIdx - 1 + playbackQueue.length) % playbackQueue.length;
    const prevSong = playbackQueue[prevIdx];
    if (prevSong) {
      setCurrentSong(prevSong);
      setPositionMs(0);
      setDurationMs(prevSong.durationMs);
      setIsPlaying(true);
    }
  };

  const handleSeek = (ms: number) => {
    setPositionMs(ms);
  };

  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleToggleRepeat = () => {
    if (repeatOption === RepeatOption.OFF) setRepeatOption(RepeatOption.ALL);
    else if (repeatOption === RepeatOption.ALL) setRepeatOption(RepeatOption.ONE);
    else setRepeatOption(RepeatOption.OFF);
  };

  const handleCreatePlaylist = (name: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      songIds: []
    };
    setPlaylists([...playlists, newPl]);
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  const handleAddSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((p) => {
        if (p.id === playlistId) {
          if (p.songIds.includes(songId)) return p;
          return { ...p, songIds: [...p.songIds, songId] };
        }
        return p;
      })
    );
  };

  const handleMixPlaylists = (playlistIds: string[], shuffle: boolean) => {
    const targetSongIds = new Set<string>();
    playlists.forEach((p) => {
      if (playlistIds.includes(p.id)) {
        p.songIds.forEach((id) => targetSongIds.add(id));
      }
    });

    let mixedSongs = songs.filter((s) => targetSongIds.has(s.id));
    if (shuffle) {
      mixedSongs = [...mixedSongs].sort(() => Math.random() - 0.5);
    }

    if (mixedSongs.length > 0) {
      handlePlaySong(mixedSongs[0], mixedSongs);
    }
  };

  const handleImportCustomSongs = (fileList: FileList) => {
    const newItems: AudioItem[] = [];
    Array.from(fileList).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `custom-${Date.now()}-${idx}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'User Library',
        album: 'Imports',
        durationMs: 180000,
        uri: url,
        bpm: 120,
        coverColor: 'from-blue-600 to-indigo-900',
        isBuiltIn: false
      });
    });

    setSongs([...songs, ...newItems]);
  };

  const handleMasterVolumeChange = (val: number) => {
    setMasterVolume(val);
    audioEngine.setMasterVolume(val);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      const blob = audioEngine.stopRecording('WAV');
      setIsRecording(false);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DJ_Workstation_Mix_${Date.now()}.wav`;
        a.click();
      }
    } else {
      const started = audioEngine.startRecording();
      if (started) {
        setIsRecording(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e9edf5] flex flex-col font-sans">
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isRecording={isRecording}
        recordingDurationSec={recordingDurationSec}
        onToggleRecording={handleToggleRecording}
        masterDb={masterDb}
        masterVolume={masterVolume}
        onMasterVolumeChange={handleMasterVolumeChange}
      />

      <main className="flex-1">
        {currentTab === 'player' && (
          <PlayerScreen
            songs={songs}
            playlists={playlists}
            currentSong={currentSong}
            isPlaying={isPlaying}
            positionMs={positionMs}
            durationMs={durationMs}
            isShuffle={isShuffle}
            repeatOption={repeatOption}
            onPlaySong={handlePlaySong}
            onTogglePlayPause={handleTogglePlayPause}
            onPlayNext={handlePlayNext}
            onPlayPrev={handlePlayPrev}
            onSeek={handleSeek}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onCreatePlaylist={handleCreatePlaylist}
            onDeletePlaylist={handleDeletePlaylist}
            onAddSongToPlaylist={handleAddSongToPlaylist}
            onMixPlaylists={handleMixPlaylists}
            onImportCustomSongs={handleImportCustomSongs}
            onOpenFullPlayer={() => setCurrentTab('full_player')}
          />
        )}

        {currentTab === 'full_player' && (
          <FullPlayer
            song={currentSong}
            isPlaying={isPlaying}
            positionMs={positionMs}
            durationMs={durationMs}
            isShuffle={isShuffle}
            repeatOption={repeatOption}
            onBack={() => setCurrentTab('player')}
            onTogglePlayPause={handleTogglePlayPause}
            onPlayNext={handlePlayNext}
            onPlayPrev={handlePlayPrev}
            onSeek={handleSeek}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
          />
        )}

        {currentTab === 'dj' && <DJMixerScreen songs={songs} />}

        {currentTab === 'equalizer' && <EqualizerScreen />}

        {currentTab === 'studio' && <MusicStudioScreen />}

        {currentTab === 'mic' && <MicScreen />}

        {currentTab === 'controls' && (
          <ControlsScreen
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlayPause={handleTogglePlayPause}
            onPlayNext={handlePlayNext}
            onPlayPrev={handlePlayPrev}
          />
        )}
      </main>
    </div>
  );
};

export default App;
