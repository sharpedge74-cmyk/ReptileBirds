import React from 'react';
import { STANDARD_SCORES } from '../utils/wordUtils';

interface WordTileProps {
  letter: string;
  size?: 'sm' | 'md' | 'lg';
  score?: number;
  highlight?: boolean;
}

export const WordTile: React.FC<WordTileProps> = ({
  letter,
  size = 'md',
  score,
  highlight = false,
}) => {
  const upper = letter.toUpperCase();
  const point = score !== undefined ? score : (STANDARD_SCORES[letter.toLowerCase()] ?? 0);

  const sizeClasses = {
    sm: 'w-7 h-8 text-sm',
    md: 'w-9 h-10 text-base',
    lg: 'w-12 h-14 text-xl',
  };

  const subClasses = {
    sm: 'text-[8px] right-0.5 bottom-0.5',
    md: 'text-[9px] right-1 bottom-0.5',
    lg: 'text-[11px] right-1.5 bottom-1',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold rounded shadow-sm border select-none transition-transform hover:-translate-y-0.5 ${sizeClasses[size]} ${
        highlight
          ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-200'
          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200'
      }`}
    >
      <span>{upper}</span>
      {point > 0 && (
        <span className={`absolute font-mono font-normal opacity-70 ${subClasses[size]}`}>
          {point}
        </span>
      )}
    </div>
  );
};
