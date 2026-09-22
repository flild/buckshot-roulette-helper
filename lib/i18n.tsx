'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  ru: {
    app: {
      loading: 'ЗАГРУЗКА ТЕРМИНАЛА...',
      achievement: 'Достижение получено',
      matchesPassed: '{count} пройденных матчей',
      title: 'Трекер Buckshot',
      currentRound: 'Текущий Раунд',
      matchesWon: 'Пройдено матчей',
      charges: 'Заряды (Раунд)',
      nextMag: 'След. Магазин',
      footerText: 'Автономный Трекер // Нет связи с игрой // Хоткеи: [L] Боевой [B] Холостой [U] Отмена [F] Режим',
    },
    setup: {
      matchProgress: 'Прогресс матча',
      matchesWon: 'Пройдено матчей: {count}',
      bestStreak: 'Лучшая серия:',
      goal: 'ЦЕЛЬ: ЗАКРЫТЬ 7 МАТЧЕЙ',
      chargeMag: 'Зарядка магазина',
      totalShells: 'Всего патронов',
      liveShells: 'Боевых',
      blankShells: 'Холостых',
      presets: 'Быстрые пресеты',
      startTracking: 'Начать Отслеживание',
      l: 'Б',
      b: 'Х'
    },
    assist: {
      fullMode: 'Полный Режим [F]',
      liveLeft: 'Осталось боевых',
      blankLeft: 'Осталось холостых',
      liveBtn: 'Боевой',
      blankBtn: 'Холостой',
      nextMag: 'След. магазин',
      winRound: 'Победа в раунде',
      loss: 'Поражение',
    },
    full: {
      assistMode: 'Помощник (F)',
      shellsLeft: 'Осталось патронов',
      total: '/ {count} ВСЕГО',
      queue: 'Очередь патронов',
      clickToMark: 'Кликните, чтобы отметить (Телефон)',
      unknown: '?',
      liveInitial: 'Б',
      blankInitial: 'Х',
      chanceNext: 'Шанс следующего выстрела',
      liveChance: 'Боевой',
      blankChance: 'Холостой',
      magEmpty: 'Магазин пуст',
      completeRoundToContinue: 'Завершите раунд для продолжения',
      liveBtn: 'Боевой',
      blankBtn: 'Холостой',
      nextMag: 'След. магазин',
      winRound: 'Победа (Раунд)',
      loss: 'Поражение',
      undoAction: '[U] Отменить Действие',
      orderUnknown: 'Порядок неизвестен - только вероятности',
      historyTitle: 'История Раунда',
      historyEmpty: 'Нет записанных выстрелов',
      shotLive: 'БОЕВОЙ',
      shotBlank: 'ХОЛОСТОЙ',
      sessionStats: 'Статистика сессии',
      totalShots: 'Всего выстрелов',
      matchControl: 'Управление Матчем',
      resetMag: 'Сбросить магазин',
      interfaceMode: 'Режим интерфейса',
      fullMode: 'Полный',
      maxCap: 'МАКС',
      ver: 'ВЕР',
      skip: 'Скип'
    }
  },
  en: {
    app: {
      loading: 'LOADING TERMINAL...',
      achievement: 'Achievement Unlocked',
      matchesPassed: '{count} matches passed',
      title: 'Buckshot Tracker',
      currentRound: 'Current Round',
      matchesWon: 'Matches Won',
      charges: 'Charges (Round)',
      nextMag: 'Next Mag',
      footerText: 'Autonomous Tracker // No game connection // Hotkeys: [L] Live [B] Blank [U] Undo [F] Mode',
    },
    setup: {
      matchProgress: 'Match Progress',
      matchesWon: 'Matches Won: {count}',
      bestStreak: 'Best Streak:',
      goal: 'GOAL: COMPLETE 7 MATCHES',
      chargeMag: 'Load Magazine',
      totalShells: 'Total Shells',
      liveShells: 'Live',
      blankShells: 'Blank',
      presets: 'Quick Presets',
      startTracking: 'Start Tracking',
      l: 'L',
      b: 'B'
    },
    assist: {
      fullMode: 'Full Mode [F]',
      liveLeft: 'Live Left',
      blankLeft: 'Blank Left',
      liveBtn: 'Live',
      blankBtn: 'Blank',
      nextMag: 'Next Mag',
      winRound: 'Win Round',
      loss: 'Loss',
    },
    full: {
      assistMode: 'Assist (F)',
      shellsLeft: 'Shells Left',
      total: '/ {count} TOTAL',
      queue: 'Shell Queue',
      clickToMark: 'Click to mark (Phone)',
      unknown: '?',
      liveInitial: 'L',
      blankInitial: 'B',
      chanceNext: 'Next Shot Chance',
      liveChance: 'Live',
      blankChance: 'Blank',
      magEmpty: 'Magazine Empty',
      completeRoundToContinue: 'Complete round to continue',
      liveBtn: 'Live',
      blankBtn: 'Blank',
      nextMag: 'Next mag',
      winRound: 'Win (Round)',
      loss: 'Loss',
      undoAction: '[U] Undo Action',
      orderUnknown: 'Order unknown - probabilities only',
      historyTitle: 'Round History',
      historyEmpty: 'No shots recorded',
      shotLive: 'LIVE',
      shotBlank: 'BLANK',
      sessionStats: 'Session Stats',
      totalShots: 'Total Shots',
      matchControl: 'Match Control',
      resetMag: 'Reset mag',
      interfaceMode: 'Interface Mode',
      fullMode: 'Full',
      maxCap: 'MAX',
      ver: 'VER',
      skip: 'Skip'
    }
  }
} as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('buckshot_language') as Language;
    if (saved && (saved === 'ru' || saved === 'en')) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'en' || browserLang === 'ru') {
        setLanguageState(browserLang as Language);
      }
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('buckshot_language', lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      if (result === undefined) break;
      result = result[k];
    }
    let resStr = typeof result === 'string' ? result : key;
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        resStr = resStr.replace(`{${k}}`, String(v));
      }
    }
    return resStr;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
