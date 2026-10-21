import React, { useState } from 'react';
import { Link, useRouter } from '../context/RouterContext';
import { Moon, Sun, ShieldCheck, ChevronDown, Menu, X } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  totalWords: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  toggleTheme,
  totalWords,
}) => {
  const { path } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Strictly only URLs from the user list
  const primaryNav = [
    { href: '/', label: 'Home' },
    { href: '/words-starting-with-a', label: 'Starts with A' },
    { href: '/5-letter-words', label: '5-Letter Words' },
    { href: '/2-letter-words', label: '2-Letter Words' },
    { href: '/best-wordle-starting-words', label: 'Best Wordle Starters' },
  ];

  const featuredLinks = [
    { href: '/3-letter-words', label: '3-Letter Words' },
    { href: '/4-letter-words', label: '4-Letter Words' },
    { href: '/6-letter-words', label: '6-Letter Words' },
    { href: '/7-letter-words', label: '7-Letter Words' },
    { href: '/8-letter-words', label: '8-Letter Words' },
    { href: '/10-letter-words', label: '10-Letter Words' },
    { href: '/words-starting-with-ch', label: 'Words Starting with CH' },
    { href: '/words-starting-with-th', label: 'Words Starting with TH' },
    { href: '/words-starting-with-sh', label: 'Words Starting with SH' },
    { href: '/words-starting-with-qu', label: 'Words Starting with QU' },
    { href: '/words-containing-b', label: 'Words Containing B' },
    { href: '/words-containing-q', label: 'Words Containing Q' },
    { href: '/words-starting-with-y-ending-with-y', label: 'Words Starting & Ending with Y' },
    { href: '/long-words', label: 'Long Words (8+ Letters)' },
    { href: '/short-words', label: 'Short Words' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand: ReptileBirds */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md relative select-none group-hover:bg-teal-800 transition-colors">
              R
              <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-teal-200">1</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
                ReptileBirds
              </span>
              <div className="text-xs text-stone-500 dark:text-stone-400 hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Verified Lexicon Engine ({totalWords.toLocaleString()} words)</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (strictly from user URLs) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNav.map((link) => {
              const isActive = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Quick Word Lists Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  dropdownOpen
                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>More Word Lists</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-fade-in max-h-[75vh] overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Popular Word Patterns
                    </div>
                    {featuredLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                          path === item.href ? 'text-teal-700 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/40' : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-mono text-[10px] text-stone-400">{item.href}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white lg:hidden hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Open navigation menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (strictly from user URLs) */}
        {menuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {primaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    path === link.href
                      ? 'bg-teal-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                Featured Lists
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {featuredLinks.slice(0, 10).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      path === item.href
                        ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
