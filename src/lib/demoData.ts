import { AudioItem, Playlist, EQBand } from '../types';

export const INITIAL_SONGS: AudioItem[] = [
  {
    id: 'song-1',
    title: 'Midnight DJ Groove',
    artist: 'DJ Workstation',
    album: 'Club Hits Vol. 1',
    durationMs: 215000,
    uri: 'synth://midnight-groove',
    bpm: 124,
    key: 'Am',
    coverColor: 'from-purple-600 to-indigo-900',
    isBuiltIn: true
  },
  {
    id: 'song-2',
    title: 'Oriental Tech Saidi',
    artist: 'Eastern Beats & Darbuka',
    album: 'Cairo Nights',
    durationMs: 184000,
    uri: 'synth://oriental-saidi',
    bpm: 120,
    key: 'Dm',
    coverColor: 'from-amber-600 to-rose-900',
    isBuiltIn: true
  },
  {
    id: 'song-3',
    title: 'Electro House Vibe',
    artist: 'Sound Master',
    album: 'Mainstage Live',
    durationMs: 198000,
    uri: 'synth://electro-vibe',
    bpm: 128,
    key: 'Cm',
    coverColor: 'from-cyan-600 to-blue-900',
    isBuiltIn: true
  },
  {
    id: 'song-4',
    title: 'Sunset Chillout Chill',
    artist: 'Acoustic Waves',
    album: 'Ibiza Sessions',
    durationMs: 240000,
    uri: 'synth://sunset-chill',
    bpm: 105,
    key: 'G',
    coverColor: 'from-emerald-600 to-teal-900',
    isBuiltIn: true
  },
  {
    id: 'song-5',
    title: 'Maksoum Trap Beat',
    artist: 'Pro DJ Producer',
    album: 'Fusion Studio',
    durationMs: 165000,
    uri: 'synth://maksoum-trap',
    bpm: 118,
    key: 'Em',
    coverColor: 'from-red-600 to-zinc-900',
    isBuiltIn: true
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    name: 'DJ Club Set',
    songIds: ['song-1', 'song-3']
  },
  {
    id: 'pl-2',
    name: 'Oriental Favorites',
    songIds: ['song-2', 'song-5']
  }
];

export const INITIAL_EQ_BANDS: EQBand[] = [
  { id: 0, name: '31 Hz', freq: 31, currentLevelDb: 0 },
  { id: 1, name: '62 Hz', freq: 62, currentLevelDb: 0 },
  { id: 2, name: '125 Hz', freq: 125, currentLevelDb: 0 },
  { id: 3, name: '250 Hz', freq: 250, currentLevelDb: 0 },
  { id: 4, name: '500 Hz', freq: 500, currentLevelDb: 0 },
  { id: 5, name: '1 kHz', freq: 1000, currentLevelDb: 0 },
  { id: 6, name: '2 kHz', freq: 2000, currentLevelDb: 0 },
  { id: 7, name: '4 kHz', freq: 4000, currentLevelDb: 0 },
  { id: 8, name: '8 kHz', freq: 8000, currentLevelDb: 0 },
  { id: 9, name: '16 kHz', freq: 16000, currentLevelDb: 0 },
];

export const EQ_PRESETS: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Booster': [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  'Treble Booster': [0, 0, 0, 0, 0, 1, 3, 5, 6, 7],
  'Rock': [5, 4, 2, -1, -2, 0, 2, 4, 5, 5],
  'Pop': [-1, 1, 3, 4, 3, 0, -1, 1, 3, 4],
  'Jazz': [3, 2, 0, 2, -2, -2, 0, 1, 2, 3],
  'Classical': [4, 3, 2, 2, -1, -1, 0, 2, 3, 4],
  'EDM': [6, 5, 2, 0, -2, 2, 3, 4, 5, 4],
  'Vocal Booster': [-2, -2, 0, 3, 5, 5, 3, 1, 0, -1],
  'DJ Club': [5, 4, 1, 0, 0, 2, 3, 3, 4, 2],
  'Dolby 3D': [4, 3, 2, 1, 2, 3, 4, 5, 4, 3]
};

export const STUDIO_INSTRUMENTS = [
  'Grand Piano',
  'Synth Lead',
  'Sub Bass',
  'Acoustic Guitar',
  'Synth Pad',
  'Strings',
  'Flute',
  'Oud (عود)',
  'Qanun (قانون)',
  'Darbuka (طبلة)'
];

export const RHYTHM_PATTERNS = [
  { name: 'Maksoum (مقسوم)', bpm: 120, pattern: ['doom', 'tak', 'rest', 'tak', 'doom', 'rest', 'tak', 'rest'] },
  { name: 'Saidi (صعيدي)', bpm: 115, pattern: ['doom', 'tak', 'rest', 'doom', 'doom', 'rest', 'tak', 'rest'] },
  { name: 'Malfouf (ملفوف)', bpm: 128, pattern: ['doom', 'rest', 'rest', 'tak', 'rest', 'rest', 'tak', 'rest'] },
  { name: 'Baladi (بلدي)', bpm: 110, pattern: ['doom', 'doom', 'rest', 'tak', 'doom', 'rest', 'tak', 'rest'] },
  { name: 'Laff (لف)', bpm: 125, pattern: ['doom', 'rest', 'tak', 'rest', 'doom', 'rest', 'tak', 'rest'] },
  { name: 'Ayyoub (أيوب)', bpm: 132, pattern: ['doom', 'rest', 'tak', 'doom', 'tak', 'rest', 'tak', 'rest'] },
  { name: 'House Beat', bpm: 124, pattern: ['kick', 'clap', 'kick', 'clap', 'kick', 'clap', 'kick', 'clap'] },
  { name: 'Hip Hop / Trap', bpm: 95, pattern: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat'] }
];
