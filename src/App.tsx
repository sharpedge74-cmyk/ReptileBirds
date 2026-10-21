import React, { useState, useEffect } from 'react';
import { WordEntry } from './types';
import { RouterProvider, useRouter, Link } from './context/RouterContext';
import rawPagesCatalog from './data/pagesCatalog.json';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WordPatternPage, PageMeta } from './pages/WordPatternPage';
import { WordDetailModal } from './components/WordDetailModal';
import { ALL_WORDS } from './utils/wordUtils';
import { AlertCircle } from 'lucide-react';

const pagesCatalog = rawPagesCatalog as Record<string, PageMeta>;

function AppContent() {
  const { path } = useRouter();
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('reptilebirds_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [savedWords, setSavedWords] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('reptilebirds_saved');
        if (stored) return new Set(JSON.parse(stored));
      } catch {}
    }
    return new Set(['qi', 'za', 'qat', 'syzygy', 'cwm']);
  });

  // Dynamic Page Title & Meta Description update for each unique page
  useEffect(() => {
    const pageMeta = pagesCatalog[path];
    if (pageMeta) {
      document.title = pageMeta.title;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageMeta.description);
      }
    } else {
      document.title = 'Page Not Found - ReptileBirds';
    }
  }, [path]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('reptilebirds_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('reptilebirds_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('reptilebirds_saved', JSON.stringify(Array.from(savedWords)));
    } catch {}
  }, [savedWords]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const toggleSaveWord = (word: string) => {
    setSavedWords(prev => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const renderCurrentPage = () => {
    // 1. Homepage (/)
    if (path === '/') {
      return (
        <HomePage
          onSelectWord={setSelectedWord}
          savedWords={savedWords}
          onToggleSave={toggleSaveWord}
        />
      );
    }

    // 2. Any of the 291 specific pages requested by user
    if (pagesCatalog[path]) {
      return (
        <WordPatternPage
          pageMeta={pagesCatalog[path]}
          onSelectWord={setSelectedWord}
          savedWords={savedWords}
          onToggleSave={toggleSaveWord}
        />
      );
    }

    // 3. 404 fallback
    return (
      <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 max-w-xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-black text-stone-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          The requested page URL was not found. Browse popular word lists below.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/5-letter-words"
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
          >
            5-Letter Words
          </Link>
          <Link
            href="/2-letter-words"
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
          >
            2-Letter Words
          </Link>
          <Link
            href="/words-starting-with-a"
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
          >
            Words Starting With A
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        totalWords={ALL_WORDS.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentPage()}
      </main>

      {/* Multi-Page Clean Footer: ReptileBirds */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-base select-none">
                  R
                </div>
                <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-white">
                  ReptileBirds
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Dedicated word discovery and puzzle deduction engine with 0ms local execution.
              </p>
            </div>

            {/* Column 1: Words by Length */}
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
                Words By Length
              </span>
              <ul className="space-y-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                <li><Link href="/2-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">2-Letter Words</Link></li>
                <li><Link href="/3-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">3-Letter Words</Link></li>
                <li><Link href="/4-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">4-Letter Words</Link></li>
                <li><Link href="/5-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">5-Letter Words</Link></li>
                <li><Link href="/6-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">6-Letter Words</Link></li>
                <li><Link href="/7-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">7-Letter Words</Link></li>
                <li><Link href="/8-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">8-Letter Words</Link></li>
                <li><Link href="/10-letter-words" className="hover:text-teal-600 dark:hover:text-teal-300">10-Letter Words</Link></li>
              </ul>
            </div>

            {/* Column 2: Words Starting With */}
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
                Words Starting With
              </span>
              <ul className="space-y-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                <li><Link href="/words-starting-with-a" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with A</Link></li>
                <li><Link href="/words-starting-with-b" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with B</Link></li>
                <li><Link href="/words-starting-with-c" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with C</Link></li>
                <li><Link href="/words-starting-with-s" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with S</Link></li>
                <li><Link href="/words-starting-with-re" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with RE</Link></li>
                <li><Link href="/words-starting-with-un" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with UN</Link></li>
                <li><Link href="/words-starting-with-in" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with IN</Link></li>
                <li><Link href="/words-starting-with-qu" className="hover:text-teal-600 dark:hover:text-teal-300">Starting with QU</Link></li>
              </ul>
            </div>

            {/* Column 3: Tactical Collections */}
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
                Featured Lists
              </span>
              <ul className="space-y-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                <li><Link href="/best-wordle-starting-words" className="hover:text-teal-600 dark:hover:text-teal-300">Best Wordle Starting Words</Link></li>
                <li><Link href="/words-starting-with-y-ending-with-y" className="hover:text-teal-600 dark:hover:text-teal-300">Words Starting &amp; Ending with Y</Link></li>
                <li><Link href="/words-containing-b" className="hover:text-teal-600 dark:hover:text-teal-300">Words Containing B</Link></li>
                <li><Link href="/words-containing-a-and-n" className="hover:text-teal-600 dark:hover:text-teal-300">Words Containing A &amp; N</Link></li>
                <li><Link href="/long-words" className="hover:text-teal-600 dark:hover:text-teal-300">Long Words</Link></li>
                <li><Link href="/short-words" className="hover:text-teal-600 dark:hover:text-teal-300">Short Words</Link></li>
                <li><Link href="/positive-words-starting-with-a" className="hover:text-teal-600 dark:hover:text-teal-300">Positive Words Starting with A</Link></li>
                <li><Link href="/cool-words-starting-with-a" className="hover:text-teal-600 dark:hover:text-teal-300">Cool Words Starting with A</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
            <div>
              &copy; {new Date().getFullYear()} ReptileBirds. All rights reserved.
            </div>
            <div className="text-[11px] text-stone-400">
              Verified lexicon analysis &amp; tournament game reference engine.
            </div>
          </div>
        </div>
      </footer>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          isSaved={savedWords.has(selectedWord.word)}
          onToggleSave={toggleSaveWord}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
