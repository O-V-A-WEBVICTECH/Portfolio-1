import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles, Trophy } from 'lucide-react';
import heroImg from '../assets/images/crescendo_hero_1782901331827.jpg';

interface HeroProps {
  onShopClick: () => void;
  onEQClick: () => void;
}

export default function Hero({ onShopClick, onEQClick }: HeroProps) {
  return (
    <section id="hero-section" className="pt-28 pb-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Showcase Card Container */}
        <div className="bg-gradient-to-r from-blue-750 via-blue-700 to-blue-600 rounded-[2rem] md:rounded-[2.5rem] text-white overflow-hidden shadow-2xl relative border border-blue-550/40">
          
          {/* Subtle background pattern elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/40 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 p-8 md:p-14 lg:p-20 relative z-10">
            
            {/* Left Content Block (7/12 cols) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
              
              {/* Premium Floating Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Trophy size={13} className="text-amber-300" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                  Crescendo Signature Series 2026
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-[1.05]">
                Elevate Your <br className="hidden sm:block" />
                <span className="text-sky-200">Audio Journey</span>
              </h1>

              {/* Subtext */}
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-xl">
                Experience sound in its purest, most authentic form. Our dual-chamber acoustic drivers, lossless wireless codecs, and customized adaptive ambient filters converge to engineer a pristine, live-room soundstage.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                
                {/* Shop Now */}
                <button
                  id="btn-hero-shop"
                  onClick={onShopClick}
                  className="bg-white hover:bg-slate-50 text-blue-700 font-bold px-7 py-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  Shop Now
                  <ArrowRight size={13} className="stroke-[2.5px]" />
                </button>

                {/* Interactive EQ Simulator Link */}
                <button
                  id="btn-hero-eq"
                  onClick={onEQClick}
                  className="bg-blue-800/30 hover:bg-blue-800/50 text-white font-semibold px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <Play size={12} fill="currentColor" />
                  Test Acoustics Simulator
                </button>

              </div>

              {/* Features inline list */}
              <div className="pt-6 md:pt-10 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <span className="font-mono text-xl md:text-2xl font-black block text-sky-200">45h</span>
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Battery Playback</span>
                </div>
                <div>
                  <span className="font-mono text-xl md:text-2xl font-black block text-sky-200">0.02s</span>
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Ultra-Low Latency</span>
                </div>
                <div>
                  <span className="font-mono text-xl md:text-2xl font-black block text-sky-200">IPX7</span>
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Waterproof Shield</span>
                </div>
              </div>

            </div>

            {/* Right Photo Block (5/12 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full">
                
                {/* Visual ring effects */}
                <div className="absolute inset-0 bg-blue-550 rounded-full filter blur-2xl opacity-40 animate-pulse scale-90" />
                
                {/* Frame with border */}
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-16/10 sm:aspect-square lg:aspect-auto">
                  <img
                    src={heroImg}
                    alt="Crescendo Signature Headphones Showcase"
                    className="w-full h-full object-cover select-none object-center"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Decorative glowing floating pill */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-2.5 shadow-lg">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                    </span>
                    <span className="font-mono text-[10px] text-sky-200 font-bold tracking-wider">HYBRID ANC ENGAGED</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
