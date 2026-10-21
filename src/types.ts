export interface WordEntry {
  word: string;
  len: number;
  stdScore: number;
  altScore: number;
  categories: string[];
}

export type ActiveTab = 'finder' | 'wordle' | 'scorer' | 'curated' | 'saved';

export type SortOption = 'score-desc' | 'score-asc' | 'length-desc' | 'length-asc' | 'alpha-asc' | 'alpha-desc';

export interface SearchFilters {
  query: string;
  mode: 'anagram' | 'pattern' | 'contains';
  startsWith: string;
  endsWith: string;
  contains: string;
  excludes: string;
  length: number | 'all';
  category: string | 'all';
  sortBy: SortOption;
}

export interface WordleFilterState {
  exact: string[]; // 5 positions: '' or single letter
  present: string; // letters in the word but position not exact
  absent: string;  // letters not in the word
  disallowedAtPos: string[][]; // 5 positions of letters NOT at that position
}
