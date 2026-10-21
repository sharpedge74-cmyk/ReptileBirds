import React, { useState, useMemo } from 'react';
import { WordEntry } from '../types';
import { Link } from '../context/RouterContext';
import { ALL_WORDS } from '../utils/wordUtils';
import { Search, Sparkles, ArrowRight, Grid3X3, Star, Zap, ShieldCheck, Copy, Check } from 'lucide-react';

interface HomePageProps {
  onSelectWord: (word: WordEntry) => void;
  savedWords: Set<string>;
  onToggleSave: (w: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectWord, savedWords, onToggleSave }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const lengths = [2, 3, 4, 5, 6, 7, 8, 10];
  const commonPrefixes = ['al', 'ar', 'ca', 'ch', 'co', 'de', 'ed', 'en', 'es', 'ex', 're', 'un', 'in', 'an', 'sh', 'st', 'th', 'tr', 'qu', 'flu'];
  const containingLetters = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 't', 'u', 'v', 'w', 'x'];

  const featuredCollections = [
    {
      path: '/5-letter-words',
      name: '5-Letter Words',
      desc: 'All verified 5-letter tournament words for daily Wordle deductions and rack plays.',
      badge: 'Popular',
    },
    {
      path: '/2-letter-words',
      name: '2-Letter Words',
      desc: 'Master parallel cross-hooks and score dual words on every tile play.',
      badge: 'Essential',
    },
    {
      path: '/best-wordle-starting-words',
      name: 'Best Wordle Starting Words',
      desc: 'Top openers with optimal letter frequencies and maximum vowel coverage.',
      badge: 'High Value',
    },
    {
      path: '/long-words',
      name: 'Long Words (8+ Letters)',
      desc: 'High-scoring 8, 9, and 10-letter words for big bingo rack plays.',
      badge: 'Bingos',
    },
  ];

  // Live in-page search results when user searches on homepage
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_WORDS.filter(w => w.word.startsWith(q) || w.word.includes(q)).slice(0, 30);
  }, [searchQuery]);

  const handleCopy = (w: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const quickPicks = ALL_WORDS.filter(w => ['qi', 'qat', 'qoph', 'syzygy', 'cwm', 'crwth', 'zax', 'jinx'].includes(w.word));

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Dedicated Word Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
          ReptileBirds Word Discovery Engine
        </h1>
        <p className="mt-3 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
          Explore over 290 specialized word lists and pattern collections with live sorting, tile scoring, and instant search.
        </p>

        {/* Live Search Launch Bar */}
        <div className="mt-6 max-w-xl mx-auto relative shadow-lg rounded-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 8,000+ words instantly (e.g. QAT, CRANE, RE...)..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-teal-600/40 dark:border-teal-500/40 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 text-base font-mono"
            />
          </div>

          {/* Live Search Dropdown */}
          {liveSearchResults.length > 0 && (
            <div className="mt-2 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl max-h-80 overflow-y-auto text-left">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 px-1">
                Matching Words ({liveSearchResults.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {liveSearchResults.map((item) => (
                  <div
                    key={item.word}
                    onClick={() => onSelectWord(item)}
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-stone-200 dark:border-stone-700 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-sm uppercase text-stone-900 dark:text-stone-100 block">
                        {item.word}
                      </span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold">
                        {item.stdScore} pts
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleCopy(item.word, e)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      {copiedWord === item.word ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Collections Grid (strictly from user URLs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredCollections.map((col) => (
          <Link
            key={col.path}
            href={col.path}
            className="group p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">🔤</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  {col.badge}
                </span>
              </div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                {col.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                {col.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
              <span>View List</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </section>

      {/* Directory 1: Words Starting With A to Z */}
      <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="text-teal-600">🔤</span>
              <span>Words Starting With (A–Z)</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Dedicated pages for every initial letter in the alphabet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
          {alphabet.map((letter) => (
            <Link
              key={letter}
              href={`/words-starting-with-${letter}`}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-all text-center group"
            >
              <span className="font-mono font-black text-xl text-stone-800 dark:text-stone-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 uppercase block">
                {letter}
              </span>
              <span className="text-[10px] text-stone-400 group-hover:text-teal-600 block mt-0.5">
                Start
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Directory 2: Words by Length */}
      <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="text-teal-600">📏</span>
              <span>Words by Length</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Browse legal tournament words grouped by exact letter counts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {lengths.map((len) => (
            <Link
              key={len}
              href={`/${len}-letter-words`}
              className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-all text-center group"
            >
              <span className="font-mono font-black text-xl text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 block">
                {len}L
              </span>
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 group-hover:text-teal-600 block mt-0.5">
                {len}-Letter
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Directory 3: Common Prefix & Multi-Letter Starts */}
      <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="text-teal-600">⚡</span>
              <span>Popular Prefix Pages</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Targeted word lists for popular 2-letter and 3-letter starting sequences.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonPrefixes.map((pfx) => (
            <Link
              key={pfx}
              href={`/words-starting-with-${pfx}`}
              className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-mono font-bold uppercase transition-all"
            >
              Starts with {pfx}
            </Link>
          ))}
        </div>
      </section>

      {/* Directory 4: Words Containing Letters */}
      <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="text-teal-600">🔍</span>
              <span>Words Containing Specific Letters</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Filter words by embedded tiles anywhere in the word.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {containingLetters.map((l) => (
            <Link
              key={l}
              href={`/words-containing-${l}`}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-teal-500 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-mono font-bold uppercase transition-all"
            >
              Contains {l}
            </Link>
          ))}
          <Link
            href="/words-containing-a-and-n"
            className="px-3 py-1.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/50 text-xs font-mono font-bold uppercase transition-all text-teal-800 dark:text-teal-300"
          >
            Contains A &amp; N
          </Link>
          <Link
            href="/words-containing-i-and-r"
            className="px-3 py-1.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/50 text-xs font-mono font-bold uppercase transition-all text-teal-800 dark:text-teal-300"
          >
            Contains I &amp; R
          </Link>
        </div>
      </section>

      {/* Special Highlights Banner */}
      <section className="bg-stone-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300 block mb-1">
              Curated Highlights
            </span>
            <h3 className="text-lg font-black text-white">
              Tactical High-Scorers &amp; Wordle Openers
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/best-wordle-starting-words"
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors"
            >
              Best Wordle Starting Words
            </Link>
            <Link
              href="/words-starting-with-y-ending-with-y"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              Y to Y Words
            </Link>
            <Link
              href="/long-words"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              Long Words (8+ Letters)
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2">
          {quickPicks.map((pick) => (
            <div
              key={pick.word}
              onClick={() => onSelectWord(pick)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/10 cursor-pointer text-center transition-all"
            >
              <span className="font-mono font-black text-base uppercase block">
                {pick.word}
              </span>
              <span className="text-[10px] text-teal-300 font-bold block mt-0.5">
                {pick.stdScore} pts
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Standards Footnote */}
      <section className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
        <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400 shrink-0" />
        <div>
          <span className="font-bold text-stone-800 dark:text-stone-200 block text-sm">
            Standard Lexicon Verification
          </span>
          <span>
            All 8,281 words cross-verified against standard English tournament dictionaries. Dual point scores computed automatically.
          </span>
        </div>
      </section>
    </div>
  );
};
