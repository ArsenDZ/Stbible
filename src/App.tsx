import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronLeft, ChevronRight, Moon, Sun, BookOpen, Flame } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { bookContent } from './data/book';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BloodDrip = () => {
  const drips = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 12,
    left: `${(i / 30) * 100}%`,
    width: 20 + Math.random() * 40,
    height: 42.5, // Target 1.7/4 = 42.5% of viewport
  })), []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[60vh] pointer-events-none z-1 overflow-hidden opacity-60">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blood-flow-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a0000" />
            <stop offset="60%" stopColor="#8b0000" />
            <stop offset="100%" stopColor="#2a0000" stopOpacity="0" />
          </linearGradient>
          <filter id="blood-gloss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.7" specularExponent="35" lightingColor="#ff0000" result="spec">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
        {drips.map((drip) => (
          <motion.path
            key={drip.id}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ 
              scaleY: [0, 1, 1],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: drip.duration,
              repeat: Infinity,
              ease: "linear",
              delay: drip.delay,
              times: [0, 0.7, 1]
            }}
            d={`M ${parseFloat(drip.left)} 0 
               Q ${parseFloat(drip.left) + drip.width/2} ${drip.height}vh 
                 ${parseFloat(drip.left) + drip.width} 0 Z`}
            fill="url(#blood-flow-grad)"
            filter="url(#blood-gloss)"
            style={{ originY: 0 }}
          />
        ))}
        {/* Top pooling blood that also pulses */}
        <motion.rect 
          width="100%" 
          height="60" 
          fill="#4a0000" 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

const FogEffect = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div 
      animate={{ 
        x: [-30, 30, -30],
        y: [-15, 15, -15],
        opacity: [0.1, 0.25, 0.1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="fog-layer" 
    />
    <motion.div 
      animate={{ 
        x: [30, -30, 30],
        y: [15, -15, 15],
        opacity: [0.05, 0.15, 0.05]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="fog-layer" 
      style={{ background: 'radial-gradient(circle at center, rgba(40, 0, 0, 0.05) 0%, transparent 60%)' }}
    />
  </div>
);

export default function App() {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  const currentChapter = bookContent[currentChapterIndex];

  const nextChapter = () => {
    if (currentChapterIndex < bookContent.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextChapter();
      if (e.key === 'ArrowLeft') prevChapter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-1000 selection:bg-red-950 selection:text-white",
      isDarkMode ? "bg-[#050505] text-[#e0e0e0]" : "bg-[#f0f0f0] text-[#1a1a1a]"
    )}>
      <AnimatePresence>
        {isSplashActive ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => setIsSplashActive(false)}
          >
            <FogEffect />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center gap-8"
            >
              <div className="relative group">
                {/* Inverted Pentagram SVG */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="text-red-700 group-hover:text-red-600 transition-colors duration-700 drop-shadow-[0_0_15px_rgba(185,28,28,0.4)]">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <path 
                    d="M 100 182 L 148 35 L 20 125 L 180 125 L 52 35 Z" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    strokeLinejoin="round"
                  />
                </svg>
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-red-600/20 blur-[40px] rounded-full -z-10"
                />
              </div>
              <motion.p 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-red-900 uppercase tracking-[0.8em] text-[10px] font-black"
              >
                Нажми, чтобы войти
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <BloodDrip />
            <FogEffect />
            <div className="vignette" />

            {/* Navigation Header */}
            <header className={cn(
              "fixed top-0 left-0 right-0 z-40 border-b transition-all duration-500",
              isDarkMode ? "bg-black/60 border-white/5" : "bg-white/60 border-black/5",
              "backdrop-blur-xl"
            )}>
              <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    id="menu-toggle"
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-3 hover:bg-red-950/30 rounded-full transition-all group"
                  >
                    <Menu size={24} className="group-hover:text-red-500 transition-colors" />
                  </button>
                  <div className="flex items-center gap-3 font-sans font-bold tracking-tighter text-lg uppercase horror-glow">
                    <Flame size={20} className="text-red-600 animate-pulse" />
                    <span>The Unholy Word</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                    <button 
                      id="font-decrease"
                      onClick={() => setFontSize(s => Math.max(14, s - 2))}
                      className="px-3 py-1 text-xs font-bold hover:text-red-500 transition-colors"
                    >
                      A-
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button 
                      id="font-increase"
                      onClick={() => setFontSize(s => Math.min(24, s + 2))}
                      className="px-3 py-1 text-xs font-bold hover:text-red-500 transition-colors"
                    >
                      A+
                    </button>
                  </div>
                  <button 
                    id="theme-toggle"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-3 hover:bg-red-950/30 rounded-full transition-all group border border-white/5"
                  >
                    {isDarkMode ? <Sun size={20} className="group-hover:text-yellow-500" /> : <Moon size={20} className="group-hover:text-red-500" />}
                  </button>
                </div>
              </div>
            </header>

            {/* Sidebar Navigation */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                  />
                  <motion.aside 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={cn(
                      "fixed top-0 left-0 bottom-0 w-80 z-50 shadow-[0_0_50px_rgba(139,0,0,0.2)] border-r border-white/5",
                      isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-white text-black"
                    )}
                  >
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-16">
                        <h2 className="font-sans font-black text-2xl uppercase tracking-tighter horror-glow">Index</h2>
                        <button 
                          id="close-sidebar"
                          onClick={() => setIsSidebarOpen(false)}
                          className="p-2 hover:bg-red-950/30 rounded-full transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <nav className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {bookContent.map((chapter, index) => (
                          <button
                            key={chapter.id}
                            onClick={() => {
                              setCurrentChapterIndex(index);
                              setIsSidebarOpen(false);
                              window.scrollTo(0, 0);
                            }}
                            className={cn(
                              "w-full text-left px-5 py-4 rounded-none transition-all text-sm flex items-start gap-4 border-l-2",
                              currentChapterIndex === index 
                                ? "bg-red-950/20 border-red-600 text-red-500 font-bold"
                                : "border-transparent hover:bg-white/5 opacity-60 hover:opacity-100"
                            )}
                          >
                            <span className="opacity-30 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                            <span className="uppercase tracking-widest text-[10px] font-bold">{chapter.title}</span>
                          </button>
                        ))}
                      </nav>

                      <div className="mt-auto pt-8 border-t border-white/5 opacity-30 text-[9px] uppercase tracking-[0.4em] text-center font-bold">
                        Sinister Archives • MCMLXVIII
                      </div>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="pt-48 pb-48 px-6 relative">
              <div className="reading-container">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={currentChapter.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-16"
                  >
                    <div className="space-y-6 text-center mb-24">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60px" }}
                        className="h-1 bg-red-600 mx-auto mb-8"
                      />
                      <motion.h1 
                        className="text-5xl sm:text-7xl font-sans font-black uppercase tracking-tighter horror-glow leading-none"
                      >
                        {currentChapter.title}
                      </motion.h1>
                      {currentChapter.subtitle && (
                        <p className="text-xs uppercase tracking-[0.5em] text-red-600 font-black opacity-80">
                          {currentChapter.subtitle}
                        </p>
                      )}
                    </div>

                    <div 
                      className="space-y-10 leading-[1.8] font-light tracking-wide text-justify"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {currentChapter.content.map((paragraph, i) => (
                        <motion.p 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className={cn(
                            "transition-all duration-700",
                            paragraph.match(/^\d+\./) ? "text-red-500/90 font-bold border-l-2 border-red-900/30 pl-6 py-2" : "opacity-70 hover:opacity-100"
                          )}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>

                    {/* Chapter Navigation Footer */}
                    <footer className="pt-32 flex flex-col sm:flex-row items-center justify-between gap-12 border-t border-white/5">
                      <button
                        id="prev-chapter"
                        onClick={prevChapter}
                        disabled={currentChapterIndex === 0}
                        className="flex items-center gap-4 px-8 py-4 rounded-none bg-white/5 border border-white/10 hover:bg-red-950/20 hover:border-red-900/50 disabled:opacity-5 transition-all group w-full sm:w-auto"
                      >
                        <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform text-red-600" />
                        <span className="text-sm font-black uppercase tracking-widest">Previous Rite</span>
                      </button>

                      <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
                        {currentChapterIndex + 1} / {bookContent.length}
                      </div>

                      <button
                        id="next-chapter"
                        onClick={nextChapter}
                        disabled={currentChapterIndex === bookContent.length - 1}
                        className="flex items-center gap-4 px-8 py-4 rounded-none bg-white/5 border border-white/10 hover:bg-red-950/20 hover:border-red-900/50 disabled:opacity-5 transition-all group w-full sm:w-auto"
                      >
                        <span className="text-sm font-black uppercase tracking-widest">Next Rite</span>
                        <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform text-red-600" />
                      </button>
                    </footer>
                  </motion.article>
                </AnimatePresence>
              </div>
            </main>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-1 z-40 bg-white/5">
              <motion.div 
                className="h-full bg-red-600 origin-left shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (currentChapterIndex + 1) / bookContent.length }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
