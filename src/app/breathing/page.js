// pages/breathing.js

"use client";

import { useState, useEffect, useRef } from 'react';
import NavMenu from '../NavMenu';
import '../globals.css';
import { useTheme } from '../ThemeContext';
import { motion } from 'framer-motion';

// Motivational quotes
const quotes = [
  'Breathe deeply, let calm fill you.',
  'Inhale peace, exhale stress.',
  'Let your breath anchor you.',
  'Every breath is a new beginning.',
  'Relax, you are here now.',
  'You are safe. You are calm.',
  'Feel the rhythm of your breath.'
];

function BreathingPage() {
  const { theme } = useTheme();
  
  // Breathing patterns
  const patterns = {
    relax: { name: 'Relax (4-7-8)', inhale: 4, hold: 7, exhale: 8, color: 'from-blue-200 to-indigo-200' },
    balance: { name: 'Balance (Box)', inhale: 4, hold: 4, exhale: 4, color: 'from-green-200 to-teal-200' },
    focus: { name: 'Focus (4-2-4)', inhale: 4, hold: 2, exhale: 4, color: 'from-orange-200 to-amber-200' },
  };

  const [pattern, setPattern] = useState('relax');
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [timer, setTimer] = useState(0);
  const [quote, setQuote] = useState('Breathe deeply, let calm fill you.');
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef();

  const currentPattern = patterns[pattern];

  // Breathing phase logic
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    
    const { inhale, hold, exhale } = currentPattern;
    let duration = phase === 'inhale' ? inhale : phase === 'hold' ? hold : exhale;
    
    if (timer >= duration) {
      if (phase === 'inhale') {
        setPhase(hold > 0 ? 'hold' : 'exhale');
      } else if (phase === 'hold') {
        setPhase('exhale');
      } else {
        setPhase('inhale');
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }
      setTimer(0);
      // Mobile vibration cue
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(phase === 'inhale' ? 50 : 30);
      }
    }
  }, [timer, phase, currentPattern, isRunning]);

  const circleSize = phase === 'inhale' ? '16rem' : phase === 'exhale' ? '8rem' : '12rem';

  return (
    <div className={
      `h-screen flex flex-col items-center justify-start p-2 transition-all duration-500 overflow-hidden ` +
      (theme === 'dark' ? 'cozy-gradient-dark' : 'cozy-gradient-light')
    }>
      <main className={
        `max-w-5xl w-full mx-auto rounded-3xl p-2 flex flex-col gap-2 h-full overflow-hidden `
      } role="main" aria-label="Breathing Exercise">
        
        <NavMenu active="Breathing" />

        {/* Main Content Card */}
        <div className={`flex-grow flex flex-col items-center justify-center rounded-3xl shadow-lg border relative overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'
        }`}>
            
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentPattern.color} transition-colors duration-1000`} />

            {/* Header */}
            <div className="z-10 text-center mb-8">
                <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-teal-100' : 'text-teal-800'}`}>
                    {phase === 'inhale' ? 'Inhale...' : phase === 'hold' ? 'Hold...' : 'Exhale...'}
                </h1>
                <p className={`text-sm italic opacity-80 ${theme === 'dark' ? 'text-teal-200' : 'text-teal-600'}`}>
                    {quote}
                </p>
            </div>

            {/* Breathing Circle */}
            <div className="relative z-10 flex items-center justify-center h-64 w-64">
                {/* Outer Ring */}
                <motion.div 
                    animate={{ 
                        width: phase === 'inhale' ? 250 : phase === 'exhale' ? 150 : 200,
                        height: phase === 'inhale' ? 250 : phase === 'exhale' ? 150 : 200,
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: phase === 'inhale' ? currentPattern.inhale : phase === 'exhale' ? currentPattern.exhale : currentPattern.hold, ease: "easeInOut" }}
                    className={`absolute rounded-full border-4 ${theme === 'dark' ? 'border-teal-500/30' : 'border-teal-300/50'}`}
                />
                
                {/* Inner Circle */}
                <motion.div
                    animate={{ 
                        scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 1 : 1.2,
                    }}
                    transition={{ duration: phase === 'inhale' ? currentPattern.inhale : phase === 'exhale' ? currentPattern.exhale : currentPattern.hold, ease: "easeInOut" }}
                    className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-sm ${
                        theme === 'dark' 
                        ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white' 
                        : 'bg-gradient-to-br from-teal-200 to-blue-200 text-teal-800'
                    }`}
                >
                    <span className="text-4xl">
                        {phase === 'inhale' ? '🌸' : phase === 'hold' ? '✨' : '🍃'}
                    </span>
                </motion.div>
            </div>

            {/* Controls & Pattern Selector */}
            <div className="z-10 mt-8 flex flex-col items-center gap-4 w-full max-w-md px-4">
                
                {/* Play/Pause */}
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-8 py-3 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 ${
                        isRunning 
                        ? (theme === 'dark' ? 'bg-yellow-600/80 text-yellow-100 hover:bg-yellow-600' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200')
                        : (theme === 'dark' ? 'bg-green-600/80 text-green-100 hover:bg-green-600' : 'bg-green-100 text-green-700 hover:bg-green-200')
                    }`}
                >
                    {isRunning ? '⏸️ Pause Session' : '▶️ Resume Session'}
                </button>
            </div>

        </div>
      </main>
    </div>
  );
}

export default BreathingPage;
