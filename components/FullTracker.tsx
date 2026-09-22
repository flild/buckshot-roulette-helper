import { motion, AnimatePresence } from 'motion/react';
import { Undo2, Eye } from 'lucide-react';
import { cn, getProbabilities } from '@/lib/utils';
import { AppState, ShellType, Shot, KnownState } from '@/lib/types';
import { ShellIcon } from './ShellIcon';
import { useLanguage } from '@/lib/i18n';

export function FullTracker({ state, shoot, undo, endRound, toggleViewMode, setKnownShell }: {
  state: AppState;
  shoot: (type: ShellType) => void;
  undo: () => void;
  endRound: (result: 'win' | 'loss' | 'abandoned') => void;
  toggleViewMode: () => void;
  setKnownShell: (index: number, stateValue: KnownState) => void;
}) {
  const { t } = useLanguage();
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
              <div className="text-xl font-bold text-[#ffcc00]">{state.bestMatchesWon} <span className="text-[10px] text-[#444] font-normal">МАКС</span></div>
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
            <h3 className="text-[11px] uppercase tracking-widest text-[#555]">{t('full.historyTitle')}</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6">
            <div className="flex flex-col gap-2 border-l border-[#1a1a1a] ml-2 pl-4">
              {state.shots.length === 0 ? (
                <p className="text-[#666] text-sm mt-2 opacity-50">{t('full.historyEmpty')}</p>
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
          <h3 className="text-[11px] uppercase tracking-widest text-[#555] mb-4">{t('full.matchControl')}</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => endRound('abandoned')} className="px-4 py-2 bg-[#111] hover:bg-[#222] border border-[#222] text-[10px] text-[#e0e0e0] uppercase font-bold text-left transition-colors flex justify-between">
              <span>{t('full.resetMag')} ({t('full.skip')})</span>
              <span className="text-[#666]">[R]</span>
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => endRound('win')} className="px-4 py-2 bg-[#1a1a05] hover:bg-[#ffcc00] border border-[#332b00] hover:text-black text-[10px] text-[#ffcc00] uppercase font-bold transition-colors">{t('full.winRound')}</button>
              <button onClick={() => endRound('loss')} className="px-4 py-2 bg-[#1a0505] hover:bg-[#ff2e2e] border border-[#330a0a] hover:text-black text-[10px] text-[#ff2e2e] uppercase font-bold transition-colors">{t('full.loss')}</button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <span className="text-[11px] uppercase text-[#666]">{t('full.interfaceMode')}</span>
            <div className="flex bg-[#111] p-1 rounded-sm border border-[#222]">
              <button onClick={toggleViewMode} className="px-3 py-1 bg-[#222] text-[10px] text-white uppercase font-bold">{t('full.fullMode')}</button>
              <button onClick={toggleViewMode} className="px-3 py-1 text-[10px] text-[#444] uppercase hover:text-[#888]">{t('full.assistMode').replace(' (F)', '')}</button>
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
                <h3 className="text-[12px] uppercase tracking-widest text-[#e0e0e0] font-bold">{t('full.queue')}</h3>
                <span className="text-[10px] uppercase text-[#666]">{t('full.clickToMark')}</span>
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
                      setKnownShell(i, nextState as KnownState);
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
                      {s === 'unknown' ? t('full.unknown') : s === 'live' ? t('full.liveInitial') : t('full.blankInitial')}
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
          <span className="text-[14px] uppercase tracking-widest text-[#666] mb-8">{t('full.chanceNext')}</span>

          {!isEmpty ? (
            <div className="flex w-full items-center gap-6">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-6xl font-black text-[#ff2e2e]">{pLive.toFixed(0)}%</span>
                <span className="text-[12px] uppercase text-[#ff2e2e] mt-2">{t('full.liveChance')}</span>
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
                <span className="text-[12px] uppercase text-[#888] mt-2">{t('full.blankChance')}</span>
              </div>
            </div>
          ) : (
             <div className="text-center py-8">
               <h3 className="text-3xl font-black text-[#e0e0e0] uppercase tracking-widest mb-2">{t('full.magEmpty')}</h3>
               <p className="text-[#666] font-mono">{t('full.completeRoundToContinue')}</p>
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
                className="group relative flex flex-col items-center justify-center border-4 border-[#ff2e2e] bg-[#1a0505] hover:bg-[#ff2e2e] hover:shadow-[0_0_40px_rgba(255,46,46,0.5)] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.95]"
              >
                <span className="text-3xl font-black text-[#ff2e2e] group-hover:text-black uppercase transition-colors">{t('full.liveBtn')}</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-[#ff2e2e]/50 group-hover:text-black/50">[L]</span>
              </button>
              <button
                onClick={() => shoot('blank')}
                disabled={mag.blank === 0}
                className="group relative flex flex-col items-center justify-center border-4 border-[#e0e0e0] bg-[#111] hover:bg-[#e0e0e0] hover:shadow-[0_0_40px_rgba(224,224,224,0.3)] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.95]"
              >
                <span className="text-3xl font-black text-[#e0e0e0] group-hover:text-black uppercase transition-colors">{t('full.blankBtn')}</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-[#e0e0e0]/50 group-hover:text-black/50">[B]</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => endRound('abandoned')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#e0e0e0] bg-[#111] hover:bg-[#e0e0e0] hover:shadow-[0_0_30px_rgba(224,224,224,0.3)] transition-all duration-300 active:scale-[0.95]"
              >
                <span className="text-2xl font-black text-[#e0e0e0] group-hover:text-black uppercase transition-colors">{t('full.nextMag')}</span>
              </button>
              <button
                onClick={() => endRound('win')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#ffcc00] bg-[#1a1a05] hover:bg-[#ffcc00] hover:shadow-[0_0_40px_rgba(255,204,0,0.4)] transition-all duration-300 active:scale-[0.95]"
              >
                <span className="text-2xl font-black text-[#ffcc00] group-hover:text-black uppercase transition-colors">{t('full.winRound')}</span>
              </button>
              <button
                onClick={() => endRound('loss')}
                className="group relative flex flex-col items-center justify-center border-4 border-[#ff2e2e] bg-[#1a0505] hover:bg-[#ff2e2e] hover:shadow-[0_0_40px_rgba(255,46,46,0.5)] transition-all duration-300 active:scale-[0.95] col-span-2 sm:col-span-1"
              >
                <span className="text-2xl font-black text-[#ff2e2e] group-hover:text-black uppercase transition-colors">{t('full.loss')}</span>
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
            <Undo2 className="w-4 h-4" /> {t('full.undoAction')}
          </button>
          <span className="text-[#444] text-[10px] uppercase hidden sm:block">{t('full.orderUnknown')}</span>
        </div>
      </div>
    </div>
  );
}
