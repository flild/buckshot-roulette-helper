'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuckshot } from '@/hooks/useBuckshot';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Flame, Trophy, Undo2, RefreshCw, Eye, Swords, Shield } from 'lucide-react';
import { ShellType, Shot } from '@/lib/types';

// ==========================================
// HELPERS
// ==========================================
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Page() {
  const { state, hydrated, startRound, shoot, undo, endRound, toggleViewMode, setKnownShell } = useBuckshot();
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Monitor 7 win streak
  useEffect(() => {
    if (state.streak === 7 && state.mode === 'setup') {
      // eslint-disable-next-line
      setShowWinAnimation(true);
      const t = setTimeout(() => setShowWinAnimation(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state.streak, state.mode]);

  useKeyboardShortcuts({
    shoot,
    undo,
    toggleViewMode,
    reset: () => endRound('abandoned'),
    newRound: () => {}, // Handled by buttons in setup
    isSetup: state.mode === 'setup'
  });

  if (!hydrated) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-mono">ЗАГРУЗКА ТЕРМИНАЛА...</div>;
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono selection:bg-[#ff2e2e] selection:text-black flex flex-col overflow-x-hidden">
      
      {/* 7 WINS CELEBRATION */}
      <AnimatePresence>
        {showWinAnimation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
          >
            <div className="text-center">
              <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
              <h2 className="text-5xl font-black text-yellow-500 tracking-wider mb-2 uppercase">Достижение получено</h2>
              <p className="text-2xl text-yellow-200 font-mono">7 побед подряд</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 relative z-10">
        
        {/* TOP BAR */}
        <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-[#222] bg-[#0a0a0a] gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-[#ff2e2e] text-xl font-black tracking-tighter uppercase">Трекер Buckshot</h1>
            <span className="px-2 py-1 bg-[#222] text-[10px] text-[#888] rounded hidden sm:inline-block">v1.05.STAT</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] uppercase text-[#666]">Текущий Раунд</span>
              <span className="text-lg font-bold text-[#ffcc00]">#{state.roundsHistory.length + 1}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-[#666] text-right">Серия Побед</span>
              <div className="flex gap-1 mt-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={cn("w-3 h-3 rounded-full", i < state.streak ? "bg-[#ff2e2e]" : "bg-[#333]")} />
                ))}
              </div>
            </div>
            {state.mode === 'playing' && (
              <button onClick={() => endRound('abandoned')} className="px-4 py-2 bg-[#222] text-[#e0e0e0] font-bold text-xs uppercase hover:bg-[#333] border border-[#333] transition-colors">След. Магазин</button>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col max-w-[1920px] w-full mx-auto">
          {state.mode === 'setup' ? (
          <SetupScreen 
            onStart={startRound} 
            bestStreak={state.bestStreak} 
            currentStreak={state.streak} 
          />
        ) : (
          state.viewMode === 'full' ? (
            <FullTracker 
              state={state} 
              shoot={shoot} 
              undo={undo} 
              endRound={endRound}
              toggleViewMode={toggleViewMode}
              setKnownShell={setKnownShell}
            />
          ) : (
            <AssistTracker 
              state={state} 
              shoot={shoot} 
              toggleViewMode={toggleViewMode} 
              endRound={endRound}
            />
          )
        )}
        </div>
      </div>

      {/* FOOTER SHORTCUTS INFO */}
      <div className="h-8 bg-[#050505] border-t border-[#1a1a1a] flex items-center justify-center px-6 mt-auto shrink-0 z-50">
        <span className="text-[9px] text-[#444] tracking-[0.2em] uppercase">Автономный Трекер // Нет связи с игрой // Хоткеи: [L] Боевой [B] Холостой [U] Отмена [F] Режим</span>
      </div>
    </main>
  );
}

// ==========================================
// SETUP SCREEN
// ==========================================
function SetupScreen({ onStart, bestStreak, currentStreak }: { onStart: (l: number, b: number) => void, bestStreak: number, currentStreak: number }) {
  const [total, setTotal] = useState(5);
  const [live, setLive] = useState(3);
  const blank = total - live;

  useEffect(() => {
    // eslint-disable-next-line
    if (live > total) setLive(total);
  }, [total, live]);

  const presets = [
    { l: 1, b: 1 }, { l: 1, b: 2 },
    { l: 2, b: 2 }, { l: 2, b: 3 },
    { l: 3, b: 3 }, { l: 3, b: 4 }, 
    { l: 4, b: 4 }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 py-8 animate-in fade-in duration-300">
      
      {/* STREAK TARGET */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 text-center relative overflow-hidden mb-8">
        <h3 className="text-[#888] tracking-widest uppercase mb-4 text-xs">Серия побед</h3>
        
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
              i < currentStreak ? "bg-[#ff2e2e] border-[#ff2e2e] shadow-[0_0_15px_rgba(255,46,46,0.4)]" : "border-[#333] bg-[#111]"
            )}>
              {i < currentStreak && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between font-mono text-[10px] uppercase">
          <span className="text-[#666]">Лучшая: <strong className="text-[#ffcc00]">{bestStreak}</strong></span>
          <span className="text-[#ff2e2e]">ЦЕЛЬ: ВЫЖИТЬ 7 РАУНДОВ</span>
        </div>
      </div>

      {/* SETUP CONTROLS */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
        <h2 className="text-xl font-bold text-[#e0e0e0] text-center mb-8 uppercase tracking-widest border-b border-[#1a1a1a] pb-4">Зарядка магазина</h2>
        
        <div className="space-y-8">
          <div>
            <label className="block text-[#666] text-center mb-4 uppercase text-[10px] tracking-widest">Всего патронов</label>
            <div className="flex justify-center gap-2 flex-wrap">
              {[2,3,4,5,6,7,8].map(n => (
                <button 
                  key={n}
                  onClick={() => setTotal(n)}
                  className={cn(
                    "w-12 h-12 font-mono text-xl transition-colors border",
                    total === n 
                      ? "bg-[#ff2e2e] text-black border-[#ff2e2e] shadow-[0_0_15px_rgba(255,46,46,0.4)]" 
                      : "bg-[#111] text-[#888] border-[#222] hover:border-[#444]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 border-y border-[#1a1a1a] py-6">
            <div className="text-center flex-1">
              <label className="block text-[#ff2e2e] mb-2 uppercase text-[10px] tracking-widest">Боевых</label>
              <div className="flex items-center justify-center gap-4 bg-[#111] p-2 border border-[#222]">
                <button onClick={() => setLive(Math.max(0, live - 1))} className="w-10 h-10 bg-[#222] hover:bg-[#333] text-[#e0e0e0] text-xl flex items-center justify-center">-</button>
                <span className="text-4xl font-black text-[#ff2e2e] w-12">{live}</span>
                <button onClick={() => setLive(Math.min(total, live + 1))} className="w-10 h-10 bg-[#222] hover:bg-[#333] text-[#e0e0e0] text-xl flex items-center justify-center">+</button>
              </div>
            </div>

            <div className="text-center flex-1">
              <label className="block text-[#888] mb-2 uppercase text-[10px] tracking-widest">Холостых</label>
              <div className="flex items-center justify-center gap-4 bg-[#111] p-2 border border-[#222]">
                <div className="w-10 h-10 opacity-0 pointer-events-none" />
                <span className="text-4xl font-black text-[#e0e0e0] w-12">{blank}</span>
                <div className="w-10 h-10 opacity-0 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#666] text-center mb-3 uppercase text-[10px] tracking-widest">Быстрые пресеты</label>
            <div className="flex flex-wrap justify-center gap-5">
              {presets.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => { setTotal(p.l + p.b); setLive(p.l); }}
                  className="px-4 py-2 bg-[#111] hover:bg-[#222] border border-[#222] text-[10px] text-[#888] flex items-center gap-2 uppercase font-bold transition-colors"
                >
                  <span className="text-[#ff2e2e]">{p.l} Б</span> / <span className="text-[#e0e0e0]">{p.b} Х</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onStart(live, blank)}
            disabled={total === 0}
            className="w-full py-6 bg-[#ff2e2e] text-black font-black text-2xl uppercase tracking-widest hover:bg-[#e62929] transition-colors mt-8 shadow-[0_0_20px_rgba(255,46,46,0.2)] hover:shadow-[0_0_30px_rgba(255,46,46,0.4)] disabled:opacity-50 disabled:pointer-events-none"
          >
            Начать Отслеживание
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// UTILS
// ==========================================
function getProbabilities(mag: any, initialMag: any) {
  if (!mag || mag.total === 0) return { pLive: 0, pBlank: 0 };
  const seq = mag.sequence || [];
  const currentIndex = initialMag ? initialMag.total - mag.total : 0;
  const remainingSeq = seq.slice(currentIndex);

  if (remainingSeq.length === 0) return { pLive: (mag.live / mag.total) * 100, pBlank: (mag.blank / mag.total) * 100 };
  
  if (remainingSeq[0] === 'live') return { pLive: 100, pBlank: 0 };
  if (remainingSeq[0] === 'blank') return { pLive: 0, pBlank: 100 };
  
  const knownLive = remainingSeq.filter((s: string) => s === 'live').length;
  const knownBlank = remainingSeq.filter((s: string) => s === 'blank').length;
  const unknownLive = Math.max(0, mag.live - knownLive);
  const unknownBlank = Math.max(0, mag.blank - knownBlank);
  const totalUnknown = unknownLive + unknownBlank;
  
  if (totalUnknown === 0) {
    return { pLive: (mag.live / mag.total) * 100, pBlank: (mag.blank / mag.total) * 100 };
  }
  
  return {
    pLive: (unknownLive / totalUnknown) * 100,
    pBlank: (unknownBlank / totalUnknown) * 100,
  };
}

// ==========================================
// FULL TRACKER SCREEN
// ==========================================
function FullTracker({ state, shoot, undo, endRound, toggleViewMode, setKnownShell }: any) {
  const mag = state.currentMagazine;
  if (!mag) return null;
  const { pLive, pBlank } = getProbabilities(mag, state.initialMagazine);
  const isEmpty = mag.total === 0;

  return (
    <div className="flex flex-col lg:flex-row flex-1 animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: SIDEBAR */}
      <div className="w-full lg:w-[280px] xl:w-[320px] bg-[#080808] flex flex-col border-r border-[#222] shrink-0">
        {/* Stats Section */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4">Статистика сессии</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#0c0c0c] border border-[#1a1a1a]">
              <div className="text-[10px] text-[#666] uppercase">Лучшая серия</div>
              <div className="text-xl font-bold text-[#ffcc00]">{state.bestStreak} <span className="text-[10px] text-[#444] font-normal">МАКС</span></div>
            </div>
            <div className="p-3 bg-[#0c0c0c] border border-[#1a1a1a]">
              <div className="text-[10px] text-[#666] uppercase">Всего выстрелов</div>
              <div className="text-xl font-bold text-[#e0e0e0]">{state.shots.length}</div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-6 pb-2">
            <h3 className="text-[11px] uppercase tracking-widest text-[#555]">История Раунда</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6">
            <div className="flex flex-col gap-2 border-l border-[#1a1a1a] ml-2 pl-4">
              {state.shots.length === 0 ? (
                <p className="text-[#666] text-sm mt-2 opacity-50">Нет записанных выстрелов</p>
              ) : (
                <AnimatePresence mode="popLayout">
                  {[...state.shots].reverse().map((shot: Shot) => (
                    <motion.div 
                      key={shot.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-between text-xs py-1 opacity-80"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("w-4 h-4 rounded-full", shot.type === 'live' ? "bg-[#ff2e2e]" : "bg-[#e0e0e0]")} />
                        <span className="text-[#e0e0e0] font-bold">#{shot.number} {shot.type === 'live' ? 'БОЕВОЙ' : 'ХОЛОСТОЙ'}</span>
                      </div>
                      <span className="text-[#444]">
                        {((shot.type === 'live' ? shot.probabilityBefore : 1 - shot.probabilityBefore) * 100).toFixed(0)}% ВЕР
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
        
        {/* Assist Mode Toggle / Reset */}
        <div className="p-6 bg-[#0a0a0a] border-t border-[#1a1a1a]">
          <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4">Управление Матчем</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => endRound('abandoned')} className="px-4 py-2 bg-[#111] hover:bg-[#222] border border-[#222] text-[10px] text-[#e0e0e0] uppercase font-bold text-left transition-colors flex justify-between">
              <span>Сбросить магазин (Скип)</span>
              <span className="text-[#666]">[R]</span>
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => endRound('win')} className="px-4 py-2 bg-[#1a1a05] hover:bg-[#ffcc00] border border-[#332b00] hover:text-black text-[10px] text-[#ffcc00] uppercase font-bold transition-colors">Победа (Матч)</button>
              <button onClick={() => endRound('loss')} className="px-4 py-2 bg-[#1a0505] hover:bg-[#ff2e2e] border border-[#330a0a] hover:text-black text-[10px] text-[#ff2e2e] uppercase font-bold transition-colors">Поражение</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8">
            <span className="text-[11px] uppercase text-[#666]">Режим интерфейса</span>
            <div className="flex bg-[#111] p-1 rounded-sm border border-[#222]">
              <button onClick={toggleViewMode} className="px-3 py-1 bg-[#222] text-[10px] text-white uppercase font-bold">Полный</button>
              <button onClick={toggleViewMode} className="px-3 py-1 text-[10px] text-[#444] uppercase hover:text-[#888]">Помощник</button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN VISUALS */}
      <div className="flex-1 flex flex-col p-8 bg-[radial-gradient(circle_at_center,_#0f0f0f_0%,_#050505_100%)] relative overflow-y-auto">
        
        {/* MAGAZINE VISUAL */}
        <div className="mb-8 relative flex flex-col">
          <button onClick={toggleViewMode} className="absolute -top-4 right-0 text-[#666] hover:text-[#e0e0e0] transition-colors" title="Помощник (F)">
            <Eye className="w-5 h-5" />
          </button>
          
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[12px] uppercase tracking-widest text-[#888]">Осталось патронов</h2>
            <span className="text-2xl font-black text-[#e0e0e0]">{mag.total} <span className="text-[12px] text-[#555] font-normal">/ {state.initialMagazine?.total || 0} ВСЕГО</span></span>
          </div>
          
          <div className="flex flex-wrap gap-4 p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg justify-center min-h-[140px]">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: mag.live }).map((_, i) => (
                <ShellIcon key={`live-${i}`} type="live" />
              ))}
              {Array.from({ length: mag.blank }).map((_, i) => (
                <ShellIcon key={`blank-${i}`} type="blank" />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SEQUENCE BUILDER / BURNER PHONE */}
        {mag.sequence && (
          <div className="mb-12 flex flex-col border border-[#1a1a1a] bg-[#0a0a0a] p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#333]" />
            <div className="flex justify-between items-end mb-4 ml-4">
              <div>
                <h3 className="text-[12px] uppercase tracking-widest text-[#e0e0e0] font-bold">Очередь патронов</h3>
                <span className="text-[10px] uppercase text-[#666]">Кликните, чтобы отметить (Телефон)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 ml-4">
              {mag.sequence.map((s: string, i: number) => {
                const currentIndex = state.initialMagazine ? state.initialMagazine.total - mag.total : 0;
                const isFired = i < currentIndex;
                const isNext = i === currentIndex && !isEmpty;
                
                return (
                  <button
                    key={`seq-${i}`}
                    disabled={isFired || isEmpty}
                    onClick={() => {
                      if (isFired) return;
                      const nextState = s === 'unknown' ? 'live' : (s === 'live' ? 'blank' : 'unknown');
                      setKnownShell(i, nextState);
                    }}
                    className={cn(
                      "w-12 h-14 sm:w-16 sm:h-20 flex flex-col items-center justify-center border-2 transition-all relative group shrink-0",
                      isFired ? "border-[#222] bg-[#0a0a0a] opacity-30 cursor-not-allowed" :
                      s === 'unknown' ? "border-[#222] bg-[#111] hover:bg-[#222]" : 
                      s === 'live' ? "border-[#ff2e2e] bg-[#1a0505] shadow-[0_0_10px_rgba(255,46,46,0.2)]" : 
                      "border-[#e0e0e0] bg-[#1a1a1a]",
                      isNext && s === 'unknown' ? "border-[#555] animate-pulse" : "",
                      isNext && s !== 'unknown' ? "ring-2 ring-white/20 ring-offset-2 ring-offset-black" : ""
                    )}
                  >
                    <span className="text-[9px] text-[#666] absolute top-1">{i + 1}</span>
                    <span className={cn(
                      "font-black mt-3 text-xl sm:text-3xl",
                      isFired ? "text-[#444]" :
                      s === 'unknown' ? "text-[#444] group-hover:text-[#666]" :
                      s === 'live' ? "text-[#ff2e2e]" : "text-[#e0e0e0]"
                    )}>
                      {s === 'unknown' ? '?' : s === 'live' ? 'Б' : 'Х'}
                    </span>
                    {isFired && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-70">
                          <div className="w-[80%] h-[2px] bg-red-600 rotate-45 absolute" />
                          <div className="w-[80%] h-[2px] bg-red-600 -rotate-45 absolute" />
                       </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PROBABILITY */}
        <div className="flex-1 flex flex-col items-center justify-center mb-12 mt-6">
          <span className="text-[14px] uppercase tracking-widest text-[#666] mb-8">Шанс следующего выстрела</span>
          
          {!isEmpty ? (
            <div className="flex w-full items-center gap-6">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-6xl font-black text-[#ff2e2e]">{pLive.toFixed(0)}%</span>
                <span className="text-[12px] uppercase text-[#ff2e2e] mt-2">Боевой</span>
              </div>
              <div className="flex-[2] h-12 bg-[#111] border border-[#222] rounded-full flex overflow-hidden p-1">
                <motion.div 
                  className="h-full bg-[#ff2e2e] shadow-[0_0_15px_rgba(255,46,46,0.8)]"
                  initial={{ width: `${pLive}%` }}
                  animate={{ width: `${pLive}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
                <motion.div 
                  className="h-full bg-[#555]"
                  initial={{ width: `${pBlank}%` }}
                  animate={{ width: `${pBlank}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-6xl font-black text-[#e0e0e0]">{pBlank.toFixed(0)}%</span>
                <span className="text-[12px] uppercase text-[#888] mt-2">Холостой</span>
              </div>
            </div>
          ) : (
             <div className="text-center py-8">
               <h3 className="text-3xl font-black text-[#e0e0e0] uppercase tracking-widest mb-2">Магазин пуст</h3>
               <p className="text-[#666] font-mono">Завершите раунд для продолжения</p>
             </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-2 gap-6 h-32">
          {!isEmpty ? (
            <>
              <button 
                onClick={() => shoot('live')}
                disabled={mag.live === 0}
                className="group relative flex flex-col items-center justify-center border-4 border-[#ff2e2e] bg-[#1a0505] hover:bg-[#ff2e2e] transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98]"
              >
                <span className="text-3xl font-black text-[#ff2e2e] group-hover:text-black uppercase">Боевой</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-[#ff2e2e]/50 group-hover:text-black/50">[L]</span>
              </button>
              <button 
                onClick={() => shoot('blank')}
                disabled={mag.blank === 0}
                className="group relative flex flex-col items-center justify-center border-4 border-[#e0e0e0] bg-[#111] hover:bg-[#e0e0e0] transition-colors disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98]"
              >
                <span className="text-3xl font-black text-[#e0e0e0] group-hover:text-black uppercase">Холостой</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-[#e0e0e0]/50 group-hover:text-black/50">[B]</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => endRound('abandoned')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#e0e0e0] bg-[#111] hover:bg-[#e0e0e0] transition-colors active:scale-[0.98]"
              >
                <span className="text-2xl font-black text-[#e0e0e0] group-hover:text-black uppercase">След. магазин</span>
              </button>
              <button 
                onClick={() => endRound('win')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#ffcc00] bg-[#1a1a05] hover:bg-[#ffcc00] transition-colors active:scale-[0.98]"
              >
                <span className="text-2xl font-black text-[#ffcc00] group-hover:text-black uppercase">Победа (Матч)</span>
              </button>
              <button 
                onClick={() => endRound('loss')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#ff2e2e] bg-[#1a0505] hover:bg-[#ff2e2e] transition-colors active:scale-[0.98] col-span-2 sm:col-span-1"
              >
                <span className="text-2xl font-black text-[#ff2e2e] group-hover:text-black uppercase">Поражение</span>
              </button>
            </>
          )}
        </div>
        
        {/* UNDO */}
        <div className="mt-6 flex justify-between items-center px-2">
          <button 
            onClick={undo}
            disabled={state.shots.length === 0}
            className="text-[#666] hover:text-[#e0e0e0] uppercase text-xs flex items-center gap-2 disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4" /> [U] Отменить Действие
          </button>
          <span className="text-[#444] text-[10px] uppercase hidden sm:block">Порядок неизвестен - только вероятности</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ASSIST TRACKER SCREEN
// ==========================================
function AssistTracker({ state, shoot, toggleViewMode, endRound }: any) {
  const mag = state.currentMagazine;
  if (!mag) return null;
  const { pLive, pBlank } = getProbabilities(mag, state.initialMagazine);
  const isEmpty = mag.total === 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 relative bg-[radial-gradient(circle_at_center,_#0f0f0f_0%,_#050505_100%)]">
      <button onClick={toggleViewMode} className="absolute top-4 right-6 text-[#666] hover:text-[#e0e0e0] transition-colors px-4 py-2 border border-[#222] bg-[#0a0a0a] text-[10px] uppercase font-bold">
        Полный Режим [F]
      </button>

      <div className="w-full max-w-4xl text-center space-y-16 px-4 py-12">
        
        {/* COUNTS */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-24">
          <div>
            <div className="text-[12px] text-[#ff2e2e] uppercase tracking-[0.3em] mb-4 font-bold">Осталось боевых</div>
            <div className="text-8xl sm:text-[10rem] leading-none font-black text-[#ff2e2e] drop-shadow-[0_0_30px_rgba(255,46,46,0.3)]">{mag.live}</div>
          </div>
          <div>
            <div className="text-[12px] text-[#888] uppercase tracking-[0.3em] mb-4 font-bold">Осталось холостых</div>
            <div className="text-8xl sm:text-[10rem] leading-none font-black text-[#e0e0e0] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">{mag.blank}</div>
          </div>
        </div>

        {/* PROBABILITY */}
        {!isEmpty && (
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            <div className="flex justify-between text-3xl sm:text-5xl font-black">
              <span className="text-[#ff2e2e]">{pLive.toFixed(0)}%</span>
              <span className="text-[#e0e0e0]">{pBlank.toFixed(0)}%</span>
            </div>
            <div className="h-6 sm:h-8 w-full bg-[#111] border border-[#222] rounded-full overflow-hidden flex p-1 shadow-[0_0_20px_rgba(255,46,46,0.1)]">
              <motion.div className="h-full bg-[#ff2e2e] shadow-[0_0_10px_#ff2e2e]" animate={{ width: `${pLive}%` }} transition={{ duration: 0.5 }} />
              <motion.div className="h-full bg-[#555]" animate={{ width: `${pBlank}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center w-full">
          {!isEmpty ? (
            <>
              <button 
                onClick={() => shoot('live')} disabled={mag.live === 0}
                className="flex-1 max-w-[400px] h-32 sm:h-40 bg-[#1a0505] border-4 border-[#ff2e2e] hover:bg-[#ff2e2e] hover:text-black group text-4xl sm:text-5xl font-black text-[#ff2e2e] uppercase disabled:opacity-20 transition-all mx-auto w-full active:scale-95"
              >
                Боевой <span className="text-lg opacity-50 group-hover:text-black block">[L]</span>
              </button>
              <button 
                onClick={() => shoot('blank')} disabled={mag.blank === 0}
                className="flex-1 max-w-[400px] h-32 sm:h-40 bg-[#111] border-4 border-[#e0e0e0] hover:bg-[#e0e0e0] hover:text-black group text-4xl sm:text-5xl font-black text-[#e0e0e0] uppercase disabled:opacity-20 transition-all mx-auto w-full active:scale-95"
              >
                Холостой <span className="text-lg opacity-50 group-hover:text-black block">[B]</span>
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={() => endRound('abandoned')} className="w-full sm:w-auto px-12 py-8 bg-[#111] border-4 border-[#e0e0e0] text-[#e0e0e0] hover:text-black text-xl sm:text-2xl font-black uppercase hover:bg-[#e0e0e0] transition-colors active:scale-95">След. магазин</button>
               <button onClick={() => endRound('win')} className="w-full sm:w-auto px-12 py-8 bg-[#1a1a05] border-4 border-[#ffcc00] text-[#ffcc00] hover:text-black text-xl sm:text-2xl font-black uppercase hover:bg-[#ffcc00] transition-colors active:scale-95">Победа в матче</button>
               <button onClick={() => endRound('loss')} className="w-full sm:w-auto px-12 py-8 bg-[#1a0505] border-4 border-[#ff2e2e] text-[#ff2e2e] hover:text-black text-xl sm:text-2xl font-black uppercase hover:bg-[#ff2e2e] transition-colors active:scale-95">Поражение</button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

// ==========================================
// SMALL UI COMPONENTS
// ==========================================
function ShellIcon({ type }: { type: 'live' | 'blank' }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: 20 }}
      className={cn(
        "w-16 h-28 border-2 rounded-md flex flex-col items-center justify-center relative overflow-hidden",
        type === 'live' ? "border-[#ff2e2e] bg-[#1a0a0a] shadow-[0_0_15px_rgba(255,46,46,0.2)]" : "border-[#e0e0e0] bg-[#1a1a1a] opacity-80"
      )}
    >
      <div className={cn("w-10 h-10 rounded-full mb-2", type === 'live' ? "bg-[#ff2e2e] shadow-inner shadow-black/50" : "bg-[#e0e0e0]")} />
      <span className={cn("text-[10px] font-bold uppercase", type === 'live' ? "text-[#ff2e2e]" : "text-[#e0e0e0]")}>
        {type === 'live' ? 'Боевой' : 'Холостой'}
      </span>
    </motion.div>
  );
}
