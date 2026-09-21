import { motion } from 'motion/react';
import { getProbabilities } from '@/lib/utils';
import { AppState, ShellType } from '@/lib/types';

export function AssistTracker({ state, shoot, toggleViewMode, endRound }: {
  state: AppState;
  shoot: (type: ShellType) => void;
  toggleViewMode: () => void;
  endRound: (result: 'win' | 'loss' | 'abandoned') => void;
}) {
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
               <button onClick={() => endRound('win')} className="w-full sm:w-auto px-12 py-8 bg-[#1a1a05] border-4 border-[#ffcc00] text-[#ffcc00] hover:text-black text-xl sm:text-2xl font-black uppercase hover:bg-[#ffcc00] transition-colors active:scale-95">Победа в раунде</button>
               <button onClick={() => endRound('loss')} className="w-full sm:w-auto px-12 py-8 bg-[#1a0505] border-4 border-[#ff2e2e] text-[#ff2e2e] hover:text-black text-xl sm:text-2xl font-black uppercase hover:bg-[#ff2e2e] transition-colors active:scale-95">Поражение</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
