'use client';

import { useEffect } from 'react';
import { useBuckshot } from '../hooks/useBuckshot';

export function useKeyboardShortcuts({
  shoot,
  undo,
  toggleViewMode,
  reset,
  newRound,
  isSetup
}: {
  shoot: (type: 'live' | 'blank') => void;
  undo: () => void;
  toggleViewMode: () => void;
  reset: () => void;
  newRound: () => void;
  isSetup: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (though there shouldn't be any here)
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();
      
      if (key === 'l' && !isSetup) shoot('live');
      if (key === 'b' && !isSetup) shoot('blank');
      if (key === 'u' && !isSetup) undo();
      if (key === 'f') toggleViewMode();
      if (key === 'r' && !isSetup) reset();
      if (key === 'n' && isSetup) newRound(); // Or just let them click
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shoot, undo, toggleViewMode, reset, newRound, isSetup]);
}
