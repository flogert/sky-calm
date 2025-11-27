"use client";

import { useState, useRef, useEffect } from "react";
import NavMenu from '../NavMenu';
import '../globals.css';
import { motion } from "framer-motion";
import { useTheme } from '../ThemeContext';

const quotes = [
  'Let the sounds wash over you.',
  'Relax and breathe with the rain.',
  'Ocean waves bring calm.',
  'White noise for deep focus.',
  'Take a moment for yourself.',
  'Nature sounds soothe the soul.',
  'Find your peace.'
];

const sounds = [
  { key: 'rain', label: 'Rain', icon: '🌧️', color: 'bg-blue-100', activeColor: 'bg-blue-300', file: '/sounds/rain.wav' },
  { key: 'ocean', label: 'Ocean', icon: '🌊', color: 'bg-cyan-100', activeColor: 'bg-cyan-300', file: '/sounds/ocean.wav' },
  { key: 'whiteNoise', label: 'White Noise', icon: '📻', color: 'bg-gray-100', activeColor: 'bg-gray-300', file: '/sounds/whiteNoise.wav' },
  { key: 'forest', label: 'Forest', icon: '🌲', color: 'bg-green-100', activeColor: 'bg-green-300', file: '/sounds/forest.wav' },
];

export default function Sounds() {
  // Creating refs for audio elements
  const rainAudio = useRef(null);
  const oceanAudio = useRef(null);
  const whiteNoiseAudio = useRef(null);
  const forestAudio = useRef(null);

  // Cozy features state
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState({ rain: false, ocean: false, whiteNoise: false, forest: false });
  const [volume, setVolume] = useState(0.5);
  const [quote, setQuote] = useState('Let the sounds wash over you.');
  const [mixMode, setMixMode] = useState(false);

  // Initialize audio refs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
        rainAudio.current = new Audio('/sounds/rain.wav');
        oceanAudio.current = new Audio('/sounds/ocean.wav');
        whiteNoiseAudio.current = new Audio('/sounds/whiteNoise.wav');
        forestAudio.current = new Audio('/sounds/forest.wav');
        [rainAudio, oceanAudio, whiteNoiseAudio, forestAudio].forEach(ref => {
        if (ref.current) ref.current.loop = true;
        });
    }
    return () => {
      [rainAudio, oceanAudio, whiteNoiseAudio, forestAudio].forEach(ref => {
        if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
      });
    };
  }, []);

  // Update volume on all playing sounds
  useEffect(() => {
    [rainAudio, oceanAudio, whiteNoiseAudio, forestAudio].forEach(ref => {
      if (ref.current) ref.current.volume = volume;
    });
  }, [volume]);

  const getAudioRef = (key) => {
    if (key === 'rain') return rainAudio;
    if (key === 'ocean') return oceanAudio;
    if (key === 'whiteNoise') return whiteNoiseAudio;
    if (key === 'forest') return forestAudio;
    return null;
  };

  const handlePlaySound = (key) => {
    const audioRef = getAudioRef(key);
    if (!audioRef || !audioRef.current) return;
    if (!mixMode) {
      // Stop all other sounds
      sounds.forEach(s => {
        if (s.key !== key) {
          const ref = getAudioRef(s.key);
          if (ref && ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
        }
      });
      setIsPlaying(prev => {
        const newState = { rain: false, ocean: false, whiteNoise: false, forest: false };
        newState[key] = !prev[key];
        return newState;
      });
    } else {
      setIsPlaying(prev => ({ ...prev, [key]: !prev[key] }));
    }
    
    // We need to check the *next* state, but since state update is async, we check the current state and invert logic or use a timeout. 
    // Actually, simpler to just check if it WAS playing, then we are pausing. If it WAS NOT playing, we are playing.
    const willPlay = !isPlaying[key];

    if (willPlay) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const stopAll = () => {
    sounds.forEach(s => {
      const ref = getAudioRef(s.key);
      if (ref && ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
    });
    setIsPlaying({ rain: false, ocean: false, whiteNoise: false, forest: false });
  };

  return (
    <div className={
      `h-screen flex flex-col items-center justify-start p-2 transition-all duration-500 overflow-hidden ` +
      (theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-rose-50 text-rose-900')
    }>
      <main className={
        `max-w-5xl w-full mx-auto rounded-3xl p-2 flex flex-col gap-2 h-full overflow-hidden `
      } role="main" aria-label="Soundscapes">
        
        <NavMenu active="Sounds" />

        {/* Main Content Section */}
        <div className={`
            flex-grow flex flex-col items-center justify-center rounded-3xl shadow-lg border relative overflow-hidden
            ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-white/60'}
        `}>
            
            {/* Header & Quote */}
            <div className="text-center mb-6 flex-none">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Soundscapes</h1>
                <p className={`text-sm md:text-base italic opacity-80 transition-opacity duration-500`}>
                    {quote}
                </p>
            </div>

            {/* Sounds Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8 p-6 flex-none">
                {sounds.map((s) => (
                    <motion.button
                        key={s.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePlaySound(s.key)}
                        className={`
                            relative group flex flex-col items-center justify-center 
                            aspect-square rounded-3xl transition-all duration-300
                            ${isPlaying[s.key] ? s.activeColor : (theme === 'dark' ? 'bg-slate-800' : 'bg-white')}
                            ${isPlaying[s.key] ? 'shadow-inner' : 'shadow-lg hover:shadow-xl'}
                        `}
                    >
                        <span className="text-4xl md:text-5xl mb-3 filter drop-shadow-sm">{s.icon}</span>
                        <span className={`font-medium ${isPlaying[s.key] ? 'font-bold' : ''}`}>
                            {s.label}
                        </span>
                        {isPlaying[s.key] && (
                            <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Controls Bar */}
            <div className={`
                flex flex-col md:flex-row items-center gap-6 p-4 rounded-3xl w-full max-w-2xl
                ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/60'} backdrop-blur-sm
            `}>
                {/* Mix Mode Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`
                        w-12 h-7 rounded-full p-1 transition-colors duration-300
                        ${mixMode ? 'bg-green-400' : 'bg-gray-300'}
                    `}>
                        <div className={`
                            w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300
                            ${mixMode ? 'translate-x-5' : 'translate-x-0'}
                        `} />
                    </div>
                    <input 
                        type="checkbox" 
                        checked={mixMode} 
                        onChange={() => setMixMode(!mixMode)} 
                        className="hidden"
                    />
                    <span className="text-sm font-medium">Mix Mode</span>
                </label>

                <div className="h-8 w-px bg-current opacity-10 hidden md:block" />

                {/* Volume Control */}
                <div className="flex items-center gap-3 flex-grow w-full md:w-auto">
                    <span className="text-lg">🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-400"
                    />
                </div>

                <div className="h-8 w-px bg-current opacity-10 hidden md:block" />

                {/* Stop All */}
                <button 
                    onClick={stopAll}
                    className={`
                        px-4 py-2 rounded-xl text-sm font-bold transition-colors
                        ${theme === 'dark' 
                            ? 'bg-red-900/30 text-red-200 hover:bg-red-900/50' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'}
                    `}
                >
                    Stop All
                </button>
            </div>

        </div>
      </main>
    </div>
  );
}




