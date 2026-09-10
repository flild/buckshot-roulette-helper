import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function ShellIcon({ type }: { type: 'live' | 'blank' }) {
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
