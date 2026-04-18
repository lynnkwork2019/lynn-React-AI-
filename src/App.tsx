/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { TRACKS } from './constants';

export default function App() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden selection:bg-accent-magenta selection:text-black relative flex flex-col font-sans">
      <div className="scanline" />
      <div className="noise" />

      {/* Main Grid Shell */}
      <div className="flex-1 grid grid-cols-[300px_1fr_300px] overflow-hidden divide-x-2 divide-accent-cyan/20">
        
        {/* Left: Terminal Sidebar */}
        <aside className="bg-black/80 flex flex-col p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-accent-magenta text-xs tracking-[0.3em] font-serif mb-2 uppercase glitch-tear">SYSTEM_PLAYLIST</h2>
            <div className="h-px bg-gradient-to-r from-accent-magenta to-transparent" />
          </div>

          <div className="space-y-4">
            {TRACKS.map((track, i) => (
              <div 
                key={track.id}
                className="group p-4 border-2 border-transparent hover:border-glitch bg-accent-cyan/5 transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-mono text-accent-magenta">MOD_{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-1 h-1 bg-accent-cyan animate-pulse" />
                </div>
                <h3 className="text-xl leading-none font-sans uppercase group-hover:text-accent-magenta transition-colors">{track.title}</h3>
                <p className="text-accent-cyan/40 text-[10px] mt-1 uppercase tracking-wider">{track.artist}</p>
                <div className="absolute top-0 right-0 w-8 h-px bg-accent-magenta opacity-0 group-hover:opacity-100 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="p-3 border-2 border-accent-cyan/20 bg-accent-cyan/5">
              <p className="text-[10px] text-accent-cyan/50 leading-relaxed uppercase">
                STATUS: DATA_STREAM_STABLE<br/>
                ENCRYPTION: 128-BIT_CYPHER<br/>
                USER: SESSION_NODE_{Math.random().toString(36).substring(7).toUpperCase()}
              </p>
            </div>
          </div>
        </aside>

        {/* Center: Logic Engine */}
        <main className="relative flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,#050505_0%,#000000_100%)]">
          <div className="absolute top-6 left-6 text-accent-magenta/30 text-[10px] uppercase font-mono tracking-tighter">
            PROBABILITY_ENGINE_v4.1 // BUFFER: 1024KB
          </div>
          <div className="relative border-4 border-accent-cyan p-1 bg-black shadow-[10px_10px_0px_#ff00ff]">
             <SnakeGame />
          </div>
          <div className="absolute bottom-6 text-[10px] text-accent-cyan/30 animate-pulse tracking-[0.5em] uppercase">
            NEURAL_INPUT_REQUIRED // NAV_ARROWS_ACTIVE
          </div>
        </main>

        {/* Right: Signal Analyzer */}
        <aside className="bg-black/80 flex flex-col p-6 divide-y-2 divide-accent-cyan/10 overflow-y-auto">
          <section className="pb-8">
            <h2 className="text-accent-magenta text-xs tracking-[0.3em] font-serif mb-6 uppercase glitch-tear">SPECTRAL_FLUX</h2>
            <div className="flex items-end justify-between h-32 gap-1 px-2 mb-4 bg-accent-cyan/5 border-2 border-accent-cyan/20">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-full bg-accent-cyan opacity-40 animate-pulse"
                  style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-accent-cyan/50">
              <div className="flex justify-between"><span>KHZ</span><span>19.4</span></div>
              <div className="flex justify-between"><span>AMP</span><span>0.85</span></div>
              <div className="flex justify-between"><span>SRC</span><span>EXT_01</span></div>
              <div className="flex justify-between"><span>BPM</span><span>120.0</span></div>
            </div>
          </section>

          <section className="py-8">
            <h2 className="text-accent-cyan text-xs tracking-[0.3em] font-serif mb-4 uppercase">PROTOCOL_CMD</h2>
            <ul className="space-y-3 text-[11px] font-mono text-white/50 uppercase">
              <li className="flex items-start gap-2">
                <span className="text-accent-magenta">0x01</span>
                <span>EXECUTE_SLITHER_SEQUENCE (ARROWS)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-magenta">0x02</span>
                <span>CONSUME_CYBER_NODES (MAGENTA)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-magenta">0x03</span>
                <span>ACCELERATE_CLOCK_FREQ</span>
              </li>
            </ul>
          </section>

          <section className="pt-8 mt-auto">
             <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col">
                 <span className="text-[10px] text-accent-magenta uppercase mb-1">Status</span>
                 <span className="text-sm text-accent-lime font-bold uppercase animate-pulse">Synced</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-accent-magenta uppercase mb-1">Network</span>
                 <span className="text-sm text-accent-cyan font-bold uppercase">Grid_Core</span>
               </div>
             </div>
          </section>
        </aside>
      </div>

      {/* Footer: Oscilloscope Player */}
      <footer className="h-[120px] bg-black border-t-4 border-accent-magenta/30 relative z-50">
        <MusicPlayer />
      </footer>
    </div>
  );
}



