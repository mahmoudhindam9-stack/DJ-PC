export interface AudioItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  uri: string;
  bpm?: number;
  key?: string;
  coverColor?: string;
  isBuiltIn?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export enum RepeatOption {
  OFF = 'OFF',
  ONE = 'ONE',
  ALL = 'ALL'
}

export type DJEffectType =
  | 'Echo'
  | 'Reverb'
  | 'Flanger'
  | 'Phaser'
  | 'Pitch Shift'
  | 'Filter Lowpass'
  | 'Filter Highpass'
  | 'Delay'
  | 'Distortion'
  | 'Tremolo'
  | 'Vibrato'
  | 'WahWah'
  | 'Bitcrusher'
  | 'Chorus'
  | 'Compressor'
  | 'Limiter'
  | 'AutoPan'
  | 'RingMod'
  | 'Noise'
  | 'Stutter'
  | 'VinylScratch'
  | 'TapeStop'
  | 'Gater'
  | 'Reverse'
  | 'Brake'
  | 'Roll'
  | 'DistortionHeavy'
  | 'Overdrive'
  | 'SubBass';

export interface EQBand {
  id: number;
  name: string;
  freq: number;
  currentLevelDb: number;
}

export interface StudioNote {
  id: string;
  pitch: number;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}

export interface StudioTrack {
  id: string;
  name: string;
  instrument: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  notes: StudioNote[];
}

export type VocalFilter =
  | 'Clean'
  | 'Reverb Hall'
  | 'Megaphone'
  | 'Robot'
  | 'Telephone'
  | 'Deep Pitch'
  | 'Radio'
  | 'Alien';

export type BeatFxDivision = '1/16' | '1/8' | '1/4' | '1/2' | '1';

export type NavTab = 'player' | 'dj' | 'equalizer' | 'studio' | 'mic' | 'controls' | 'full_player';
