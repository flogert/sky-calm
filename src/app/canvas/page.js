"use client";

import React, { useState, useRef, useEffect } from 'react';
import NavMenu from '../NavMenu';
import '../globals.css';
import { useTheme } from '../ThemeContext';

const quotes = [
  'Let your creativity take flight!',
  'Every stroke is a step toward calm.',
  'Draw your worries away.',
  'Art is the best therapy.',
  'Relax and let your imagination soar.'
];

function DrawingCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#14b8a6');
  const [lineWidth, setLineWidth] = useState(5);
  const [quote, setQuote] = useState('Let your creativity take flight!');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [shape, setShape] = useState('free');

  // Touch support for mobile
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const updateCursor = (e) => {
    if (!cursorRef.current) return;
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
    cursorRef.current.style.width = `${lineWidth}px`;
    cursorRef.current.style.height = `${lineWidth}px`;
    cursorRef.current.style.backgroundColor = color;
  };

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { x, y } = getPos(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setUndoStack((stack) => [...stack, context.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoStack([]);
    updateCursor(e);
  };

  const draw = (e) => {
    updateCursor(e);
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { x, y } = getPos(e);
    
    if (shape === 'free') {
      context.lineTo(x, y);
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = 'round';
      context.stroke();
    } else if (shape === 'circle') {
      // For shapes, we might want to clear and redraw (preview) but for now simple stamp
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.arc(x, y, 24, 0, 2 * Math.PI);
      context.stroke();
      setIsDrawing(false); // Single stamp
    } else if (shape === 'square') {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.rect(x - 18, y - 18, 36, 36);
      context.stroke();
      setIsDrawing(false); // Single stamp
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setUndoStack([]);
    setRedoStack([]);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const last = undoStack[undoStack.length - 1];
      setRedoStack((stack) => [...stack, context.getImageData(0, 0, canvas.width, canvas.height)]);
      context.putImageData(last, 0, 0);
      setUndoStack((stack) => stack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const next = redoStack[redoStack.length - 1];
      setUndoStack((stack) => [...stack, context.getImageData(0, 0, canvas.width, canvas.height)]);
      context.putImageData(next, 0, 0);
      setRedoStack((stack) => stack.slice(0, -1));
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'sky-calm-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
        // Make canvas fill the container
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className={
      `h-screen flex flex-col items-center justify-start p-2 transition-all duration-500 overflow-hidden ` +
      (theme === 'dark' ? 'cozy-gradient-dark' : 'cozy-gradient-light')
    }>
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference border border-white"
        style={{ width: lineWidth, height: lineWidth, transform: 'translate(-50%, -50%)' }}
      />

      <main className={
        `max-w-5xl w-full mx-auto rounded-3xl p-2 flex flex-col gap-2 h-full overflow-hidden `
      } role="main" aria-label="Drawing Canvas">
        
        <NavMenu active="Canvas" />

        <div className="flex flex-col gap-2 flex-grow overflow-hidden">
            
            {/* Canvas Area */}
            <div className={`
                flex-grow relative rounded-3xl overflow-hidden shadow-inner cursor-none touch-none
                ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
            `}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full"
                />
            </div>

            {/* Tools Bar (Bottom) */}
            <aside className={`
                flex flex-col gap-2 p-2 rounded-xl items-center justify-center flex-shrink-0 w-full
                ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'}
            `}>
                {/* Row 1: Shapes & Colors */}
                <div className="flex flex-wrap justify-center gap-4 items-center w-full">
                    {/* Shapes */}
                    <div className="flex gap-2 items-center shrink-0">
                        {['free', 'circle', 'square'].map(s => (
                            <button
                                key={s}
                                onClick={() => setShape(s)}
                                className={`p-2 rounded-lg transition-all ${shape === s ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                aria-label={`Select shape ${s}`}
                            >
                                {s === 'free' ? '✏️' : s === 'circle' ? '⭕' : '⬜'}
                            </button>
                        ))}
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-gray-300 shrink-0" />

                    {/* Colors */}
                    <div className="flex gap-2 items-center shrink-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
                            <input 
                                type="color" 
                                value={color} 
                                onChange={(e) => setColor(e.target.value)}
                                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                                aria-label="Custom color picker"
                            />
                        </div>
                        <div className="flex gap-1.5">
                            {['#14b8a6', '#f472b6', '#fbbf24', '#60a5fa', '#000000'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Row 2: Size & Actions */}
                <div className="flex flex-wrap justify-center gap-4 items-center w-full">
                    {/* Brush Size */}
                    <div className="flex gap-2 items-center shrink-0">
                        <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Size</span>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={lineWidth} 
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                            className="w-32 accent-teal-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            aria-label="Brush size"
                        />
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-gray-300 shrink-0" />

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <button onClick={undo} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg shadow-sm" aria-label="Undo">↩️</button>
                        <button onClick={saveDrawing} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-lg shadow-sm text-blue-600" aria-label="Save">💾</button>
                        <button onClick={clearCanvas} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-lg shadow-sm text-red-600" aria-label="Clear">🗑️</button>
                    </div>
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
}

export default DrawingCanvas;
