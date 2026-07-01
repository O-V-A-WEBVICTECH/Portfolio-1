import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Sliders, Info, Sparkles, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { EQ_PRESETS } from '../data';
import { EQPreset } from '../types';

export default function AudioEQCustomizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Crescendo Signature');
  const [bass, setBass] = useState(4); // -10 to 10
  const [mid, setMid] = useState(2);
  const [treble, setTreble] = useState(5);
  const [synthMode, setSynthMode] = useState<'ambient' | 'beats'>('ambient');
  const [showTooltip, setShowTooltip] = useState(false);

  // Audio nodes and context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stepIntervalRef = useRef<number | any>(null);

  // Apply a preset
  const handlePresetSelect = (preset: EQPreset) => {
    setSelectedPreset(preset.name);
    setBass(preset.bass);
    setMid(preset.mid);
    setTreble(preset.treble);

    // Apply directly to active filters if playing
    if (bassFilterRef.current) bassFilterRef.current.gain.setValueAtTime(preset.bass * 2, audioCtxRef.current!.currentTime);
    if (midFilterRef.current) midFilterRef.current.gain.setValueAtTime(preset.mid * 2, audioCtxRef.current!.currentTime);
    if (trebleFilterRef.current) trebleFilterRef.current.gain.setValueAtTime(preset.treble * 2, audioCtxRef.current!.currentTime);
  };

  // Handle manual adjustments
  const handleBassChange = (val: number) => {
    setBass(val);
    setSelectedPreset('Custom');
    if (bassFilterRef.current && audioCtxRef.current) {
      bassFilterRef.current.gain.setValueAtTime(val * 2, audioCtxRef.current.currentTime);
    }
  };

  const handleMidChange = (val: number) => {
    setMid(val);
    setSelectedPreset('Custom');
    if (midFilterRef.current && audioCtxRef.current) {
      midFilterRef.current.gain.setValueAtTime(val * 2, audioCtxRef.current.currentTime);
    }
  };

  const handleTrebleChange = (val: number) => {
    setTreble(val);
    setSelectedPreset('Custom');
    if (trebleFilterRef.current && audioCtxRef.current) {
      trebleFilterRef.current.gain.setValueAtTime(val * 2, audioCtxRef.current.currentTime);
    }
  };

  // Reset EQ
  const handleReset = () => {
    setBass(0);
    setMid(0);
    setTreble(0);
    setSelectedPreset('Studio Reference');
    if (bassFilterRef.current && audioCtxRef.current) bassFilterRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    if (midFilterRef.current && audioCtxRef.current) midFilterRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    if (trebleFilterRef.current && audioCtxRef.current) trebleFilterRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
  };

  // Initialize Web Audio graph
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Create Filters
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200; // Bass range
    bassFilter.gain.value = bass * 2;

    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.Q.value = 1.0;
    midFilter.frequency.value = 1000; // Mid vocal range
    midFilter.gain.value = mid * 2;

    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 4000; // High range
    trebleFilter.gain.value = treble * 2;

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.25; // Safe volume limit

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    // Connect filter chain: Input -> Bass -> Mid -> Treble -> Gain -> Analyser -> Destination
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(mainGain);
    mainGain.connect(analyser);
    analyser.connect(ctx.destination);

    // Save refs
    bassFilterRef.current = bassFilter;
    midFilterRef.current = midFilter;
    trebleFilterRef.current = trebleFilter;
    mainGainRef.current = mainGain;
    analyserRef.current = analyser;
  };

  // Start sound loop generator
  const startSound = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop existing oscillators first
    stopOscillators();

    const dest = bassFilterRef.current!;
    
    // Notes for ambient synthesis (Chord of Db Major / Ab Major for warm beautiful ambient pad)
    const frequencies = synthMode === 'ambient' 
      ? [110.00, 165.00, 220.00, 330.00, 440.00] // A major / drone
      : [65.41, 130.81, 196.00, 261.63, 392.00]; // C major / beat drone

    const activeOscillators: OscillatorNode[] = [];

    // Base Pad Drone (Bass / Low Mid)
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      // Low volume for base drone notes
      oscGain.gain.value = idx === 0 ? 0.3 : 0.15;
      
      // Gentle modulation over time
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1 + (idx * 0.05);
      lfoGain.gain.value = 0.05;
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(dest);
      
      lfo.start();
      osc.start();
      
      activeOscillators.push(osc);
      activeOscillators.push(lfo); // store to stop later
    });

    // High sparkling melody generator (Treble focus)
    let step = 0;
    const melodyNotes = synthMode === 'ambient'
      ? [440.00, 493.88, 554.37, 659.25, 739.99, 880.00] // Pentatonic A major
      : [392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // Pentatonic C major

    const scheduleNextNote = () => {
      if (!isPlaying && !audioCtxRef.current) return;
      
      const noteCtx = audioCtxRef.current!;
      const osc = noteCtx.createOscillator();
      const gainNode = noteCtx.createGain();
      
      // Pick note pattern
      const noteFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, noteCtx.currentTime);
      
      // Decaying volume envelope
      gainNode.gain.setValueAtTime(0, noteCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, noteCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteCtx.currentTime + 1.8);
      
      osc.connect(gainNode);
      gainNode.connect(dest);
      
      osc.start();
      osc.stop(noteCtx.currentTime + 2.0);
    };

    // Trigger first note
    scheduleNextNote();
    
    // Set up step sequencer
    const interval = setInterval(() => {
      if (ctx.state === 'running') {
        scheduleNextNote();
        
        // Add a gentle virtual sub kick for "beats" mode
        if (synthMode === 'beats' && step % 4 === 0) {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          
          kickOsc.frequency.setValueAtTime(150, ctx.currentTime);
          kickOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
          
          kickGain.gain.setValueAtTime(0.4, ctx.currentTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          
          kickOsc.connect(kickGain);
          kickGain.connect(dest);
          
          kickOsc.start();
          kickOsc.stop(ctx.currentTime + 0.4);
        }
        step++;
      }
    }, synthMode === 'ambient' ? 2400 : 800);

    stepIntervalRef.current = interval;
    oscillatorsRef.current = activeOscillators;
  };

  const stopOscillators = () => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
  };

  // Toggle playing
  const togglePlay = () => {
    if (isPlaying) {
      stopOscillators();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  // React to isPlaying and mode changes
  useEffect(() => {
    if (isPlaying) {
      startSound();
    } else {
      stopOscillators();
    }
    return () => stopOscillators();
  }, [isPlaying, synthMode]);

  // Visualizer loop
  useEffect(() => {
    let active = true;
    
    const draw = () => {
      if (!active) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Solid dark background fading
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Grid line guidelines for audio console vibe
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      if (isPlaying && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Draw double glowing waveforms
        ctx.beginPath();
        ctx.lineWidth = 3;
        
        // Custom color gradient for waves
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#3B82F6'); // Blue
        gradient.addColorStop(0.5, '#8B5CF6'); // Purple
        gradient.addColorStop(1, '#EC4899'); // Pink
        ctx.strokeStyle = gradient;

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // 0 to 2
          const y = (v * height) / 2.5 + (height / 8); // center wave vertically

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Draw decorative bars at the bottom
        const barWidth = (width / bufferLength) * 1.5;
        let barX = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.6;
          
          ctx.fillStyle = `rgba(59, 130, 246, ${0.1 + (dataArray[i] / 255) * 0.4})`;
          ctx.fillRect(barX, height - barHeight, barWidth - 2, barHeight);
          
          barX += barWidth;
        }

      } else {
        // Flatline idle wave
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.moveTo(0, height / 2);
        
        // Draw standard subtle sine wave
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.05) * 2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    draw();

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div id="audio-customizer" className="bg-slate-900 text-white py-16 px-4 md:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-mono mb-4 border border-blue-500/20">
            <Sparkles size={12} className="animate-pulse" />
            Interactive EQ Workspace
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight mb-4">
            Custom Acoustics Simulator
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Test and customize Crescendo's advanced spatial audio engine in real time. Turn on the generator below to activate the custom frequency synthesizers.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950/80 p-6 md:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Visualizer & Player Controls (7/12 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 z-10">
            
            {/* Live Visualizer Console */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                  <span>{isPlaying ? 'ACOUSTICS ENGINE ACTIVE' : 'ENGINE STANDBY'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>FREQ: 20Hz - 20kHz</span>
                  <span>MODE: {synthMode.toUpperCase()}</span>
                </div>
              </div>
              
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={220} 
                className="w-full h-[180px] md:h-[220px] bg-slate-950 block"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 to-transparent flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <button
                    id="btn-eq-play-toggle"
                    onClick={togglePlay}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isPlaying 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
                  </button>
                  <div>
                    <h4 className="font-sans font-medium text-sm text-white">
                      {isPlaying ? 'Synthesizer Loop Playing' : 'Synthesizer Paused'}
                    </h4>
                    <p className="font-mono text-[11px] text-slate-400">
                      Adjust slider gains below to filter acoustics
                    </p>
                  </div>
                </div>

                {/* Synth Sound Selector */}
                <div className="flex bg-slate-900/90 rounded-lg p-1 border border-slate-800">
                  <button
                    onClick={() => setSynthMode('ambient')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      synthMode === 'ambient' 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ambient Pad
                  </button>
                  <button
                    onClick={() => setSynthMode('beats')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      synthMode === 'beats' 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pulse Rhythm
                  </button>
                </div>
              </div>
            </div>

            {/* EQ Presets Quick Selector */}
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/60">
              <div className="flex items-center gap-2 mb-3">
                <Sliders size={14} className="text-blue-400" />
                <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Select Custom Acoustics Profile
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {EQ_PRESETS.map((preset) => {
                  const active = selectedPreset === preset.name;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        active 
                          ? 'bg-blue-900/30 border-blue-500/60 shadow-md' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold ${active ? 'text-blue-400' : 'text-white'}`}>
                          {preset.name}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Tactical Faders (5/12 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 z-10 bg-slate-900/30 p-5 rounded-2xl border border-slate-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-semibold text-lg text-white">Tactical Fader Deck</h3>
                <p className="text-slate-400 text-xs">Manual parametric equalizer channels</p>
              </div>
              <button
                onClick={handleReset}
                title="Reset Equalizer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Fader Channels */}
            <div className="space-y-6 my-4">
              {/* Bass Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-medium text-slate-300">BASS CHANNEL (150Hz)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {bass > 0 ? `+${bass}` : bass} dB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">-10dB</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={bass}
                    onChange={(e) => handleBassChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                  <span className="text-[10px] font-mono text-slate-500">+10dB</span>
                </div>
              </div>

              {/* Mid Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-mono font-medium text-slate-300">MID VOCAL (1.2kHz)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {mid > 0 ? `+${mid}` : mid} dB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">-10dB</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={mid}
                    onChange={(e) => handleMidChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                  <span className="text-[10px] font-mono text-slate-500">+10dB</span>
                </div>
              </div>

              {/* Treble Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-mono font-medium text-slate-300">TREBLE AIR (4.8kHz)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    {treble > 0 ? `+${treble}` : treble} dB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">-10dB</span>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={treble}
                    onChange={(e) => handleTrebleChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                  />
                  <span className="text-[10px] font-mono text-slate-500">+10dB</span>
                </div>
              </div>
            </div>

            {/* Hardware Acoustics Information */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex gap-3 text-slate-400">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300">Why Equalize?</h4>
                <p className="text-[11px] leading-relaxed">
                  Crescendo hardware is built on high-fidelity, dual-chamber acoustic architectures that respond dynamically to custom equalizer maps. Save your preset to sync it directly to your companion mobile app.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
