/**
 * Web Audio API ambient worship pad generator
 * Ensures audio playback works immediately and reliably across all browsers
 * even if remote MP3 files have network limitations or CORS issues.
 */
class WorshipPadEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.init();
    if (!this.ctx || this.isPlaying) return;

    this.stop(); // clear any previous

    // Create warm gospel worship pad chord: C major 9 / F major 7 frequencies
    const chordFrequencies = [130.81, 164.81, 196.00, 246.94, 329.63, 392.00]; // C3, E3, G3, B3, E4, G4

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 2.5); // soft swell
    this.gainNode.connect(this.ctx.destination);

    this.oscillators = chordFrequencies.map((freq, i) => {
      const osc = this.ctx!.createOscillator();
      // Alternate between warm sine and triangle for worship atmosphere
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((i - 2.5) * 3, this.ctx!.currentTime);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(this.gainNode!);
      osc.start();
      return osc;
    });

    this.isPlaying = true;
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
          });
          this.oscillators = [];
          if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
          }
        }, 900);
      } catch {
        this.oscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
        });
        this.oscillators = [];
      }
    }
    this.isPlaying = false;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      const targetGain = Math.max(0.0001, vol * 0.1);
      this.gainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }
}

export const worshipPadEngine = new WorshipPadEngine();
