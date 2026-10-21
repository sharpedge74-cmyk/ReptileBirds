import rawDict from '../data/dictionary.json';
import { WordEntry, WordleFilterState } from '../types';

export const STANDARD_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1,
  j: 8, k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1,
  s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10
};

export const ALTERNATE_SCORES: Record<string, number> = {
  a: 1, b: 4, c: 4, d: 2, e: 1, f: 4, g: 3, h: 3, i: 1,
  j: 10, k: 5, l: 2, m: 4, n: 2, o: 1, p: 4, q: 10, r: 1,
  s: 1, t: 1, u: 2, v: 5, w: 4, x: 8, y: 3, z: 10
};

export function calcScore(word: string, alt = false): number {
  const table = alt ? ALTERNATE_SCORES : STANDARD_SCORES;
  let total = 0;
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    total += table[char] || 0;
  }
  return total;
}

// Build inverted index for fast category lookup
const catMap = new Map<string, string[]>();
const rawCategories = (rawDict as { categories: Record<string, string[]> }).categories;
for (const [catName, catWords] of Object.entries(rawCategories)) {
  for (const w of catWords) {
    const existing = catMap.get(w);
    if (existing) {
      existing.push(catName);
    } else {
      catMap.set(w, [catName]);
    }
  }
}

export const ALL_WORDS: WordEntry[] = (rawDict as { words: string[] }).words.map((w: string) => {
  return {
    word: w,
    len: w.length,
    stdScore: calcScore(w, false),
    altScore: calcScore(w, true),
    categories: catMap.get(w) || []
  };
});

export const WORD_SET = new Set<string>((rawDict as { words: string[] }).words);

export const CATEGORY_DEFINITIONS: { id: string; label: string; desc: string; icon: string }[] = [
  { id: 'twoLetter', label: '2-Letter Words', desc: 'All valid 2-letter hook plays for parallel scoring', icon: '🎯' },
  { id: 'qWithoutU', label: 'Q Without U', desc: 'High-value Q words without requiring a U (qi, qat, qanat...)', icon: '⚡' },
  { id: 'highScorers', label: 'High Scorers (Q, Z, X, J)', desc: 'Words packed with top point tiles', icon: '💎' },
  { id: 'palindromes', label: 'Palindromes', desc: 'Words reading identically forwards and backwards', icon: '🔄' },
  { id: 'noVowels', label: 'Words Without Vowels', desc: 'Vowelless words (crwth, sh, hmm, crypts)', icon: '🔇' },
  { id: 'doubleLetters', label: 'Double Letters', desc: 'Words featuring twin consonants or vowels', icon: '👥' },
  { id: 'adjectives', label: 'Descriptive Adjectives', desc: 'Sensory and vibrant adjectives for puzzle and prose', icon: '✨' },
  { id: 'verbs', label: 'Dynamic Action Verbs', desc: 'Impactful verbs for storytelling and game play', icon: '⚡' },
  { id: 'nouns', label: 'Concrete Nouns', desc: 'Clear, tangible noun vocabulary', icon: '📦' },
  { id: 'adverbs', label: 'Expressive Adverbs', desc: 'Manner and frequency modifying words', icon: '🌟' },
  { id: 'interjections', label: 'Interjections', desc: 'Exclamations and emotive expressions', icon: '💥' },
  { id: 'onomatopoeia', label: 'Onomatopoeia', desc: 'Phonetically imitative sound words', icon: '🔔' },
  { id: 'positive', label: 'Positive Words', desc: 'Uplifting and encouraging vocabulary', icon: '☀️' },
  { id: 'power', label: 'Power Words', desc: 'High-impact persuasive words for writing', icon: '🔥' }
];

export function solveAnagram(rack: string): WordEntry[] {
  const cleanRack = rack.toLowerCase().replace(/[^a-z?*]/g, '');
  if (!cleanRack) return [];

  const letterCounts: Record<string, number> = {};
  let wildcards = 0;

  for (const ch of cleanRack) {
    if (ch === '?' || ch === '*') {
      wildcards++;
    } else {
      letterCounts[ch] = (letterCounts[ch] || 0) + 1;
    }
  }

  const rackLen = cleanRack.length;
  const results: WordEntry[] = [];

  for (const entry of ALL_WORDS) {
    if (entry.len > rackLen) continue;

    // Check if entry.word can be formed
    const tempWordCounts: Record<string, number> = {};
    for (let i = 0; i < entry.word.length; i++) {
      const ch = entry.word[i];
      tempWordCounts[ch] = (tempWordCounts[ch] || 0) + 1;
    }

    let neededWildcards = 0;
    let match = true;

    for (const [ch, count] of Object.entries(tempWordCounts)) {
      const available = letterCounts[ch] || 0;
      if (available < count) {
        neededWildcards += (count - available);
        if (neededWildcards > wildcards) {
          match = false;
          break;
        }
      }
    }

    if (match) {
      results.push(entry);
    }
  }

  return results;
}

export function filterWordleCandidates(state: WordleFilterState): WordEntry[] {
  const fiveLetterWords = ALL_WORDS.filter(w => w.len === 5);
  const absentSet = new Set(state.absent.toLowerCase().split('').filter(c => /[a-z]/.test(c)));
  const presentLetters = state.present.toLowerCase().split('').filter(c => /[a-z]/.test(c));

  return fiveLetterWords.filter(entry => {
    const word = entry.word;

    // Check exact matches
    for (let i = 0; i < 5; i++) {
      const req = state.exact[i]?.toLowerCase();
      if (req && word[i] !== req) return false;
      // Disallowed at this position (yellow in that spot)
      if (state.disallowedAtPos[i]?.some(c => c.toLowerCase() === word[i])) {
        return false;
      }
    }

    // Check present letters are in word
    for (const pl of presentLetters) {
      if (!word.includes(pl)) return false;
    }

    // Check absent letters (unless they are also marked exact or present elsewhere)
    for (const al of absentSet) {
      // If the absent letter was also marked as exact or present (duplicate handling), skip
      const isKnown = state.exact.some(e => e.toLowerCase() === al) || presentLetters.includes(al);
      if (!isKnown && word.includes(al)) {
        return false;
      }
    }

    return true;
  });
}

// Compute letter frequency ranking for Wordle candidate recommendations
export function getWordleLetterFrequencies(candidates: WordEntry[]): { letter: string; count: number; pct: number }[] {
  if (candidates.length === 0) return [];
  const counts: Record<string, number> = {};

  for (const c of candidates) {
    const seen = new Set<string>();
    for (const ch of c.word) {
      if (!seen.has(ch)) {
        counts[ch] = (counts[ch] || 0) + 1;
        seen.add(ch);
      }
    }
  }

  return Object.entries(counts)
    .map(([letter, count]) => ({
      letter,
      count,
      pct: Math.round((count / candidates.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

export function getBestWordleGuesses(candidates: WordEntry[]): WordEntry[] {
  const freq = getWordleLetterFrequencies(candidates);
  const scoreMap = new Map(freq.map(f => [f.letter, f.count]));

  return [...candidates].sort((a, b) => {
    // Unique letters count higher for guessing information
    const setA = new Set(a.word);
    const setB = new Set(b.word);
    let entropyA = 0;
    let entropyB = 0;
    for (const ch of setA) entropyA += scoreMap.get(ch) || 0;
    for (const ch of setB) entropyB += scoreMap.get(ch) || 0;
    return entropyB - entropyA;
  });
}
