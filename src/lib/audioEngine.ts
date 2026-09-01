import { DJEffectType, VocalFilter } from '../types';

// Audio Context Singleton & Helpers
class AudioEngineManager {
  private ctx: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private eqNodes: BiquadFilterNode[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // Mic state
  private micStream: MediaStream | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private micGainNode: GainNode | null = null;
  private micEchoDelayNode: DelayNode | null = null;
  private micEchoFeedbackGain: GainNode | null = null;
  private micReverbConvolver: ConvolverNode | null = null;
  private micFilterNode: BiquadFilterNode | null = null;

  public getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Master Gain setup
  public getMasterGain(): GainNode {
    const ctx = this.getContext();
    if (!this.masterGainNode) {
      this.masterGainNode = ctx.createGain();
      this.masterGainNode.gain.value = 1.0;
      this.masterGainNode.connect(ctx.destination);
    }
    return this.masterGainNode;
  }

  // Set Master Volume
  public setMasterVolume(val: number) {
    const gain = this.getMasterGain();
    gain.gain.setValueAtTime(Math.max(0, Math.min(1.2, val)), this.getContext().currentTime);
  }

  // Play Live Darbuka Oriental Drums
  public playDarbukaPad(type: string) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const master = this.getMasterGain();

    osc.connect(gain);
    gain.connect(master);

    switch (type.toLowerCase()) {
      case 'doom':
        // Low resonant bass drum
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'tak':
        // High sharp rim attack
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'sak':
        // Slap sound with noise burst
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
        break;

      case 'ka':
      case 'riq':
      case 'bandir':
      default:
        // Metallic snap or frame drum response
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
    }
  }

  // Studio Synthesizer Note Playback
  public playStudioNote(pitch: number, instrument: string, durationBeats: number = 0.5, bpm: number = 120) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const durationSeconds = (durationBeats * 60) / bpm;
    const freq = 440 * Math.pow(2, (pitch - 69) / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const master = this.getMasterGain();

    osc.connect(gain);
    gain.connect(master);

    osc.frequency.setValueAtTime(freq, now);

    if (instrument.includes('Piano')) {
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + Math.max(0.2, durationSeconds * 1.2));
    } else if (instrument.includes('Lead') || instrument.includes('Synth')) {
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    } else if (instrument.includes('Bass')) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, now);
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    } else if (instrument.includes('Oud') || instrument.includes('Qanun')) {
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    } else {
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    }

    osc.start(now);
    osc.stop(now + durationSeconds + 0.1);
  }

  // Karaoke Microphone Live Routing
  public async enableMicrophone(
    onSuccess: () => void,
    onError: (err: string) => void,
    settings: {
      volume: number;
      echo: number;
      reverb: number;
      vocalFilter: VocalFilter;
      voiceProcessing: boolean;
    }
  ) {
    try {
      const ctx = this.getContext();
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: settings.voiceProcessing,
          noiseSuppression: settings.voiceProcessing,
          autoGainControl: true,
        }
      };

      this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.micSourceNode = ctx.createMediaStreamSource(this.micStream);
      this.micGainNode = ctx.createGain();
      this.micGainNode.gain.value = settings.volume;

      // Create Echo Chain
      this.micEchoDelayNode = ctx.createDelay();
      this.micEchoDelayNode.delayTime.value = 0.25;
      this.micEchoFeedbackGain = ctx.createGain();
      this.micEchoFeedbackGain.gain.value = settings.echo * 0.6;

      // Filter Node
      this.micFilterNode = ctx.createBiquadFilter();
      this.applyVocalFilterToNode(this.micFilterNode, settings.vocalFilter);

      // Connect Chain: MicSource -> Filter -> MicGain -> Master
      // + MicGain -> Delay -> Feedback -> Delay -> MicGain
      this.micSourceNode.connect(this.micFilterNode);
      this.micFilterNode.connect(this.micGainNode);
      this.micGainNode.connect(this.getMasterGain());

      this.micGainNode.connect(this.micEchoDelayNode);
      this.micEchoDelayNode.connect(this.micEchoFeedbackGain);
      this.micEchoFeedbackGain.connect(this.micEchoDelayNode);
      this.micEchoDelayNode.connect(this.getMasterGain());

      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied or unavailable';
      onError(msg);
    }
  }

  public disableMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSourceNode) {
      this.micSourceNode.disconnect();
      this.micSourceNode = null;
    }
  }

  public updateMicSettings(settings: {
    volume: number;
    echo: number;
    vocalFilter: VocalFilter;
  }) {
    if (this.micGainNode) {
      this.micGainNode.gain.setValueAtTime(settings.volume, this.getContext().currentTime);
    }
    if (this.micEchoFeedbackGain) {
      this.micEchoFeedbackGain.gain.setValueAtTime(settings.echo * 0.6, this.getContext().currentTime);
    }
    if (this.micFilterNode) {
      this.applyVocalFilterToNode(this.micFilterNode, settings.vocalFilter);
    }
  }

  private applyVocalFilterToNode(node: BiquadFilterNode, filter: VocalFilter) {
    const ctx = this.getContext();
    switch (filter) {
      case 'Megaphone':
      case 'Radio':
      case 'Telephone':
        node.type = 'bandpass';
        node.frequency.setValueAtTime(1400, ctx.currentTime);
        node.Q.setValueAtTime(3.0, ctx.currentTime);
        break;
      case 'Deep Pitch':
        node.type = 'lowpass';
        node.frequency.setValueAtTime(600, ctx.currentTime);
        break;
      case 'Reverb Hall':
        node.type = 'peaking';
        node.frequency.setValueAtTime(3000, ctx.currentTime);
        node.gain.setValueAtTime(4.0, ctx.currentTime);
        break;
      case 'Alien':
      case 'Robot':
        node.type = 'highpass';
        node.frequency.setValueAtTime(1000, ctx.currentTime);
        break;
      case 'Clean':
      default:
        node.type = 'allpass';
        break;
    }
  }

  // Recording Mix
  public startRecording(): boolean {
    try {
      const ctx = this.getContext();
      const dest = ctx.createMediaStreamDestination();
      this.getMasterGain().connect(dest);

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(dest.stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      this.mediaRecorder.start();
      return true;
    } catch (e) {
      console.error("Recording error:", e);
      return false;
    }
  }

  public stopRecording(format: string = 'WAV'): Blob | null {
    if (!this.mediaRecorder) return null;
    this.mediaRecorder.stop();
    const type = format === 'MP3' ? 'audio/mp3' : 'audio/wav';
    const blob = new Blob(this.recordedChunks, { type });
    this.recordedChunks = [];
    return blob;
  }
}

export const audioEngine = new AudioEngineManager();
