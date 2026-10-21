import rawPagesCatalog from './data/pagesCatalog.json';

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

export const PAGES_CATALOG = rawPagesCatalog as Record<string, PageMeta>;
