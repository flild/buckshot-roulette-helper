import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AppState } from '@/lib/types';

export function SetupScreen({ onStart, state }: { onStart: (l: number, b: number) => void, state: AppState }) {
  const [total, setTotal] = useState(5);
  const [live, setLive] = useState(3);
  const blank = total - live;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      {/* MATCH PROGRESS */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 text-center relative overflow-hidden mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#888] tracking-widest uppercase text-xs">Прогресс матча</h3>
          <span className="text-[#ff2e2e] text-[10px] uppercase font-bold tracking-widest">
            Пройдено матчей: {state.matchesWon}
          </span>
        </div>

        {/* 3 Charges for the current match */}
        <div className="flex justify-center gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cn(
              "w-12 h-20 border-4 flex items-center justify-center transition-all duration-500 relative",
              i < state.roundWins
                ? "bg-[#ffcc00] border-[#ffcc00] shadow-[0_0_30px_rgba(255,204,0,0.6)] lamp-on"
                : "border-[#333] bg-[#111]"
            )}>
              {i < state.roundWins && (
                <div className="w-4 h-10 bg-white/70 shadow-[0_0_15px_white]" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] uppercase">
          <span className="text-[#666]">Лучшая серия: <strong className="text-[#ffcc00]">{state.bestMatchesWon}</strong></span>
          <span className="text-[#ff2e2e]">ЦЕЛЬ: ЗАКРЫТЬ 7 МАТЧЕЙ</span>
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
