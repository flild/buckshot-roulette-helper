import { useState, useEffect, useCallback } from 'react';
import { AppState, ShellType, Shot, RoundResult, Magazine, KnownState } from '../lib/types';

const defaultState: AppState = {
  mode: 'setup',
  viewMode: 'full',
  initialMagazine: null,
  currentMagazine: null,
  shots: [],
  streak: 0,
  bestStreak: 0,
  roundsHistory: [],
};

export function useBuckshot() {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    // Only access localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buckshot-tracker-state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Fallback for older saves
          if (parsed.currentMagazine && !parsed.currentMagazine.sequence) {
             parsed.currentMagazine.sequence = Array(parsed.currentMagazine.total).fill('unknown');
          }
          if (parsed.initialMagazine && !parsed.initialMagazine.sequence) {
             parsed.initialMagazine.sequence = Array(parsed.initialMagazine.total).fill('unknown');
          }
          // Minimal validation to ensure it's not arbitrary data
          if (typeof parsed === 'object' && parsed !== null && 'mode' in parsed) {
             // eslint-disable-next-line react-hooks/set-state-in-effect
             setState(parsed as AppState);
          }
        } catch (e) {
          console.error('Failed to parse saved state', e);
        }
      }
    }
    setHydrated(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('buckshot-tracker-state', JSON.stringify(state));
    }
  }, [state, hydrated]);

  const startRound = useCallback((live: number, blank: number) => {
    const total = live + blank;
    const mag: Magazine = { total, live, blank, sequence: Array(total).fill('unknown') };
    setState((prev) => ({
      ...prev,
      mode: 'playing',
      initialMagazine: mag,
      currentMagazine: mag,
      shots: [],
    }));
  }, []);

  const shoot = useCallback((type: ShellType) => {
    setState((prev) => {
      if (prev.mode !== 'playing' || !prev.currentMagazine) return prev;
      
      const { live, blank, total, sequence } = prev.currentMagazine;
      if (type === 'live' && live <= 0) return prev;
      if (type === 'blank' && blank <= 0) return prev;

      let probabilityBefore = 0;
      const initialTotal = prev.initialMagazine!.total;
      const currentIndex = initialTotal - total;

      if (total > 0) {
        if (sequence[currentIndex] === 'live') probabilityBefore = 1;
        else if (sequence[currentIndex] === 'blank') probabilityBefore = 0;
        else {
          const remainingSeq = sequence.slice(currentIndex);
          const knownLive = remainingSeq.filter(s => s === 'live').length;
          const knownBlank = remainingSeq.filter(s => s === 'blank').length;
          const unknownLive = Math.max(0, live - knownLive);
          const unknownBlank = Math.max(0, blank - knownBlank);
          const totalUnknown = unknownLive + unknownBlank;
          probabilityBefore = totalUnknown > 0 ? unknownLive / totalUnknown : (type === 'live' ? 1 : 0);
        }
      }
      
      const newLive = type === 'live' ? live - 1 : live;
      const newBlank = type === 'blank' ? blank - 1 : blank;
      const newSequence = [...sequence];
      newSequence[currentIndex] = type; // Record the actual fired shot in the sequence
      
      const shot: Shot = {
        id: Math.random().toString(36).substr(2, 9),
        number: prev.shots.length + 1,
        type,
        probabilityBefore,
        liveBefore: live,
        blankBefore: blank,
        liveAfter: newLive,
        blankAfter: newBlank,
        sequenceBefore: sequence,
        sequenceAfter: newSequence,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        currentMagazine: {
          total: total - 1,
          live: newLive,
          blank: newBlank,
          sequence: newSequence,
        },
        shots: [shot, ...prev.shots],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.mode !== 'playing' || prev.shots.length === 0) return prev;
      
      const lastShot = prev.shots[0];
      const newShots = prev.shots.slice(1);
      
      return {
        ...prev,
        currentMagazine: {
          total: lastShot.liveBefore + lastShot.blankBefore,
          live: lastShot.liveBefore,
          blank: lastShot.blankBefore,
          sequence: lastShot.sequenceBefore || Array(lastShot.liveBefore + lastShot.blankBefore).fill('unknown'),
        },
        shots: newShots,
      };
    });
  }, []);

  const setKnownShell = useCallback((index: number, stateValue: KnownState) => {
    setState((prev) => {
      if (prev.mode !== 'playing' || !prev.currentMagazine) return prev;
      const newSequence = [...prev.currentMagazine.sequence];
      if (index >= 0 && index < newSequence.length) {
        newSequence[index] = stateValue;
      }
      return {
        ...prev,
        currentMagazine: {
          ...prev.currentMagazine,
          sequence: newSequence,
        }
      };
    });
  }, []);

  const endRound = useCallback((result: 'win' | 'loss' | 'abandoned') => {
    setState((prev) => {
      if (prev.mode !== 'playing' || !prev.initialMagazine) return prev;
      
      const roundResult: RoundResult = {
        id: Math.random().toString(36).substr(2, 9),
        magazineStart: prev.initialMagazine,
        shots: prev.shots,
        result,
        timestamp: Date.now(),
      };

      let newStreak = prev.streak;
      if (result === 'win') newStreak += 1;
      else if (result === 'loss') newStreak = 0;
      // if abandoned, leave streak as is

      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      return {
        ...prev,
        mode: 'setup',
        initialMagazine: null,
        currentMagazine: null,
        shots: [],
        streak: newStreak,
        bestStreak: newBestStreak,
        roundsHistory: [roundResult, ...prev.roundsHistory],
      };
    });
  }, []);

  const toggleViewMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === 'full' ? 'assist' : 'full',
    }));
  }, []);

  return {
    state,
    hydrated,
    startRound,
    shoot,
    undo,
    endRound,
    toggleViewMode,
    setKnownShell,
  };
}
