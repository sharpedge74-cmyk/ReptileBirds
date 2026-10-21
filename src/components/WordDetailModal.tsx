import React, { useState } from 'react';
import { WordEntry } from '../types';
import { WordTile } from './WordTile';
import { X, Copy, Check, Star, ExternalLink, Hash, Award } from 'lucide-react';
import { ALL_WORDS } from '../utils/wordUtils';

interface WordDetailModalProps {
  word: WordEntry | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (w: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!word) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(word.word);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vowels = word.word.split('').filter(c => /[aeiou]/i.test(c)).length;
  const consonants = word.word.length - vowels;

  // Find exact anagrams of this word
  const sortedLetters = word.word.toLowerCase().split('').sort().join('');
  const anagrams = ALL_WORDS.filter(
    w => w.word !== word.word && w.word.length === word.word.length && w.word.toLowerCase().split('').sort().join('') === sortedLetters
  ).map(w => w.word);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Word Display in Big Tiles */}
        <div className="text-center mb-6 pt-2">
          <div className="flex items-center justify-center gap-1.5 flex-wrap mb-3">
            {word.word.split('').map((char, idx) => (
              <WordTile key={idx} letter={char} size="lg" />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              {word.word}
            </span>
            <button
              onClick={() => onToggleSave(word.word)}
              title={isSaved ? 'Remove from saved' : 'Save word'}
              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
            >
              <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Point Scoring Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Standard Points</span>
            </div>
            <div className="text-3xl font-extrabold text-teal-900 dark:text-teal-200">
              {word.stdScore}
            </div>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
              Classic rule valuation
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Alternate Points</span>
            </div>
            <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-200">
              {word.altScore}
            </div>
            <div className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
              Modern digital valuation
            </div>
          </div>
        </div>

        {/* Word Statistics */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl mb-5 text-center text-xs">
          <div>
            <span className="block text-stone-500 dark:text-stone-400">Length</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 text-base">{word.len} letters</span>
          </div>
          <div>
            <span className="block text-stone-500 dark:text-stone-400">Vowels</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 text-base">{vowels}</span>
          </div>
          <div>
            <span className="block text-stone-500 dark:text-stone-400">Consonants</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 text-base">{consonants}</span>
          </div>
        </div>

        {/* Categories / Tags */}
        {word.categories.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
              Lexicon Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {word.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Anagrams if any */}
        {anagrams.length > 0 && (
          <div className="mb-5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
              Exact Anagrams ({anagrams.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {anagrams.map((ana) => (
                <span
                  key={ana}
                  className="px-2.5 py-0.5 text-xs font-mono font-bold rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                >
                  {ana}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Dictionary Link */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
          <a
            href={`https://en.wiktionary.org/wiki/${word.word}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>View definition on Wiktionary</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
