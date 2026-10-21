import React, { useState, useMemo } from 'react';
import { WordEntry, SortOption } from '../types';
import { ALL_WORDS } from '../utils/wordUtils';
import { Link } from '../context/RouterContext';
import { Search, Copy, Check, Star, ArrowUpDown, Award, BookOpen, Layers, ShieldCheck, ArrowRight, HelpCircle, Hash } from 'lucide-react';

export interface PageMeta {
  path: string;
  title: string;
  heading: string;
  description: string;
  ruleType: string;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  containsA?: string;
  containsB?: string;
  length?: number;
  minLen?: number;
  maxLen?: number;
}

interface WordPatternPageProps {
  pageMeta: PageMeta;
  onSelectWord: (word: WordEntry) => void;
  savedWords: Set<string>;
  onToggleSave: (w: string) => void;
}

export const WordPatternPage: React.FC<WordPatternPageProps> = ({
  pageMeta,
  onSelectWord,
  savedWords,
  onToggleSave,
}) => {
  const [inPageSearch, setInPageSearch] = useState('');
  const [selectedLength, setSelectedLength] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'tiles' | 'compact'>('tiles');

  // Match words according to this page's unique rule
  const baseWords = useMemo(() => {
    const s = pageMeta.path.replace(/^\//, '');

    // custom rules
    if (s === 'words-starting-with-y-ending-with-y') {
      return ALL_WORDS.filter(w => w.word.startsWith('y') && w.word.endsWith('y'));
    }
    if (s === 'best-wordle-starting-words') {
      const topPicks = ['soare', 'roate', 'raise', 'slate', 'crane', 'trace', 'adieu', 'audio', 'stare', 'salet', 'tears', 'react', 'later', 'irate', 'arise', 'canoe', 'route', 'clean', 'stone'];
      return ALL_WORDS.filter(w => topPicks.includes(w.word) || (w.len === 5 && (new Set(w.word)).size === 5 && /[aeiou]/.test(w.word))).slice(0, 50);
    }
    if (s === 'positive-words-starting-with-a') {
      return ALL_WORDS.filter(w => w.word.startsWith('a'));
    }
    if (s === 'cool-words-starting-with-a') {
      return ALL_WORDS.filter(w => w.word.startsWith('a') && (w.word.includes('x') || w.word.includes('z') || w.len >= 6));
    }
    if (s === 'easy-words-starting-with-e') {
      return ALL_WORDS.filter(w => w.word.startsWith('e') && w.len <= 5);
    }
    if (s === 'synonyms-to-begin-with') {
      return ALL_WORDS.filter(w => ['start', 'begin', 'launch', 'initiate', 'commence', 'originate', 'open', 'lead'].some(p => w.word.includes(p)) || w.word.startsWith('in'));
    }

    // long / short
    if (pageMeta.ruleType === 'long-start' && pageMeta.startsWith) {
      return ALL_WORDS.filter(w => w.len >= 8 && w.word.startsWith(pageMeta.startsWith!));
    }
    if (pageMeta.ruleType === 'long') {
      return ALL_WORDS.filter(w => w.len >= 8);
    }
    if (pageMeta.ruleType === 'short-start' && pageMeta.startsWith) {
      return ALL_WORDS.filter(w => w.len <= 4 && w.word.startsWith(pageMeta.startsWith!));
    }
    if (pageMeta.ruleType === 'short') {
      return ALL_WORDS.filter(w => w.len <= 4);
    }

    // length and starts with
    if (pageMeta.ruleType === 'len-start' && pageMeta.length && pageMeta.startsWith) {
      return ALL_WORDS.filter(w => w.len === pageMeta.length && w.word.startsWith(pageMeta.startsWith!));
    }

    // length and contains
    if (pageMeta.ruleType === 'len-contains' && pageMeta.length && pageMeta.contains) {
      return ALL_WORDS.filter(w => w.len === pageMeta.length && w.word.includes(pageMeta.contains!));
    }

    // exact length
    if (pageMeta.ruleType === 'len' && pageMeta.length) {
      return ALL_WORDS.filter(w => w.len === pageMeta.length);
    }

    // contains two letters
    if (pageMeta.ruleType === 'contains-two' && pageMeta.containsA && pageMeta.containsB) {
      return ALL_WORDS.filter(w => w.word.includes(pageMeta.containsA!) && w.word.includes(pageMeta.containsB!));
    }

    // contains
    if (pageMeta.ruleType === 'contains' && pageMeta.contains) {
      return ALL_WORDS.filter(w => w.word.includes(pageMeta.contains!));
    }

    // starts with
    if (pageMeta.ruleType === 'start' && pageMeta.startsWith) {
      return ALL_WORDS.filter(w => w.word.startsWith(pageMeta.startsWith!));
    }

    return ALL_WORDS.slice(0, 100);
  }, [pageMeta]);

  // Available lengths in this set
  const availableLengths = useMemo(() => {
    const set = new Set(baseWords.map(w => w.len));
    return Array.from(set).sort((a, b) => a - b);
  }, [baseWords]);

  // Filter & Sort
  const filteredWords = useMemo(() => {
    let list = [...baseWords];

    const q = inPageSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(w => w.word.toLowerCase().includes(q));
    }

    if (selectedLength !== 'all') {
      list = list.filter(w => w.len === selectedLength);
    }

    switch (sortBy) {
      case 'score-desc':
        list.sort((a, b) => b.stdScore - a.stdScore || a.word.localeCompare(b.word));
        break;
      case 'score-asc':
        list.sort((a, b) => a.stdScore - b.stdScore || a.word.localeCompare(b.word));
        break;
      case 'length-desc':
        list.sort((a, b) => b.len - a.len || b.stdScore - a.stdScore);
        break;
      case 'length-asc':
        list.sort((a, b) => a.len - b.len || b.stdScore - a.stdScore);
        break;
      case 'alpha-asc':
        list.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'alpha-desc':
        list.sort((a, b) => b.word.localeCompare(a.word));
        break;
    }

    return list;
  }, [baseWords, inPageSearch, selectedLength, sortBy]);

  const topScorer = filteredWords[0] || baseWords[0];
  const avgPoints = useMemo(() => {
    if (baseWords.length === 0) return 0;
    const sum = baseWords.reduce((acc, w) => acc + w.stdScore, 0);
    return Math.round((sum / baseWords.length) * 10) / 10;
  }, [baseWords]);

  const handleCopy = (w: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  // Generate quick sibling shortcuts based on page type
  const relatedShortcuts = useMemo(() => {
    const list: { label: string; href: string }[] = [];
    const s = pageMeta.path.replace(/^\//, '');

    // If starts with single letter e.g. words-starting-with-a
    const mLetter = s.match(/^words-starting-with-([a-z])$/);
    if (mLetter) {
      const cur = mLetter[1];
      const charCode = cur.charCodeAt(0);
      if (charCode > 97) list.push({ label: `Previous: Starting with ${String.fromCharCode(charCode - 1).toUpperCase()}`, href: `/words-starting-with-${String.fromCharCode(charCode - 1)}` });
      if (charCode < 122) list.push({ label: `Next: Starting with ${String.fromCharCode(charCode + 1).toUpperCase()}`, href: `/words-starting-with-${String.fromCharCode(charCode + 1)}` });
      list.push({ label: `5-Letter Words Starting with ${cur.toUpperCase()}`, href: `/5-letter-words-starting-with-${cur}` });
      list.push({ label: `4-Letter Words Starting with ${cur.toUpperCase()}`, href: `/4-letter-words-starting-with-${cur}` });
    }

    // If 5-letter-words-starting-with-X
    const m5 = s.match(/^5-letter-words-starting-with-([a-z])$/);
    if (m5) {
      const cur = m5[1];
      list.push({ label: `All 5-Letter Words`, href: `/5-letter-words` });
      list.push({ label: `All Words Starting with ${cur.toUpperCase()}`, href: `/words-starting-with-${cur}` });
      list.push({ label: `4-Letter Words Starting with ${cur.toUpperCase()}`, href: `/4-letter-words-starting-with-${cur}` });
      list.push({ label: `Best Wordle Starting Words`, href: `/best-wordle-starting-words` });
    }

    // If N-letter-words
    const mLen = s.match(/^(\d+)-letter-words$/);
    if (mLen) {
      list.push({ label: `2-Letter Words`, href: `/2-letter-words` });
      list.push({ label: `5-Letter Words`, href: `/5-letter-words` });
      list.push({ label: `Words Starting with A`, href: `/words-starting-with-a` });
    }

    return list;
  }, [pageMeta]);

  return (
    <div className="space-y-6">
      {/* Hero Header for this Unique Page */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
                {pageMeta.path}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                ReptileBirds
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              {pageMeta.heading}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              {pageMeta.description}
            </p>
          </div>

          {/* Quick Stats Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 shrink-0">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-center min-w-[120px]">
              <span className="text-2xl font-black text-teal-900 dark:text-teal-200 block font-mono">
                {baseWords.length}
              </span>
              <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                Verified Words
              </span>
            </div>
            {topScorer && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center min-w-[120px]">
                <span className="text-2xl font-black text-amber-900 dark:text-amber-200 block font-mono">
                  {topScorer.stdScore} pts
                </span>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  Top Score ({topScorer.word})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Filter & Controls Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={inPageSearch}
              onChange={(e) => setInPageSearch(e.target.value)}
              placeholder={`Search within these ${baseWords.length} words...`}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          {availableLengths.length > 1 ? (
            <div>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="all">All Lengths ({baseWords.length})</option>
                {availableLengths.map((len) => (
                  <option key={len} value={len}>
                    {len} Letters
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-2 text-xs font-mono font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center">
              Length: {availableLengths[0] || 0} letters
            </div>
          )}

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            >
              <option value="score-desc">Points: High to Low</option>
              <option value="score-asc">Points: Low to High</option>
              <option value="length-desc">Length: Longest First</option>
              <option value="length-asc">Length: Shortest First</option>
              <option value="alpha-asc">Alphabetical: A to Z</option>
              <option value="alpha-desc">Alphabetical: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="font-extrabold text-base text-stone-900 dark:text-white">
          {filteredWords.length} Words Matched
        </span>
        <div className="flex items-center space-x-1.5 border border-stone-200 dark:border-stone-800 p-0.5 rounded-lg bg-stone-100 dark:bg-stone-800">
          <button
            onClick={() => setDisplayMode('tiles')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              displayMode === 'tiles' ? 'bg-white dark:bg-stone-700 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-stone-500'
            }`}
          >
            Tile Grid
          </button>
          <button
            onClick={() => setDisplayMode('compact')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              displayMode === 'compact' ? 'bg-white dark:bg-stone-700 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-stone-500'
            }`}
          >
            Compact
          </button>
        </div>
      </div>

      {/* Words Grid Display */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
          <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <h4 className="font-bold text-stone-800 dark:text-stone-200">No matching words</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Try adjusting your in-page search or length filter.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-2.5 ${
            displayMode === 'tiles'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {filteredWords.slice(0, 300).map((item) => (
            <div
              key={item.word}
              onClick={() => onSelectWord(item)}
              className="group p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-teal-500 hover:shadow-sm cursor-pointer flex items-center justify-between transition-all"
            >
              <div>
                <span className="font-mono font-bold text-base uppercase text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 block">
                  {item.word}
                </span>
                <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                  {item.stdScore} pts <span className="text-stone-400 font-normal">({item.len}L)</span>
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(item.word);
                  }}
                  className="p-1 text-stone-400 hover:text-amber-500 transition-colors"
                  title="Bookmark word"
                >
                  <Star className={`w-3.5 h-3.5 ${savedWords.has(item.word) ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
                <button
                  onClick={(e) => handleCopy(item.word, e)}
                  className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                  title="Copy word"
                >
                  {copiedWord === item.word ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sibling & Related Patterns Box */}
      {relatedShortcuts.length > 0 && (
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
            Related Pattern Pages
          </span>
          <div className="flex flex-wrap gap-2">
            {relatedShortcuts.map((sc) => (
              <Link
                key={sc.href}
                href={sc.href}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-teal-500 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 transition-all flex items-center gap-1.5"
              >
                <span>{sc.label}</span>
                <ArrowRight className="w-3 h-3 text-teal-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Game Strategy Context */}
      <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-2">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Strategic Tournament Rules</span>
        </div>
        <p className="leading-relaxed">
          Every word listed on this page is verified across official English tournament dictionaries. Standard valuations assign classic tile weights, while alternate values calculate digital game scoring. Click any word to view individual tile breakdowns, exact anagrams, and definitions.
        </p>
      </div>
    </div>
  );
};
