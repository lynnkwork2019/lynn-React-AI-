import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Audio play error:", err);
            setError("Playback failed. Please try again.");
            setIsPlaying(false);
          });
      }
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setError(null);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setError(null);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Auto-play failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (!isNaN(total)) {
        setProgress((current / total) * 100);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(duration)) {
      audioRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center h-full px-8 gap-10 bg-black relative border-t-2 border-accent-cyan/20">
      <audio
        key={currentTrack.url}
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={skipForward}
        onError={() => setError("DATA_SOURCE_INVALID")}
        onCanPlay={() => setError(null)}
      />

      <div className="flex items-center gap-4 w-[240px] shrink-0">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-14 h-14 flex-shrink-0 bg-accent-magenta p-1 shadow-[4px_4px_0px_#00ffff]"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale-[0.8] contrast-[1.2]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-accent-cyan truncate uppercase leading-none">{currentTrack.title}</h3>
            {error && <div className="text-[10px] text-accent-magenta animate-pulse font-mono tracking-tighter" title={error}>!WARN</div>}
          </div>
          <p className="text-accent-magenta text-[10px] truncate font-mono uppercase tracking-[0.2em]">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={skipBackward}
          className="p-2 border-2 border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-black transition-all"
          id="prev-btn"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-accent-magenta text-black hover:scale-105 active:scale-95 transition-all shadow-[6px_6px_0px_#00ffff]"
          id="play-pause-btn"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
        </button>

        <button
          onClick={skipForward}
          className="p-2 border-2 border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-black transition-all"
          id="next-btn"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="relative h-2 w-full bg-accent-cyan/10 border border-accent-cyan/20 cursor-pointer">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-accent-magenta shadow-[0_0_15px_#ff00ff] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-accent-cyan/40 uppercase tracking-widest">
          <span>BUFF: {formatTime((progress / 100) * duration)}</span>
          <span className={error ? "text-accent-magenta" : ""}>{error ? "STREAM_FATAL" : `DUR: ${formatTime(duration)}`}</span>
        </div>
      </div>

      <div className="w-[180px] shrink-0 flex items-center gap-4 border-l-2 border-accent-cyan/10 pl-6">
        <Volume2 size={16} className="text-accent-cyan/50" />
        <div className="flex-1 h-1.5 bg-accent-cyan/10 relative group cursor-pointer border border-accent-cyan/20">
           <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-accent-cyan shadow-[0_0_10px_#00ffff]" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};


export default MusicPlayer;
