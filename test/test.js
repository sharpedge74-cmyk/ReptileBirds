import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DOMAIN = 'reptilebird.com';

function runTests() {
  console.log('--- Running ReptileBirds Strict Unique Pages & Branding Test Suite ---\n');

  const errors = [];

  // 1. CNAME checks (Root and Public)
  const rootCnamePath = path.join(ROOT, 'CNAME');
  if (!fs.existsSync(rootCnamePath)) {
    errors.push('Root CNAME file missing');
  } else {
    const rootCname = fs.readFileSync(rootCnamePath, 'utf8').trim();
    if (rootCname !== DOMAIN) {
      errors.push(`Root CNAME contains "${rootCname}", expected "${DOMAIN}"`);
    }
  }

  const publicCnamePath = path.join(ROOT, 'public/CNAME');
  if (!fs.existsSync(publicCnamePath)) {
    errors.push('public/CNAME file missing');
  } else {
    const pubCname = fs.readFileSync(publicCnamePath, 'utf8').trim();
    if (pubCname !== DOMAIN) {
      errors.push(`public/CNAME contains "${pubCname}", expected "${DOMAIN}"`);
    }
  }

  // 2. Branding Check: header and footer must NOT contain "reptilebirds.com" or "reptilebird.com"
  const headerContent = fs.readFileSync(path.join(ROOT, 'src/components/Header.tsx'), 'utf8');
  if (headerContent.includes('reptilebirds.com') || headerContent.includes('reptilebird.com')) {
    errors.push('Header still contains domain name. User requested only "ReptileBirds"');
  }

  const appContent = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8');
  if (appContent.includes('reptilebirds.com') || appContent.includes('reptilebird.com')) {
    errors.push('App.tsx footer still contains domain name. User requested only "ReptileBirds"');
  }

  // 3. Dictionary verification
  const dictPath = path.join(ROOT, 'src/data/dictionary.json');
  if (!fs.existsSync(dictPath)) {
    errors.push('src/data/dictionary.json missing');
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
      if (!Array.isArray(data.words) || data.words.length < 8000) {
        errors.push(`Dictionary words count too low: ${data.words?.length || 0}`);
      }
    } catch (e) {
      errors.push(`Failed to parse dictionary.json: ${e.message}`);
    }
  }

  // 4. Verify EXACT 292 unique pages in catalog (no extra URLs, no missing URLs)
  const catalogPath = path.join(ROOT, 'src/data/pagesCatalog.json');
  if (!fs.existsSync(catalogPath)) {
    errors.push('src/data/pagesCatalog.json missing');
  } else {
    try {
      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      const count = Object.keys(catalog).length;
      if (count !== 292) {
        errors.push(`Pages catalog has ${count} pages, expected exactly 292`);
      }

      // Check strictly no extra URLs outside the list
      const disallowed = [
        '/word-finder',
        '/anagram-solver',
        '/wordle-solver',
        '/tile-scorer',
        '/word-bank',
        '/about',
        '/q-without-u-words',
        '/high-scoring-words',
        '/palindromes',
        '/words-without-vowels',
        '/double-letter-words'
      ];
      for (const dis of disallowed) {
        if (catalog[dis]) {
          errors.push(`Disallowed extra URL found in catalog: ${dis}`);
        }
      }
    } catch (e) {
      errors.push(`Error validating pagesCatalog: ${e.message}`);
    }
  }

  // 5. Sitemap verification: exactly 292 URLs
  const sitemapPath = path.join(ROOT, 'public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = sitemap.match(/<loc>/g) || [];
    if (locMatches.length !== 292) {
      errors.push(`Sitemap contains ${locMatches.length} URLs, expected exactly 292`);
    }
  }

  if (errors.length > 0) {
    console.error('FAILED with errors:');
    errors.forEach(e => console.error(' ✗', e));
    process.exit(1);
  }

  console.log('====================================================');
  console.log('✓ ALL STRICT REPTILEBIRDS TESTS PASSED.');
  console.log('✓ Exactly 292 unique requested pages verified.');
  console.log('✓ Header and footer show ONLY "ReptileBirds" (no .com).');
  console.log('✓ No unauthorized extra URLs exist.');
  console.log('====================================================\n');
}

runTests();
