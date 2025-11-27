
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavMenu from './NavMenu';
import './globals.css';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const planeFacts = [
  { text: 'Airplanes are designed to handle turbulence with ease, and every part of the aircraft is built for safety and durability.', image: '/images/airplane-turbulence.jpg' },
  { text: 'The first commercial flight took place in 1914, between St. Petersburg and Tampa, Florida.', image: '/images/first-flight.jpg' },
  { text: 'The fastest jet in the world, the North American X-15, reached speeds of up to Mach 6.7.', image: '/images/X-15_flying.jpg' },
  { text: 'There are more than 200,000 flights per day worldwide.', image: '/images/global-flights.jpg' },
  { text: 'Most modern airplanes are equipped with advanced avionics and automation systems to assist pilots.', image: '/images/avionics.jpg' },
];

export default function DashboardPage() {
  const [progress, setProgress] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const { theme } = useTheme();
  const [sound, setSound] = useState('');
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const nextFact = () => setCurrentFactIndex((prevIndex) => (prevIndex + 1) % planeFacts.length);
  const prevFact = () => setCurrentFactIndex((prevIndex) => (prevIndex - 1 + planeFacts.length) % planeFacts.length);

  return (
    <div className={
      `h-screen flex flex-col items-center justify-start p-2 transition-all duration-500 overflow-hidden ` +
      (theme === 'dark' ? 'cozy-gradient-dark' : 'cozy-gradient-light')
    }>
      <main className={
        `max-w-5xl w-full mx-auto rounded-3xl p-2 flex flex-col gap-2 h-full overflow-hidden `
      } role="main" aria-label="Calming Dashboard">
        
        <NavMenu active="Dashboard" />

        {/* Grid layout */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full items-stretch flex-1 min-h-0 overflow-hidden mt-1">
          
          {/* Left Column */}
          <div className="flex flex-col gap-3 h-full">
            
            {/* Flight Progress Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl shadow-lg border flex-grow ${
                theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'
              }`}
            >
              <h2 className={`text-lg font-bold mb-2 flex items-center ${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'}`}>
                <span className="mr-2 text-2xl">✈️</span> Flight Progress
              </h2>
              <div className="relative w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-inner mb-2" style={{ background: `conic-gradient(#14b8a6 ${progress}%, ${theme === 'dark' ? '#374151' : '#e0f7fa'} ${progress}%)` }}>
                <div className={`absolute inset-2 rounded-full flex items-center justify-center shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <span className="text-2xl font-bold text-teal-500">{progress}%</span>
                </div>
              </div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-teal-300' : 'text-teal-600'}`}>{progress < 100 ? 'Cruising smoothly...' : 'You have arrived! 🎉'}</p>
            </motion.div>

            {/* Breathing Widget Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl shadow-lg border ${
                theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'
              }`}
            >
              <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'}`}>🌬️ Quick Breathe</h3>
              <div className="flex justify-center items-center mb-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 bg-gradient-to-br from-teal-300 to-pink-300 rounded-full shadow-lg opacity-80"
                ></motion.div>
              </div>
              <Link href="/breathing" className="w-full">
                <button
                  className={`w-full py-2 rounded-xl shadow-md text-sm font-bold transition-transform duration-150 hover:scale-105 active:scale-95 ${
                    theme === 'dark' ? 'bg-teal-700 text-teal-100 hover:bg-teal-600' : 'bg-teal-400 text-white hover:bg-teal-500'
                  }`}
                >
                  Start Session
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3 h-full">
            
            {/* Lightbox / Did You Know Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`flex flex-col items-center p-1 rounded-3xl shadow-lg border flex-grow relative overflow-hidden group ${
                theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'
              }`}
            >
              
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                <img
                  src={planeFacts[currentFactIndex].image}
                  alt="Fact Image"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <p className="text-white text-sm sm:text-base font-medium drop-shadow-md leading-relaxed">
                    {planeFacts[currentFactIndex].text}
                  </p>
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => { e.stopPropagation(); prevFact(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
                  aria-label="Previous fact"
                >
                  <span className="text-xl">❮</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextFact(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
                  aria-label="Next fact"
                >
                  <span className="text-xl">❯</span>
                </button>
              </div>
            </motion.div>

            {/* Ambient Sounds Mini-Player */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-3 rounded-3xl shadow-lg border ${
                theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/60'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'}`}>🎵 Ambient Sounds</h3>
                <Link href="/sounds" className={`text-xs font-semibold hover:underline ${theme === 'dark' ? 'text-pink-300' : 'text-pink-500'}`}>View All</Link>
              </div>
              <div className="flex gap-2 justify-between">
                {['rain', 'ocean', 'white'].map(s => (
                  <button
                    key={s}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      sound === s 
                        ? 'bg-pink-500 text-white shadow-md scale-105' 
                        : (theme === 'dark' ? 'bg-gray-700 text-pink-200 hover:bg-gray-600' : 'bg-pink-100 text-pink-600 hover:bg-pink-200')
                    }`}
                    onClick={() => setSound(sound === s ? '' : s)}
                  >
                    {s === 'rain' ? '🌧️ Rain' : s === 'ocean' ? '🌊 Ocean' : '📻 White'}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
