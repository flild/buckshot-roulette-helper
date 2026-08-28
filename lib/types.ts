export type ShellType = 'live' | 'blank';
export type KnownState = 'live' | 'blank' | 'unknown';

export interface Magazine {
  total: number;
  live: number;
  blank: number;
  sequence: KnownState[];
}

export interface Shot {
  id: string;
  number: number;
  type: ShellType;
  probabilityBefore: number;
  liveBefore: number;
  blankBefore: number;
  liveAfter: number;
  blankAfter: number;
  sequenceBefore: KnownState[];
  sequenceAfter: KnownState[];
  timestamp: number;
}

export interface RoundResult {
  id: string;
  magazineStart: Magazine;
  shots: Shot[];
  result: 'win' | 'loss' | 'abandoned';
  timestamp: number;
}

export interface AppState {
  mode: 'setup' | 'playing';
  viewMode: 'full' | 'assist';
  initialMagazine: Magazine | null;
  currentMagazine: Magazine | null;
  shots: Shot[];
  streak: number;
  bestStreak: number;
  roundsHistory: RoundResult[];
}
