'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuckshot } from '@/hooks/useBuckshot';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetupScreen } from '@/components/SetupScreen';
import { FullTracker } from '@/components/FullTracker';
import { AssistTracker } from '@/components/AssistTracker';
import { useLanguage, LanguageProvider } from '@/lib/i18n';

function PageContent() {
  const { state, hydrated, startRound, shoot, undo, endRound, toggleViewMode, setKnownShell } = useBuckshot();
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (state.matchesWon === 7 && state.mode === 'setup') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWinAnimation(true);
      t = setTimeout(() => setShowWinAnimation(false), 4000);
    }
    return () => clearTimeout(t);
  }, [state.matchesWon, state.mode]);

  useKeyboardShortcuts({
    shoot,
    undo,
    toggleViewMode,
    reset: () => endRound('abandoned'),
    newRound: () => {},
    isSetup: state.mode === 'setup'
  });

  if (!hydrated) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-mono">{t('app.loading')}</div>;
  }

  return (
    <main className="min-h-screen text-[#e0e0e0] font-mono selection:bg-[#ff2e2e] selection:text-black flex flex-col overflow-x-hidden relative">
      <div className="noise-overlay" />

      <div className="crt-overlay" />
      
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
              <h2 className="text-5xl font-black text-yellow-500 tracking-wider mb-2 uppercase">{t('app.achievement')}</h2>
              <p className="text-2xl text-yellow-200 font-mono">{t('app.matchesPassed', { count: 7 })}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-[#222] bg-[#0a0a0a] gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-[#ff2e2e] text-xl font-black tracking-tighter uppercase">{t('app.title')}</h1>
            <span className="px-2 py-1 bg-[#222] text-[10px] text-[#888] rounded hidden sm:inline-block">v1.05.STAT</span>

            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="ml-4 px-2 py-1 bg-[#111] hover:bg-[#222] border border-[#333] text-[10px] text-[#888] hover:text-[#e0e0e0] font-bold uppercase transition-colors rounded"
            >
              {language === 'ru' ? 'EN / RU' : 'RU / EN'}
            </button>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] uppercase text-[#666]">{t('app.currentRound')}</span>
              <span className="text-lg font-bold text-[#ffcc00]">#{state.roundsHistory.length + 1}</span>
            </div>
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] uppercase text-[#666]">{t('app.matchesWon')}</span>
              <span className="text-lg font-bold text-[#ff2e2e]">{state.matchesWon}</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-[#666] text-right mb-1">{t('app.charges')}</span>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={cn(
                    "w-4 h-6 border-2 flex items-center justify-center transition-all duration-300",
                    i < state.roundWins
                      ? "bg-[#ffcc00] border-[#ffcc00] shadow-[0_0_10px_rgba(255,204,0,0.6)] lamp-on"
                      : "bg-[#111] border-[#333]"
                  )}>
                    {i < state.roundWins && <div className="w-1.5 h-3 bg-white/50" />}
                  </div>
                ))}
              </div>
            </div>
            {state.mode === 'playing' && (
              <button onClick={() => endRound('abandoned')} className="px-4 py-2 bg-[#222] text-[#e0e0e0] font-bold text-xs uppercase hover:bg-[#333] border border-[#333] transition-colors">{t('app.nextMag')}</button>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col max-w-[1920px] w-full mx-auto relative">
          <AnimatePresence mode="wait">
            {state.mode === 'setup' ? (
              <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col">
                <SetupScreen
                  onStart={startRound}
                  state={state}
                />
              </motion.div>
            ) : (
              state.viewMode === 'full' ? (
                <motion.div key="full" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex-1 flex flex-col h-full">
                  <FullTracker
                    state={state}
                    shoot={shoot}
                    undo={undo}
                    endRound={endRound}
                    toggleViewMode={toggleViewMode}
                    setKnownShell={setKnownShell}
                  />
                </motion.div>
              ) : (
                <motion.div key="assist" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="flex-1 flex flex-col h-full">
                  <AssistTracker
                    state={state}
                    shoot={shoot}
                    toggleViewMode={toggleViewMode}
                    endRound={endRound}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-8 bg-[#050505] border-t border-[#1a1a1a] flex items-center justify-center px-6 mt-auto shrink-0 z-50">
        <span className="text-[9px] text-[#444] tracking-[0.2em] uppercase">{t('app.footerText')}</span>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
}
