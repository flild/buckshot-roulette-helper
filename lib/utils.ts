import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getProbabilities(mag: any, initialMag: any) {
  if (!mag || mag.total === 0) return { pLive: 0, pBlank: 0 };
  const seq = mag.sequence || [];
  const currentIndex = initialMag ? initialMag.total - mag.total : 0;
  const remainingSeq = seq.slice(currentIndex);

  if (remainingSeq.length === 0) return { pLive: (mag.live / mag.total) * 100, pBlank: (mag.blank / mag.total) * 100 };

  if (remainingSeq[0] === "live") return { pLive: 100, pBlank: 0 };
  if (remainingSeq[0] === "blank") return { pLive: 0, pBlank: 100 };

  const knownLive = remainingSeq.filter((s: string) => s === "live").length;
  const knownBlank = remainingSeq.filter((s: string) => s === "blank").length;
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
