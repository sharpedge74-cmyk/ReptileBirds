import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// 1. Enrich words.txt with standard tournament English words of all lengths
const twoLetterWords = [
  'aa', 'ab', 'ad', 'ae', 'ag', 'ah', 'ai', 'al', 'am', 'an', 'ar', 'as', 'at', 'aw', 'ax', 'ay',
  'ba', 'be', 'bi', 'bo', 'by', 'de', 'do', 'ed', 'ef', 'eh', 'el', 'em', 'en', 'er', 'es', 'et',
  'ex', 'fa', 'fe', 'gi', 'go', 'ha', 'he', 'hi', 'hm', 'ho', 'id', 'if', 'in', 'is', 'it', 'jo',
  'ka', 'ki', 'la', 'li', 'lo', 'ma', 'me', 'mi', 'mm', 'mo', 'mu', 'my', 'na', 'ne', 'no', 'nu',
  'od', 'oe', 'of', 'oh', 'oi', 'ok', 'om', 'on', 'op', 'or', 'os', 'ow', 'ox', 'oy', 'pa', 'pe',
  'pi', 'po', 'qi', 're', 'sh', 'si', 'so', 'ta', 'ti', 'to', 'uh', 'um', 'un', 'up', 'us', 'ut',
  'we', 'wo', 'xi', 'xu', 'ya', 'ye', 'yo', 'za'
];

const threeLetterWords = [
  'ace', 'act', 'add', 'ado', 'aft', 'age', 'ago', 'aid', 'aim', 'air', 'ale', 'all', 'amp', 'and', 'ant',
  'any', 'ape', 'app', 'apt', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ask', 'asp', 'ass', 'ate', 'awe',
  'axe', 'aye', 'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bin',
  'bit', 'boa', 'bob', 'bog', 'boo', 'bop', 'bow', 'box', 'boy', 'bra', 'bud', 'bug', 'bum', 'bun', 'bus',
  'but', 'buy', 'bye', 'cab', 'cad', 'cam', 'can', 'cap', 'car', 'cat', 'caw', 'cob', 'cod', 'cog', 'con',
  'coo', 'cop', 'cot', 'cow', 'cox', 'coy', 'cry', 'cub', 'cue', 'cup', 'cur', 'cut', 'dab', 'dad', 'dam',
  'dan', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'din', 'dip', 'doc', 'doe', 'dog', 'don', 'dot',
  'dry', 'dub', 'due', 'dug', 'dun', 'duo', 'dye', 'ear', 'eat', 'ebb', 'eel', 'egg', 'ego', 'elf', 'elk',
  'elm', 'emu', 'end', 'eon', 'era', 'eve', 'eye', 'fan', 'far', 'fat', 'fed', 'fee', 'fen', 'few', 'fez',
  'fib', 'fig', 'fin', 'fir', 'fit', 'fix', 'flu', 'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur'
];

const fourLetterWords = [
  'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball', 'band', 'bank', 'base', 'bath', 'bear',
  'beat', 'been', 'beer', 'bell', 'belt', 'best', 'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'bomb', 'bond', 'bone',
  'book', 'boom', 'born', 'boss', 'both', 'bowl', 'bulk', 'burn', 'bush', 'busy', 'call', 'calm', 'came', 'camp', 'card',
  'care', 'case', 'cash', 'cast', 'cell', 'chat', 'chip', 'city', 'club', 'coal', 'coat', 'code', 'cold', 'come', 'cook',
  'cool', 'cope', 'copy', 'core', 'cost', 'crew', 'crop', 'dark', 'data', 'date', 'dawn', 'dead', 'deal', 'dear', 'debt',
  'deep', 'deny', 'desk', 'dial', 'diet', 'disc', 'disk', 'does', 'done', 'door', 'dose', 'down', 'draw', 'drew', 'drop',
  'drug', 'dual', 'duke', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy', 'edge', 'even', 'ever', 'evil', 'exit',
  'face', 'fact', 'fade', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell', 'felt',
  'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five', 'flat', 'flow', 'folk', 'food', 'foot', 'ford'
];

const sixLetterWords = [
  'action', 'active', 'actual', 'advice', 'advise', 'affair', 'affect', 'afford', 'agency', 'agenda', 'almost', 'always',
  'amount', 'animal', 'annual', 'answer', 'anyone', 'appeal', 'appear', 'around', 'arrive', 'artist', 'aspect', 'assess',
  'assist', 'assume', 'attack', 'attend', 'author', 'avenue', 'backed', 'barely', 'battle', 'beauty', 'became', 'become',
  'before', 'behalf', 'behind', 'belief', 'belong', 'beside', 'better', 'beyond', 'bishop', 'bitter', 'border', 'borrow',
  'bother', 'bottle', 'bottom', 'bought', 'bounce', 'branch', 'breath', 'bridge', 'bright', 'broken', 'budget', 'burden',
  'bureau', 'button', 'camera', 'campus', 'cancer', 'candle', 'cannon', 'canvas', 'carbon', 'career', 'castle', 'casual',
  'caught', 'centre', 'chance', 'change', 'charge', 'choice', 'choose', 'church', 'circle', 'client', 'closed', 'closer',
  'coffee', 'column', 'combat', 'comedy', 'coming', 'common', 'comply', 'copper', 'corner', 'costly', 'county', 'couple',
  'course', 'covers', 'create', 'credit', 'crisis', 'custom', 'damage', 'danger', 'dealer', 'debate', 'decade', 'decide',
  'defeat', 'defend', 'define', 'degree', 'demand', 'depend', 'deputy', 'desert', 'design', 'desire', 'detail', 'detect'
];

const sevenLetterWords = [
  'ability', 'absence', 'academy', 'account', 'accused', 'achieve', 'acquire', 'address', 'advance', 'adviser', 'against',
  'airline', 'airport', 'alcohol', 'alleged', 'already', 'analyst', 'ancient', 'another', 'anxiety', 'anxious', 'anybody',
  'applied', 'arrange', 'arrival', 'article', 'assault', 'athlete', 'attempt', 'attract', 'auction', 'average', 'backing',
  'balance', 'banking', 'barrier', 'battery', 'bearing', 'beating', 'because', 'bedroom', 'believe', 'beneath', 'benefit',
  'besides', 'between', 'bicycle', 'biggest', 'billion', 'binding', 'blanket', 'blocked', 'boating', 'bombing', 'booking',
  'boredom', 'brother', 'builder', 'cabinet', 'caliber', 'calling', 'capable', 'capacity', 'capital', 'captain', 'capture',
  'careful', 'carrier', 'caution', 'ceiling', 'central', 'century', 'certain', 'chamber', 'channel', 'chapter', 'charity',
  'charter', 'checked', 'chemical', 'cheque', 'chicken', 'chronic', 'circuit', 'citizen', 'classic', 'climate', 'closely',
  'clothes', 'coastal', 'collect', 'college', 'colony', 'combine', 'comfort', 'command', 'comment', 'compact', 'company',
  'compare', 'compass', 'complex', 'concept', 'concern', 'concert', 'conduct', 'confirm', 'connect', 'consent', 'consist'
];

const eightLetterWords = [
  'absolute', 'abstract', 'academic', 'accepted', 'accident', 'accuracy', 'accurate', 'achieved', 'acquired', 'activity',
  'actually', 'addition', 'adequate', 'adjacent', 'adjusted', 'advanced', 'advisory', 'advocate', 'aircraft', 'alliance',
  'although', 'aluminum', 'analysis', 'announce', 'anything', 'anywhere', 'apparent', 'appendix', 'approach', 'approval',
  'argument', 'artistic', 'assembly', 'assuming', 'athletic', 'attached', 'attitude', 'attorney', 'audience', 'autonomy',
  'bachelor', 'backward', 'bacteria', 'balanced', 'barriers', 'baseline', 'baseball', 'basement', 'bathroom', 'boundary',
  'breeding', 'briefing', 'broadway', 'brothers', 'building', 'bulletin', 'business', 'calendar', 'campaign', 'capacity',
  'casualty', 'catchers', 'category', 'cautious', 'cavalry', 'cellular', 'ceremony', 'chairman', 'champion', 'chancery',
  'changing', 'channels', 'chapters', 'chemical', 'children', 'circular', 'citizens', 'civilian', 'clearing', 'climbing',
  'clinical', 'clothing', 'coaching', 'coalition', 'coastal', 'cocktail', 'collapse', 'colonial', 'colorful', 'combined'
];

const tenLetterWords = [
  'absolutely', 'acceptable', 'accessible', 'accordance', 'accounting', 'accurately', 'achievement', 'activities',
  'additional', 'adequately', 'adjustment', 'administer', 'admiration', 'admissions', 'adolescent', 'advantages',
  'adventures', 'advertising', 'affordable', 'aggressive', 'agreements', 'agriculture', 'allegation', 'allocating',
  'allowances', 'alternator', 'altogether', 'ambassador', 'ambitious', 'amendments', 'analytical', 'animations',
  'announcing', 'anticipate', 'apologetic', 'apparatus', 'appearance', 'applicable', 'applicants', 'appreciate',
  'approaches', 'appropriate', 'approximate', 'arbitrary', 'architect', 'arithmetic', 'arrangement', 'articulate',
  'artificial', 'assembling', 'assessment', 'assignment', 'assistance', 'associates', 'assumption', 'astonishing',
  'atmosphere', 'attachment', 'attraction', 'attractive', 'attributes', 'automation', 'automobile', 'background',
  'bankruptcy', 'basketball', 'battalion', 'battlefield', 'behavioral', 'beneficial', 'bestseller', 'biography',
  'biological', 'bitterness', 'blacksmith', 'blasphemy', 'blockbuster', 'bloodhound', 'bodyguard', 'boundaries'
];

const twelveLetterWords = [
  'accidentally', 'accommodated', 'accompanying', 'accomplished', 'accumulation', 'achievements', 'acknowledged',
  'acquisitions', 'adaptability', 'additionality', 'administering', 'admissibility', 'advantageous', 'advertisement',
  'affectionate', 'affirmations', 'aggressively', 'agricultural', 'alphabetical', 'alternatives', 'ambassadorship',
  'announcement', 'anthropology', 'anticipation', 'applications', 'appreciative', 'architecture', 'articulation',
  'astonishment', 'astronomical', 'attachments', 'authenticity', 'availability', 'bacteriology', 'beneficiaries',
  'biodiversity', 'biographical', 'breakthroughs', 'broadcasting', 'bureaucratic', 'calculations', 'cancellation',
  'capabilities', 'capitalistic', 'carelessness', 'categorizing', 'celebrations', 'certificates', 'championship',
  'characterize', 'choreography', 'chronologies', 'civilization', 'classification', 'collaborated', 'colonization'
];

const qWords = [
  'qaid', 'qanat', 'qats', 'qawwali', 'qeri', 'qibla', 'qigong', 'qindar', 'qintar', 'qiviut', 'qoph', 'qorma',
  'quack', 'quad', 'quaff', 'quag', 'quagmire', 'quai', 'quail', 'quaint', 'quake', 'quaker', 'qualify', 'quality',
  'qualm', 'quandary', 'quant', 'quantity', 'quantum', 'quarantine', 'quark', 'quarrel', 'quarry', 'quart', 'quarter',
  'quartet', 'quarto', 'quartz', 'quasar', 'quash', 'quasi', 'quaver', 'quay', 'quean', 'queasy', 'queen', 'queer',
  'quell', 'quench', 'quern', 'query', 'quest', 'question', 'queue', 'quibble', 'quick', 'quicken', 'quickly', 'quid',
  'quiet', 'quietly', 'quill', 'quilt', 'quince', 'quinine', 'quintet', 'quip', 'quire', 'quirk', 'quirky', 'quit',
  'quite', 'quits', 'quiver', 'quiz', 'quod', 'quoin', 'quoit', 'quota', 'quote', 'quotient'
];

const qWithoutU = [
  'qaid', 'qanat', 'qat', 'qats', 'qawwali', 'qeri', 'qibla', 'qigong', 'qindar', 'qintar', 'qiviut', 'qoph', 'qophs',
  'qorma', 'qwerty', 'qis', 'qanats', 'qindars', 'qintars', 'qiviuts', 'tranq', 'suq', 'suqs', 'cinq', 'faqir'
];

// Combine all into words.txt
const existingWords = new Set(fs.readFileSync(path.join(ROOT, 'data/words.txt'), 'utf-8').split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean));
[
  ...twoLetterWords, ...threeLetterWords, ...fourLetterWords, ...sixLetterWords,
  ...sevenLetterWords, ...eightLetterWords, ...tenLetterWords, ...twelveLetterWords,
  ...qWords, ...qWithoutU
].forEach(w => existingWords.add(w.toLowerCase()));

const sortedWords = Array.from(existingWords).sort();
fs.writeFileSync(path.join(ROOT, 'data/words.txt'), sortedWords.join('\n') + '\n', 'utf-8');
console.log('Enriched data/words.txt -> total words:', sortedWords.length);

// 2. Enrich negative.txt
const negativeWords = [
  'abysmal', 'adverse', 'alarming', 'angry', 'annoying', 'anxious', 'apathetic', 'arrogant', 'awful', 'bad',
  'banal', 'belligerent', 'bitter', 'bleak', 'boring', 'callous', 'careless', 'chaotic', 'clumsy', 'cold',
  'corrupt', 'cowardly', 'cruel', 'cynical', 'damaged', 'dangerous', 'dark', 'deceptive', 'defeated', 'defective',
  'deficient', 'depressing', 'desperate', 'destructive', 'detestable', 'devious', 'difficult', 'dirty', 'disappointing',
  'disastrous', 'dishonest', 'dismal', 'displeased', 'disrespectful', 'disruptive', 'doubtful', 'dreadful', 'dreary',
  'dull', 'embarrassed', 'enraged', 'envious', 'erratic', 'evil', 'exhausted', 'fatal', 'faulty', 'fearful',
  'ferocious', 'fierce', 'filthy', 'flawed', 'foolish', 'frightened', 'frustrated', 'gloomy', 'greedy', 'grief',
  'grim', 'gross', 'guilty', 'harsh', 'hateful', 'hazardous', 'hideous', 'hopeless', 'hostile', 'hurtful',
  'ignorant', 'ill', 'imperfect', 'improper', 'impure', 'inadequate', 'incompetent', 'inconsistent', 'indifferent',
  'inept', 'inferior', 'insecure', 'insidious', 'insensitive', 'intolerable', 'jealous', 'lazy', 'lonely', 'malicious',
  'menacing', 'miserable', 'mournful', 'nasty', 'negative', 'neglectful', 'obnoxious', 'offensive', 'painful', 'pathetic',
  'pessimistic', 'poisonous', 'reckless', 'rejected', 'repulsive', 'resentful', 'rotten', 'rude', 'ruthless', 'sad',
  'selfish', 'severe', 'shameful', 'sinister', 'sluggish', 'spiteful', 'stubborn', 'suspicious', 'terrible', 'threatening',
  'toxic', 'tragic', 'ugly', 'unfavorable', 'unhappy', 'unhealthy', 'unkind', 'unpleasant', 'unsatisfactory', 'unstable',
  'unwanted', 'useless', 'vicious', 'vile', 'violent', 'wicked', 'worthless', 'wretched', 'wrong'
];
fs.writeFileSync(path.join(ROOT, 'data/negative.txt'), Array.from(new Set(negativeWords)).sort().join('\n') + '\n', 'utf-8');
console.log('Created data/negative.txt -> total words:', negativeWords.length);

// 3. Enrich spanish.txt (Spanish loanwords in English)
const spanishWords = [
  'adios', 'aficionado', 'alcove', 'amigo', 'armada', 'barbecue', 'bodega', 'bolero', 'bonanza', 'bravado',
  'burrito', 'cabana', 'cafeteria', 'caldera', 'canyon', 'cargador', 'ceviche', 'chaparral', 'chayote', 'chili',
  'churro', 'cilantro', 'conquistador', 'corral', 'desperado', 'dorado', 'enchilada', 'fajita', 'fandango', 'fiesta',
  'flotilla', 'galleon', 'guacamole', 'guerrilla', 'habanero', 'hacienda', 'hidalgo', 'hombre', 'iguana', 'jalapeno',
  'junta', 'llama', 'machete', 'macho', 'manifesto', 'mantilla', 'matador', 'mesa', 'mesquite', 'mole',
  'mosquito', 'nacho', 'oregano', 'paella', 'palomino', 'papaya', 'patio', 'peon', 'pimento', 'pinata',
  'pinto', 'piñata', 'plaza', 'poncho', 'pronto', 'pueblo', 'quesadilla', 'ranch', 'renegade', 'rodeo',
  'rumba', 'salsa', 'sangria', 'savannah', 'senor', 'siesta', 'sombrero', 'taco', 'tamale', 'tango',
  'tapas', 'tequila', 'tomatillo', 'toreador', 'tornado', 'tortilla', 'vanilla', 'vicuna', 'vigilante', 'yucca'
];
fs.writeFileSync(path.join(ROOT, 'data/spanish.txt'), Array.from(new Set(spanishWords.map(s => s.toLowerCase()))).sort().join('\n') + '\n', 'utf-8');
console.log('Created data/spanish.txt -> total words:', spanishWords.length);

// 4. Enrich starters.txt (Transition words, sentence starters & synonyms)
const starterWords = [
  'additionally', 'admittedly', 'afterward', 'again', 'alongside', 'already', 'alternatively', 'altogether',
  'basically', 'besides', 'certainly', 'chiefly', 'coincidentally', 'consequently', 'conversely', 'correspondingly',
  'definitely', 'essentially', 'evidently', 'explicitly', 'firstly', 'further', 'furthermore', 'generally',
  'historically', 'honestly', 'ideally', 'importantly', 'incidentally', 'indeed', 'initially', 'instead',
  'interestingly', 'likewise', 'meanwhile', 'moreover', 'naturally', 'nevertheless', 'nonetheless', 'notably',
  'obviously', 'occasionally', 'originally', 'otherwise', 'overall', 'partially', 'particularly', 'personally',
  'primarily', 'principally', 'remarkably', 'secondly', 'similarly', 'specifically', 'subsequently', 'surely',
  'surprisingly', 'thereafter', 'therefore', 'thirdly', 'truthfully', 'ultimately', 'undoubtedly', 'unexpectedly'
];
fs.writeFileSync(path.join(ROOT, 'data/starters.txt'), Array.from(new Set(starterWords)).sort().join('\n') + '\n', 'utf-8');
console.log('Created data/starters.txt -> total words:', starterWords.length);

// 5. Enrich nouns.txt with 150+ common nouns across A-Z
const extraNouns = [
  'airport', 'album', 'alien', 'animal', 'answer', 'apple', 'apron', 'army', 'arrow', 'artist',
  'bacon', 'baker', 'banana', 'battery', 'beach', 'bicycle', 'blanket', 'bottle', 'bridge', 'butter',
  'cabin', 'camera', 'candle', 'carpet', 'castle', 'cherry', 'circle', 'coffee', 'cookie', 'cradle',
  'dancer', 'desert', 'diamond', 'dinner', 'doctor', 'dolphin', 'dragon', 'drawer', 'driver', 'dynamo',
  'eagle', 'earth', 'elbow', 'engine', 'escort', 'estate', 'expert', 'eyeball', 'fabric', 'farmer',
  'father', 'feather', 'finger', 'flower', 'forest', 'fountain', 'friend', 'garage', 'garden', 'garlic',
  'geyser', 'glider', 'guitar', 'hammer', 'harbor', 'helmet', 'history', 'honey', 'horse', 'hunter',
  'island', 'jacket', 'jungle', 'kettle', 'kitten', 'ladder', 'laptop', 'lawyer', 'leader', 'lemon',
  'lizard', 'market', 'meadow', 'mirror', 'monkey', 'morning', 'mother', 'museum', 'needle', 'neighbor',
  'office', 'orange', 'palace', 'parrot', 'pastor', 'pencil', 'person', 'picture', 'pillow', 'planet',
  'quiver', 'rabbit', 'ribbon', 'river', 'rocket', 'sailor', 'school', 'shadow', 'silver', 'soldier',
  'spider', 'spring', 'statue', 'stream', 'street', 'summer', 'table', 'teacher', 'temple', 'throat',
  'ticket', 'tiger', 'tunnel', 'turkey', 'turtle', 'valley', 'velvet', 'vessel', 'village', 'violin',
  'waiter', 'wallet', 'walnut', 'weapon', 'window', 'winter', 'wizard', 'writer', 'yellow', 'zipper'
];
const allNouns = new Set(fs.readFileSync(path.join(ROOT, 'data/nouns.txt'), 'utf-8').split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean));
extraNouns.forEach(n => allNouns.add(n));
fs.writeFileSync(path.join(ROOT, 'data/nouns.txt'), Array.from(allNouns).sort().join('\n') + '\n', 'utf-8');
console.log('Enriched data/nouns.txt -> total nouns:', allNouns.size);

// 6. Enrich positive.txt with person-descriptive words & inspiring words
const extraPositive = [
  'affectionate', 'altruistic', 'ambitious', 'amicable', 'approachable', 'articulate', 'artistic', 'assertive',
  'astute', 'attentive', 'authentic', 'balanced', 'benevolent', 'bold', 'brave', 'brilliant', 'bubbly',
  'calm', 'candid', 'capable', 'careful', 'caring', 'charismatic', 'charming', 'cheerful', 'clever',
  'compassionate', 'confident', 'considerate', 'courageous', 'creative', 'daring', 'decisive', 'delightful',
  'dependable', 'determined', 'diligent', 'diplomatic', 'dynamic', 'eager', 'earnest', 'effervescent',
  'efficient', 'elegant', 'empathetic', 'empowering', 'encouraging', 'energetic', 'engaging', 'enthusiastic',
  'ethical', 'exemplary', 'exuberant', 'fabulous', 'fair', 'faithful', 'fearless', 'flourishing',
  'forgiving', 'friendly', 'generous', 'gentle', 'genuine', 'glorious', 'good', 'graceful', 'gracious',
  'grateful', 'grounded', 'harmonious', 'helpful', 'heroic', 'honest', 'hopeful', 'humble', 'humorous',
  'idealistic', 'imaginative', 'independent', 'ingenious', 'innovative', 'insightful', 'inspiring',
  'intelligent', 'intuitive', 'invincible', 'joyful', 'jubilant', 'judicious', 'keen', 'kind', 'knowledgeable',
  'laudable', 'leaderly', 'lively', 'loving', 'loyal', 'luminous', 'magnanimous', 'mindful', 'modest',
  'noble', 'nurturing', 'open-minded', 'optimistic', 'passionate', 'patient', 'peaceful', 'perceptive',
  'persistent', 'philosophical', 'polite', 'popular', 'powerful', 'practical', 'praiseworthy', 'proactive',
  'radiant', 'rational', 'reliable', 'resilient', 'resourceful', 'respectful', 'sensible', 'sincere',
  'soulful', 'sparkling', 'spectacular', 'spirited', 'steadfast', 'strong', 'supportive', 'sweet',
  'sympathetic', 'talented', 'tenacious', 'thankful', 'thoughtful', 'trustworthy', 'understanding',
  'uplifting', 'valiant', 'vibrant', 'victorious', 'virtuous', 'visionary', 'vivacious', 'warm', 'wise', 'witty'
];
const allPositive = new Set(fs.readFileSync(path.join(ROOT, 'data/positive.txt'), 'utf-8').split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean));
extraPositive.forEach(p => allPositive.add(p));
fs.writeFileSync(path.join(ROOT, 'data/positive.txt'), Array.from(allPositive).sort().join('\n') + '\n', 'utf-8');
console.log('Enriched data/positive.txt -> total positive:', allPositive.size);

// 7. Onomatopoeia data set
const onomatopoeiaWords = [
  'bang', 'bark', 'beep', 'belch', 'blare', 'bleat', 'bloop', 'blow', 'blurt', 'boing', 'boo', 'boom', 'bray', 'buzz',
  'cackle', 'chatter', 'cheep', 'chirp', 'chomp', 'chortle', 'chuckle', 'clack', 'clang', 'clap', 'clash', 'clatter',
  'click', 'clink', 'clop', 'cluck', 'clump', 'crash', 'creak', 'croak', 'crunch', 'ding', 'dong', 'drip', 'fizz',
  'flap', 'flick', 'flutter', 'gasp', 'giggle', 'groan', 'growl', 'grunt', 'gurgle', 'hiss', 'honk', 'howl', 'hum',
  'jingle', 'knock', 'mew', 'moan', 'moo', 'murmur', 'mutter', 'neigh', 'oink', 'ping', 'pitter', 'plink', 'plop',
  'pop', 'purr', 'rattle', 'ring', 'rip', 'roar', 'rumble', 'rustle', 'screech', 'shriek', 'sizzle', 'slap', 'smash',
  'snap', 'snarl', 'sniff', 'snip', 'snore', 'snort', 'sob', 'splash', 'splatter', 'splat', 'squeak', 'squeal', 'squish',
  'swish', 'swoosh', 'tap', 'thud', 'thump', 'thunder', 'thwack', 'tick', 'tock', 'trickle', 'tweet', 'wail', 'whack',
  'wham', 'whimper', 'whine', 'whir', 'whirr', 'whiz', 'whoop', 'whoosh', 'woof', 'yap', 'yelp', 'zap', 'zip', 'zoom'
];
fs.writeFileSync(path.join(ROOT, 'data/onomatopoeia.txt'), Array.from(new Set(onomatopoeiaWords)).sort().join('\n') + '\n', 'utf-8');
console.log('Created data/onomatopoeia.txt -> total words:', onomatopoeiaWords.length);

// 8. Interjections data set
const interjectionWords = [
  'aha', 'ahem', 'ahoy', 'alas', 'amen', 'bingo', 'boo', 'booya', 'boy', 'bravo', 'cheers', 'crikey', 'darn',
  'duh', 'eureka', 'gee', 'gosh', 'ha', 'hallelujah', 'heh', 'hello', 'hey', 'hooray', 'huh', 'hurrah', 'meh',
  'nah', 'oops', 'ouch', 'ow', 'phew', 'psst', 'shh', 'tut', 'uh', 'ugh', 'waah', 'whew', 'whoa', 'wow',
  'yay', 'yeah', 'yep', 'yikes', 'yippee', 'yo', 'yuck'
];
fs.writeFileSync(path.join(ROOT, 'data/interjections.txt'), Array.from(new Set(interjectionWords)).sort().join('\n') + '\n', 'utf-8');
console.log('Created data/interjections.txt -> total words:', interjectionWords.length);

// 9. Extra suffix words and key onset words for words.txt & freq.txt
const suffixWords = [
  // -able
  'acceptable', 'adaptable', 'admirable', 'adorable', 'affordable', 'agreeable', 'allowable', 'applicable',
  'approachable', 'available', 'bearable', 'believable', 'capable', 'comfortable', 'curable', 'dependable',
  'desirable', 'durable', 'enjoyable', 'excitable', 'favorable', 'forgivable', 'honorable', 'likable',
  'lovable', 'manageable', 'memorable', 'notable', 'passable', 'payable', 'peaceable', 'playable',
  'portable', 'preferable', 'probable', 'profitable', 'reachable', 'readable', 'reasonable', 'reliable',
  'remarkable', 'respectable', 'scalable', 'suitable', 'taxable', 'tolerable', 'trackable', 'tradable',
  'usable', 'valuable', 'variable', 'viable', 'washable',
  // -ment
  'achievement', 'adjustment', 'agreement', 'allotment', 'amazement', 'amendment', 'amusement', 'announcement',
  'apartment', 'appointment', 'argument', 'arrangement', 'assessment', 'astonishment', 'attachment', 'attainment',
  'betterment', 'commandment', 'commitment', 'compliment', 'containment', 'department', 'deployment', 'development',
  'disappointment', 'document', 'element', 'embodiment', 'employment', 'enactment', 'enforcement', 'engagement',
  'enjoyment', 'enrichment', 'enrollment', 'entanglement', 'environment', 'equipment', 'establishment', 'excitement',
  'experiment', 'fragment', 'fulfillment', 'fundament', 'government', 'harassment', 'improvement', 'indictment',
  'instrument', 'investment', 'judgment', 'management', 'monument', 'movement', 'nourishment', 'ornament',
  'pavement', 'payment', 'pigment', 'placement', 'punishment', 'refinement', 'refreshment', 'reinforcement',
  'replacement', 'requirement', 'resentment', 'retirement', 'segment', 'settlement', 'shipment', 'statement',
  'supplement', 'temperament', 'testament', 'treatment',
  // -ness
  'awareness', 'bitterness', 'blankness', 'blindness', 'boldness', 'brightness', 'business', 'calmness',
  'carelessness', 'cleanliness', 'cleverness', 'closeness', 'coldness', 'coolness', 'craziness', 'dampness',
  'darkness', 'deafness', 'deepness', 'dullness', 'eagerness', 'fairness', 'fastness', 'fitness',
  'fondness', 'forgiveness', 'freshness', 'fullness', 'gladness', 'goodness', 'greatness', 'hardness',
  'harshness', 'heaviness', 'highness', 'illness', 'kindness', 'lateness', 'laziness', 'lightness',
  'likeness', 'loneliness', 'loudness', 'madness', 'neatness', 'newness', 'numbness', 'paleness',
  'plainness', 'politeness', 'quickness', 'quietness', 'rawness', 'readiness', 'redness', 'richness',
  'sadness', 'sharpness', 'shyness', 'sickness', 'stillness', 'sweetness', 'thickness', 'tightness',
  'weakness', 'wetness', 'whiteness', 'wildness', 'willingness', 'witness',
  // -ful
  'bashful', 'boastful', 'careful', 'cheerful', 'colorful', 'delightful', 'doubtful', 'dreadful',
  'dutiful', 'faithful', 'fanciful', 'fearful', 'flavorful', 'forceful', 'forgetful', 'frightful',
  'gainful', 'gleeful', 'graceful', 'grateful', 'harmful', 'hateful', 'healthful', 'helpful',
  'hopeful', 'hurtful', 'insightful', 'joyful', 'masterful', 'meaningful', 'merciful', 'mindful',
  'mournful', 'painful', 'peaceful', 'pityful', 'playful', 'plentiful', 'powerful', 'purposeful',
  'restful', 'scornful', 'shameful', 'skillful', 'slothful', 'sorrowful', 'soulful', 'spiteful',
  'stressful', 'successful', 'tasteful', 'tearful', 'thankful', 'thoughtful', 'truthful', 'useful',
  'vengeful', 'wasteful', 'watchful', 'wishful', 'woeful', 'wonderful', 'wrathful', 'wrongful',
  // -less
  'aimless', 'artless', 'blameless', 'bloodless', 'boneless', 'bottomless', 'boundless', 'breathless',
  'careless', 'ceaseless', 'cheerless', 'childless', 'cloudless', 'clueless', 'cordless', 'countless',
  'dauntless', 'doubtless', 'effortless', 'endless', 'faceless', 'fadeless', 'faithless', 'faultless',
  'fearless', 'flawless', 'formless', 'friendless', 'fruitless', 'godless', 'graceless', 'groundless',
  'guiltless', 'gutless', 'hairless', 'halpless', 'harmless', 'headless', 'heartless', 'helpless',
  'homeless', 'hopeless', 'joyless', 'lawless', 'leaderless', 'lifeless', 'lightless', 'limitless',
  'matchless', 'meaningless', 'merciless', 'mindless', 'motionless', 'nameless', 'needless', 'noiseless',
  'odorless', 'painless', 'peerless', 'penniless', 'pitiless', 'pointless', 'powerless', 'priceless',
  'reckless', 'relentless', 'restless', 'rootless', 'ruthless', 'scentless', 'seamless', 'senseless',
  'shameless', 'shiftless', 'sightless', 'sinless', 'sleepless', 'smokeless', 'soundless', 'speechless',
  'spotless', 'stainless', 'starless', 'stateless', 'sunless', 'tasteless', 'teetless', 'thankless',
  'thoughtless', 'timeless', 'tireless', 'toneless', 'toothless', 'trackless', 'treeless', 'trustless',
  'truthless', 'useless', 'valueless', 'viewless', 'voiceless', 'waterless', 'weightless', 'windless',
  'wireless', 'wordless', 'worthless'
];

// Add extra onset words for G, H, J, L, M, N, P, T, W
const extraOnsetWords = [
  // G words
  'gage', 'gala', 'game', 'gang', 'gaol', 'gape', 'garb', 'gash', 'gate', 'gave', 'gaze',
  'gear', 'geld', 'gems', 'gene', 'germ', 'geta', 'gets', 'gift', 'gild', 'gilt', 'gird',
  'girl', 'girt', 'gist', 'glad', 'glee', 'glen', 'glib', 'glob', 'glom', 'glop', 'glow',
  'glue', 'glug', 'glum', 'glut', 'gnar', 'gnat', 'gnaw', 'goad', 'goal', 'goat', 'gobs',
  'gods', 'goes', 'gold', 'golf', 'gone', 'gong', 'good', 'goof', 'goon', 'gore', 'gory',
  'gosh', 'gout', 'gown', 'grab', 'grad', 'gram', 'gran', 'gray', 'grew', 'grey', 'grid',
  'grim', 'grin', 'grip', 'grit', 'grog', 'grow', 'grub', 'gulf', 'gull', 'gulp', 'gums',
  'gunk', 'guns', 'guru', 'gush', 'gust', 'guts', 'guys',
  // 5-letter G
  'gauge', 'ghost', 'giant', 'glass', 'globe', 'glory', 'grade', 'grain', 'grand', 'grant',
  'grape', 'graph', 'grasp', 'grass', 'gravy', 'great', 'green', 'greet', 'grief', 'grill',
  'grind', 'groan', 'groom', 'gross', 'group', 'grove', 'guard', 'guess', 'guest', 'guide',
  'guild', 'guilt',
  // H words
  'hack', 'haft', 'hags', 'hail', 'hair', 'hale', 'half', 'hall', 'halo', 'halt', 'hams',
  'hand', 'hang', 'hank', 'hard', 'hare', 'hark', 'harm', 'harp', 'hart', 'hash', 'hasp',
  'hate', 'hath', 'hats', 'haul', 'have', 'hawk', 'haws', 'hays', 'haze', 'hazy', 'head',
  'heal', 'heap', 'hear', 'heat', 'heck', 'heed', 'heel', 'heir', 'held', 'hell', 'helm',
  'help', 'hems', 'hens', 'herb', 'herd', 'here', 'hero', 'hers', 'hewn', 'hews', 'hick',
  'hide', 'hied', 'hies', 'high', 'hike', 'hill', 'hilt', 'hind', 'hint', 'hire', 'hiss',
  'hits', 'hive', 'hoax', 'hobo', 'hock', 'hods', 'hoes', 'hogs', 'hold', 'hole', 'holt',
  'holy', 'home', 'homy', 'hone', 'honk', 'hood', 'hoof', 'hook', 'hoop', 'hoot', 'hope',
  'hops', 'horn', 'hose', 'host', 'hour', 'hove', 'howl', 'hows', 'hubs', 'hued', 'hues',
  'huge', 'hugs', 'hula', 'hulk', 'hull', 'hump', 'hung', 'hunk', 'hunt', 'hurl', 'hurt',
  'hush', 'husk', 'huts', 'hyde', 'hymn', 'hype',
  // 5-letter H
  'habit', 'happy', 'hardy', 'harsh', 'haste', 'hasty', 'hatch', 'haunt', 'haven', 'havoc',
  'hazel', 'heart', 'heavy', 'hedge', 'hefty', 'heirs', 'helix', 'hello', 'hence', 'herbs',
  'hiker', 'hints', 'hippo', 'hobby', 'holly', 'homer', 'honey', 'honor', 'horde', 'horns',
  'horse', 'hotel', 'hound', 'house', 'hover', 'human', 'humid', 'humor', 'husky', 'hyena',
  // M words
  'made', 'mail', 'maim', 'main', 'make', 'male', 'mall', 'malt', 'mane', 'many', 'maps',
  'mare', 'mark', 'mars', 'mash', 'mask', 'mass', 'mast', 'mate', 'math', 'mats', 'maul',
  'maze', 'mead', 'meal', 'mean', 'meat', 'meek', 'meet', 'meld', 'melt', 'memo', 'mend',
  'menu', 'meow', 'mere', 'mesa', 'mesh', 'mess', 'mete', 'mewl', 'mice', 'mild', 'mile',
  'milk', 'mill', 'mime', 'mind', 'mine', 'mini', 'mink', 'mint', 'mire', 'miss', 'mist',
  'mite', 'mitt', 'moan', 'moat', 'mock', 'mode', 'mold', 'mole', 'molt', 'monk', 'mood',
  'moon', 'moor', 'moot', 'mope', 'more', 'morn', 'moss', 'most', 'mote', 'moth', 'move',
  'mown', 'much', 'muck', 'muff', 'mugs', 'mule', 'mull', 'murk', 'muse', 'mush', 'musk',
  'must', 'mute', 'mutt', 'myth',
  // 5-letter M
  'magic', 'major', 'maker', 'mango', 'manor', 'maple', 'march', 'marry', 'marsh', 'match',
  'maxim', 'maybe', 'mayor', 'meant', 'medal', 'media', 'melon', 'mercy', 'merge', 'merit',
  'metal', 'meter', 'micro', 'midst', 'might', 'milky', 'miner', 'minor', 'minus', 'mirth',
  'mixer', 'model', 'modem', 'moist', 'molar', 'money', 'month', 'moral', 'motif', 'motor',
  'motto', 'mount', 'mouse', 'mouth', 'movie', 'music', 'muted',
  // P words
  'pace', 'pack', 'pact', 'page', 'paid', 'pail', 'pain', 'pair', 'pale', 'palm', 'pane',
  'pang', 'pans', 'pant', 'papa', 'park', 'part', 'pass', 'past', 'path', 'pats', 'pave',
  'pawn', 'pays', 'peak', 'peal', 'pear', 'peas', 'peat', 'peck', 'peek', 'peel', 'peep',
  'peer', 'pegs', 'pelt', 'pend', 'pens', 'perk', 'perm', 'pest', 'pets', 'pick', 'pier',
  'pies', 'pile', 'pill', 'pine', 'ping', 'pink', 'pins', 'pint', 'pipe', 'pips', 'pity',
  'plan', 'play', 'plea', 'plod', 'plot', 'plow', 'ploy', 'plug', 'plum', 'plus', 'pock',
  'poem', 'poet', 'poke', 'poky', 'pole', 'poll', 'polo', 'pond', 'pony', 'pool', 'poor',
  'pope', 'pork', 'port', 'pose', 'posh', 'post', 'posy', 'pots', 'pour', 'pout', 'pram',
  'pray', 'prep', 'prey', 'prim', 'prod', 'prof', 'prom', 'prop', 'prow', 'pubs', 'puff',
  'pugs', 'pull', 'pulp', 'pump', 'punk', 'puns', 'puny', 'pupa', 'pure', 'purl', 'purr',
  'push', 'puts', 'putt',
  // 5-letter P
  'paint', 'panel', 'panic', 'paper', 'parip', 'parks', 'party', 'pasta', 'paste', 'patch',
  'pause', 'peace', 'peach', 'peaks', 'pearl', 'pedal', 'penny', 'perch', 'peril', 'phase',
  'phone', 'photo', 'piano', 'piece', 'pilot', 'pinch', 'piper', 'pitch', 'pivot', 'pixel',
  'pizza', 'place', 'plaid', 'plain', 'plane', 'plank', 'plant', 'plate', 'plaza', 'plead',
  'pluck', 'plumb', 'plume', 'plump', 'plush', 'point', 'poise', 'poker', 'polar', 'polka',
  'poppy', 'porch', 'pouch', 'pound', 'power', 'prank', 'prawn', 'press', 'price', 'prick',
  'pride', 'prime', 'print', 'prior', 'prism', 'prize', 'probe', 'prone', 'prong', 'proof',
  'prose', 'proud', 'prove', 'prowl', 'proxy', 'prune', 'psalm', 'pulse', 'punch', 'pupil',
  'puppy', 'purse',
  // T words
  'tack', 'tact', 'tags', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tamp', 'tank',
  'tape', 'taps', 'tare', 'tarn', 'taro', 'tarp', 'tart', 'task', 'taut', 'team', 'tear',
  'teas', 'teat', 'tech', 'teed', 'teem', 'teen', 'tees', 'tell', 'temp', 'tend', 'tent',
  'term', 'tern', 'test', 'text', 'than', 'that', 'thaw', 'thee', 'them', 'then', 'they',
  'thin', 'this', 'thou', 'thru', 'thud', 'thug', 'tick', 'tide', 'tidy', 'tied', 'tier',
  'ties', 'tile', 'till', 'tilt', 'time', 'tine', 'tins', 'tint', 'tiny', 'tips', 'tire',
  'toad', 'toes', 'tofu', 'toga', 'toil', 'told', 'toll', 'tomb', 'tome', 'tone', 'tons',
  'took', 'tool', 'toot', 'tops', 'tore', 'torn', 'tort', 'toss', 'tote', 'tour', 'tout',
  'town', 'toys', 'tram', 'trap', 'tray', 'tree', 'trek', 'trim', 'trio', 'trip', 'trod',
  'trot', 'true', 'tuba', 'tube', 'tubs', 'tuck', 'tuft', 'tugs', 'tuna', 'tune', 'turf',
  'turn', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'two', 'type', 'typo',
  // 5-letter T
  'table', 'tacit', 'taint', 'taken', 'taker', 'tales', 'tally', 'talon', 'tamer', 'tango',
  'tangy', 'taper', 'tapir', 'tardy', 'tarot', 'taste', 'tasty', 'taunt', 'teach', 'teary',
  'tease', 'tempo', 'tenet', 'tenor', 'tense', 'tenth', 'tepid', 'terms', 'terra', 'terse',
  'testy', 'thank', 'theft', 'theme', 'thick', 'thief', 'thigh', 'thing', 'think', 'third',
  'thong', 'thorn', 'those', 'three', 'threw', 'throb', 'throw', 'thumb', 'thump', 'tiara',
  'tibia', 'tidal', 'tiger', 'tight', 'timer', 'timid', 'tipsy', 'tired', 'titan', 'title',
  'toast', 'today', 'token', 'tonal', 'tonic', 'tooth', 'topaz', 'topic', 'torch', 'torso',
  'total', 'totem', 'touch', 'tough', 'towel', 'tower', 'toxic', 'toxin', 'trace', 'track',
  'tract', 'trade', 'trail', 'train', 'trait', 'tramp', 'trash', 'trawl', 'tread', 'treat',
  'trend', 'trial', 'tribe', 'trick', 'tried', 'tripe', 'trite', 'troll', 'troop', 'trope',
  'trout', 'truce', 'truck', 'truly', 'trump', 'trunk', 'truss', 'trust', 'truth', 'tulip',
  'tumor', 'tunic', 'turbo', 'tutor', 'twang', 'tweak', 'tweed', 'tweet', 'twice', 'twine',
  'twirl', 'twist', 'tying',
  // W words
  'wack', 'wade', 'wadi', 'wads', 'waft', 'wage', 'wags', 'waif', 'wail', 'wait', 'wake',
  'walk', 'wall', 'wand', 'wane', 'want', 'ward', 'ware', 'warm', 'warn', 'warp', 'wars',
  'wart', 'wary', 'wash', 'wasp', 'wast', 'wats', 'watt', 'wave', 'wavy', 'waxy', 'ways',
  'weak', 'weal', 'wean', 'wear', 'webs', 'weds', 'weed', 'week', 'weep', 'weft', 'weight',
  'weir', 'weld', 'well', 'welt', 'went', 'wept', 'were', 'west', 'wets', 'wham', 'what',
  'whee', 'when', 'whet', 'whey', 'whim', 'whip', 'whir', 'whit', 'whiz', 'whoa', 'whom',
  'whys', 'wick', 'wide', 'wife', 'wigs', 'wild', 'wile', 'will', 'wilt', 'wily', 'wind',
  'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wiry', 'wise', 'wish', 'wisp', 'with',
  'wits', 'woes', 'woke', 'woks', 'wold', 'wolf', 'womb', 'wont', 'wood', 'wool', 'woos',
  'word', 'wore', 'work', 'worm', 'worn', 'wort', 'wove', 'wrap', 'wren', 'writ',
  // 5-letter W
  'wacko', 'wafer', 'wager', 'wagon', 'waist', 'waive', 'waltz', 'waste', 'watch', 'water',
  'waver', 'weary', 'weave', 'wedge', 'weedy', 'weigh', 'weird', 'welch', 'wench', 'whack',
  'whale', 'wharf', 'wheat', 'wheel', 'whelp', 'where', 'which', 'whiff', 'while', 'whine',
  'whiny', 'whirl', 'whisk', 'white', 'whole', 'whoop', 'whose', 'widen', 'wider', 'widow',
  'width', 'wield', 'wight', 'wimpy', 'wince', 'winch', 'windy', 'wiper', 'wired', 'wiser',
  'wispy', 'witch', 'witty', 'woken', 'woman', 'women', 'woody', 'woozy', 'wordy', 'world',
  'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'woven', 'wrack', 'wrath', 'wreak',
  'wreck', 'wrest', 'wring', 'wrist', 'write', 'wrong', 'wrote', 'wrung',
  // D words
  'daily', 'dairy', 'daisy', 'dance', 'dandy', 'dated', 'daunt', 'death', 'debit', 'debug',
  'debut', 'decal', 'decay', 'decor', 'decoy', 'decry', 'defer', 'deign', 'deity', 'delay',
  'delta', 'delve', 'demon', 'demur', 'denim', 'dense', 'depot', 'depth', 'derby', 'deter',
  'detox', 'deuce', 'devil', 'diary', 'dicey', 'digit', 'diner', 'dingo', 'dingy', 'diode',
  'dirge', 'dirty', 'disco', 'ditch', 'ditto', 'ditty', 'diver', 'dizzy', 'dodge', 'dodgy',
  'dogma', 'doing', 'dolly', 'donor', 'donut', 'dopey', 'doubt', 'dough', 'dowdy', 'dowel',
  'downy', 'dowry', 'dozen', 'draft', 'drain', 'drake', 'drama', 'drank', 'drape', 'drawl',
  'drawn', 'dread', 'dream', 'dress', 'dried', 'drier', 'drift', 'drill', 'drink', 'drive',
  'droll', 'drone', 'drool', 'droop', 'dross', 'drove', 'drown', 'druid', 'drunk', 'dryer',
  'dryly', 'duchy', 'dully', 'dummy', 'dumpy', 'dunce', 'dusky', 'dusty', 'dutch', 'duvet',
  'dwarf', 'dwell', 'dwelt', 'dying',
  // L words
  'label', 'labor', 'laden', 'ladle', 'lager', 'lance', 'lanky', 'lapel', 'lapse', 'larch',
  'large', 'larva', 'laser', 'lasso', 'latch', 'later', 'latex', 'lathe', 'latte', 'laugh',
  'layer', 'leach', 'leader', 'leafy', 'leaky', 'leant', 'leapt', 'learn', 'lease', 'leash',
  'least', 'leave', 'ledge', 'leech', 'leery', 'legal', 'leggy', 'lemon', 'lemur', 'leper',
  'level', 'lever', 'libel', 'liege', 'light', 'liken', 'lilac', 'limbo', 'limit', 'lined',
  'linen', 'liner', 'lingo', 'lipid', 'lithe', 'liver', 'livid', 'llama', 'loamy', 'loath',
  'lobby', 'local', 'locus', 'lodge', 'lofty', 'logic', 'login', 'loiter', 'loner', 'loose',
  'lorry', 'loser', 'lotto', 'lotus', 'louse', 'lousy', 'lover', 'lower', 'lowly', 'loyal',
  'lucid', 'lucky', 'lumen', 'lumpy', 'lunar', 'lunch', 'lunge', 'lupin', 'lurch', 'lurid',
  'lusty', 'lying', 'lymph', 'lynch', 'lyric'
];

// Additional tournament words for I, J, N, O, U, V, and short S, A, E words
const extraCombos = [
  // I words
  'ice', 'icy', 'ill', 'ink', 'inn', 'ion', 'ire', 'irk', 'ism', 'its', 'ivy',
  'icon', 'idea', 'idle', 'idly', 'idol', 'inch', 'info', 'into', 'iris', 'iron', 'isle', 'item',
  'ideal', 'idiom', 'idiot', 'idols', 'igloo', 'image', 'imbue', 'impel', 'imply', 'inane', 'inbox',
  'incur', 'index', 'inept', 'inert', 'infer', 'ingot', 'inlay', 'inlet', 'inner', 'input', 'inter',
  'intro', 'ionic', 'inure', 'infra', 'inapt', 'inarm', 'ingle', 'inked', 'inker', 'indie', 'indue',
  'irate', 'irony', 'islet', 'issue', 'itchy', 'ivory',
  'island', 'impact', 'import', 'income', 'indeed', 'inform', 'injury', 'insect', 'inside', 'insist',
  // J words
  'jab', 'jag', 'jam', 'jar', 'jaw', 'jay', 'jet', 'jib', 'jig', 'job', 'jog', 'jot', 'joy', 'jug', 'jut',
  'jack', 'jade', 'jail', 'jamb', 'jane', 'jars', 'jaws', 'jays', 'jazz', 'jean', 'jeep', 'jeer', 'jest',
  'jets', 'jibe', 'jiff', 'jigs', 'jilt', 'jinx', 'jive', 'jobs', 'jock', 'jogs', 'john', 'join', 'joke',
  'jolt', 'josh', 'jots', 'jowl', 'joys', 'judo', 'jugs', 'jump', 'junk', 'jury', 'just', 'jute',
  'jaded', 'japan', 'jaunt', 'jeans', 'jelly', 'jenny', 'jerky', 'jetty', 'jewel', 'jiffy', 'joint',
  'joker', 'jolly', 'joule', 'joust', 'judge', 'juice', 'juicy', 'jumbo', 'jumpy', 'junta', 'juror',
  // N words
  'nab', 'nag', 'nap', 'nay', 'net', 'new', 'nib', 'nil', 'nip', 'nit', 'nix', 'nod', 'nor', 'not', 'now', 'nun', 'nut',
  'name', 'navy', 'near', 'neat', 'neck', 'need', 'neon', 'nest', 'news', 'next', 'nice', 'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun', 'null',
  'nadir', 'naive', 'nanny', 'nasal', 'nasty', 'natal', 'naval', 'navel', 'needy', 'neigh', 'nerve',
  'never', 'newly', 'nexus', 'niche', 'niece', 'night', 'ninja', 'ninth', 'noble', 'noise', 'noisy',
  'nomad', 'noose', 'north', 'notch', 'novel', 'nurse', 'nutty', 'nylon', 'nymph',
  'nature', 'nearby', 'nearly', 'needle', 'nephew', 'neural', 'nicely', 'nickel', 'ninety', 'nobody', 'normal', 'notice',
  // O words
  'oak', 'oar', 'oat', 'odd', 'ode', 'off', 'oft', 'oil', 'old', 'one', 'opt', 'orb', 'ore', 'our', 'out', 'owl', 'own',
  'oaks', 'oars', 'oats', 'obey', 'odds', 'odes', 'odor', 'oils', 'oily', 'okay', 'omen', 'omit', 'once', 'ones', 'only', 'onto', 'onus', 'onyx', 'ooze', 'opal', 'open', 'opts', 'opus', 'oral', 'orbs', 'ores', 'ours', 'oval', 'oven', 'over', 'owed', 'owes', 'owls', 'owns', 'oxen',
  'oasis', 'obese', 'occur', 'ocean', 'ochre', 'odour', 'offer', 'often', 'olden', 'older', 'olive',
  'omega', 'onion', 'onset', 'opera', 'opine', 'opium', 'optic', 'orbit', 'order', 'organ', 'other',
  'otter', 'ought', 'ounce', 'outer', 'outdo', 'ovary', 'ovate', 'overt', 'ovine', 'owing', 'owner', 'oxide', 'ozone',
  // U words
  'ugh', 'ump', 'uns', 'ups', 'urn', 'use',
  'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'used', 'user', 'uses',
  'udder', 'ulcer', 'ultra', 'umbra', 'uncle', 'uncut', 'under', 'undid', 'undue', 'unfed', 'unfit', 'unify',
  'union', 'unite', 'units', 'unity', 'unlit', 'unmet', 'unset', 'untie', 'until', 'unwed', 'unzip', 'uncap', 'unpin', 'unsay', 'upbeat',
  'upper', 'upset', 'urban', 'urine', 'usage', 'usher', 'using', 'usual', 'usurp', 'utile', 'utter',
  // V words
  'van', 'vat', 'vet', 'vex', 'via', 'vie', 'vim', 'vow',
  'vain', 'vale', 'vamp', 'vane', 'vans', 'vary', 'vase', 'vast', 'vats', 'veal', 'veer', 'veil', 'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vets', 'vial', 'vibe', 'vice', 'view', 'vile', 'vine', 'visa', 'void', 'vole', 'volt', 'vote', 'vows',
  'vague', 'valet', 'valid', 'valor', 'value', 'valve', 'vapor', 'vault', 'vegan', 'venom', 'venue',
  'verge', 'verse', 'verso', 'verve', 'vicar', 'video', 'vigil', 'vigor', 'villa', 'vinyl', 'viola',
  'viper', 'viral', 'virus', 'visit', 'visor', 'vista', 'vital', 'vivid', 'vixen', 'vocal', 'vodka',
  'vogue', 'voice', 'voila', 'vomit', 'voter', 'vouch', 'vowel',
  // 3-letter S words
  'sab', 'sac', 'sad', 'sag', 'sal', 'sap', 'sat', 'saw', 'sax', 'say', 'sea', 'sec', 'see', 'set', 'sew', 'sex', 'she', 'shy', 'sib', 'sic', 'sin', 'sip', 'sir', 'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sop', 'sot', 'sou', 'sow', 'soy', 'spa', 'spy', 'sty', 'sue', 'sum', 'sun', 'sup',
  // 4-letter S words
  'sack', 'safe', 'saga', 'sage', 'said', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'sane', 'sang', 'sank', 'save', 'scan', 'scar', 'seal', 'seam', 'sear', 'seat', 'seed', 'seek', 'seem', 'seen', 'seep', 'self', 'sell', 'send', 'sent', 'shot', 'show', 'shut', 'sick', 'side', 'sigh', 'sign', 'silk', 'sing', 'sink', 'site', 'size', 'skew', 'skid', 'skim', 'skin', 'skip', 'slab', 'slam', 'slap', 'sled', 'slim', 'slip', 'slit', 'slow', 'slum', 'snap', 'snow', 'soak', 'soap', 'soar', 'sock', 'soda', 'sofa', 'soft', 'soil', 'solo', 'song', 'soon', 'soot', 'sore', 'sort', 'soul', 'soup', 'sour', 'span', 'spar', 'spat', 'spin', 'spit', 'spot', 'spur', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'such', 'suit', 'sure', 'surf', 'swan', 'swap', 'swat', 'sway', 'swim',
  // 4-letter A words
  'abet', 'able', 'ably', 'abut', 'ache', 'acid', 'acme', 'acre', 'acts', 'afar', 'aged', 'ages', 'agog', 'ahem', 'aide', 'aids', 'ails', 'aims', 'airs', 'airy', 'ajar', 'akin', 'alga', 'ally', 'aloe', 'also', 'alto', 'alum', 'amen', 'amid', 'ammo', 'amok', 'amps', 'anal', 'anew', 'anon', 'ante', 'apex', 'apse', 'aqua', 'arch', 'area', 'arid', 'arms', 'army', 'arts', 'arty', 'avid', 'away', 'awed', 'awry', 'axes', 'axle',
  // 4-letter E words
  'each', 'earl', 'earn', 'ears', 'ease', 'east', 'easy', 'eats', 'echo', 'edge', 'edgy', 'edit', 'eels', 'eggs', 'elks', 'elms', 'else', 'emit', 'envy', 'epic', 'eras', 'even', 'ever', 'evil', 'exam', 'exit', 'eyed', 'eyes',
  // 6-letter S words
  'sacred', 'saddle', 'safety', 'sailor', 'salads', 'salary', 'salmon', 'sample', 'sandal', 'saucer', 'saying', 'scarce', 'scheme', 'school', 'science', 'scissors', 'scored', 'screen', 'search', 'season', 'second', 'secret', 'seldom', 'senior', 'series', 'sermon', 'settle', 'severe', 'shadow', 'shaken', 'shallow', 'shield', 'shiver', 'shock', 'shovel', 'shrimp', 'shrunk', 'signal', 'silence', 'silver', 'simple', 'singer', 'single', 'sister', 'skillet', 'sleeve', 'slender', 'socket', 'solver', 'sorrow', 'source', 'speech', 'spider', 'spirit', 'sponge', 'spring', 'square', 'stable', 'stadium', 'status', 'steady', 'stereo', 'stomach', 'street', 'strike', 'string', 'stroke', 'strong', 'studio', 'stupid', 'subtle', 'sudden', 'suffer', 'sugar', 'summer', 'supply', 'surely', 'survey', 'switch', 'symbol', 'system',
  // 7-letter S words
  'sadness', 'sailing', 'salvage', 'samurai', 'sanction', 'sandwich', 'sardine', 'satisfy', 'sausage', 'savings', 'scandal', 'scatter', 'scenery', 'scholar', 'scoring', 'scratch', 'screaming', 'secrecy', 'section', 'secular', 'segment', 'seizure', 'seminar', 'senator', 'sensory', 'sentence', 'separate', 'sequel', 'sequence', 'serenity', 'servant', 'service', 'session', 'several', 'shameful', 'sharpen', 'shatter', 'shelter', 'sheriff', 'shining', 'shopper', 'shorten', 'shoulder', 'shudder', 'sibling', 'silence', 'silicon', 'similar', 'simpler', 'sincere', 'singing', 'sixteen', 'skating', 'skeleton', 'skilled', 'skyline', 'slavery', 'slender', 'sliding', 'slipper', 'smaller', 'smarter', 'smother', 'soldier', 'solitary', 'somehow', 'someone', 'soothing', 'sorrows', 'sparkle', 'spatial', 'speaker', 'special', 'specify', 'specimen', 'spectacle', 'spectrum', 'spin-off', 'spinner', 'sponsor', 'squeaky', 'squeeze', 'stadium', 'stagger', 'stamina', 'standard', 'startup', 'station', 'stature', 'statute', 'steamer', 'stencil', 'sterile', 'steward', 'stomach', 'storage', 'strange', 'stratum', 'strength', 'stretch', 'striker', 'strolls', 'student', 'studios', 'stylish', 'subject', 'submerge', 'submits', 'subsidy', 'suburbs', 'succeed', 'success', 'succumb', 'suction', 'suffice', 'suggest', 'suicide', 'summary', 'sunrise', 'sunsets', 'support', 'suppose', 'supreme', 'surface', 'surgeon', 'surgery', 'surplus', 'surprise', 'survive', 'suspect', 'suspend', 'sustain', 'swallow', 'sweater', 'sweeper', 'symbols', 'symptom', 'synergy', 'syringe', 'systems',
  // 8-letter S words
  'sabotage', 'sandwich', 'sapphire', 'scavenge', 'schedule', 'scissors', 'scramble', 'scribble', 'scrutiny', 'seamless', 'seasonal', 'secluded', 'security', 'sediment', 'seedling', 'segments', 'semester', 'senators', 'sensible', 'sentence', 'separate', 'sequence', 'sergeant', 'servants', 'services', 'settings', 'settlers', 'severely', 'severity', 'shadings', 'shadowed', 'shoppers', 'shortage', 'shortcut', 'shoulders', 'shouting', 'sickness', 'sidewalk', 'signaled', 'silences', 'silicone', 'simulate', 'singular', 'sinister', 'skeletal', 'skeleton', 'skillful', 'skirmish', 'skylight', 'skyline', 'slapstick', 'slaughter', 'sleeper', 'sleeping', 'sleepless', 'slippery', 'sluggish', 'smallest', 'smartest', 'smashing', 'snapshot', 'snowball', 'snowfall', 'socially', 'societal', 'softness', 'software', 'soldiers', 'solidify', 'solitude', 'solution', 'somebody', 'somewhat', 'soothing', 'sorcerer', 'sorority', 'souvenir', 'spacious', 'speakers', 'speaking', 'specials', 'specific', 'specimen', 'spectral', 'spectrum', 'speeding', 'spinster', 'splendid', 'splinter', 'spoiling', 'spotless', 'spotlight', 'squadron', 'squirrel', 'stabbing', 'stagnant', 'stalwart', 'standard', 'standing', 'standout', 'starfish', 'starlight', 'startling', 'starving', 'stations', 'statuses', 'statutes', 'steadily', 'steering', 'stepping', 'sterilize', 'stewards', 'stickers', 'stiffness', 'stimulus', 'stirring', 'stocking', 'stopwatch', 'straight', 'stranger', 'strategy', 'strength', 'stressed', 'strictly', 'striking', 'striping', 'strongly', 'struggle', 'stubborn', 'students', 'studious', 'stunning', 'subgroup', 'subjects', 'submarine', 'submerge', 'subtotal', 'suburban', 'subways', 'succeeds', 'success', 'succinct', 'suddenly', 'suffering', 'suffixes', 'suffrage', 'suggests', 'suitably', 'suitcase', 'summaries', 'summitry', 'sunlight', 'sunshine', 'superior', 'superman', 'superstar', 'supplied', 'supplier', 'supplies', 'supports', 'supposed', 'surfaces', 'surgical', 'surprises', 'surround', 'survival', 'survivor', 'suspects', 'suspense', 'sustains', 'swimming', 'switched', 'switches', 'syllabus', 'symbolic', 'symmetry', 'sympathy', 'symptoms', 'syndrome', 'synergic', 'synopsis', 'syntaxes'
];

const currentWords = new Set(fs.readFileSync(path.join(ROOT, 'data/words.txt'), 'utf-8').split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean));
[
  ...onomatopoeiaWords,
  ...interjectionWords,
  ...suffixWords,
  ...extraOnsetWords,
  ...extraCombos
].forEach(w => currentWords.add(w.toLowerCase()));

const finalWordsList = Array.from(currentWords).sort();
fs.writeFileSync(path.join(ROOT, 'data/words.txt'), finalWordsList.join('\n') + '\n', 'utf-8');
console.log('Final enriched data/words.txt -> total words:', finalWordsList.length);

// Also add to freq.txt with default count 50000 if not present
const currentFreq = new Map();
fs.readFileSync(path.join(ROOT, 'data/freq.txt'), 'utf-8').split(/\r?\n/).filter(Boolean).forEach(l => {
  const parts = l.split(/\s+/);
  if (parts.length >= 2) currentFreq.set(parts[0].toLowerCase(), parts[1]);
});

[...onomatopoeiaWords, ...interjectionWords, ...suffixWords, ...extraOnsetWords].forEach(w => {
  if (!currentFreq.has(w.toLowerCase())) {
    currentFreq.set(w.toLowerCase(), '50000');
  }
});

const freqOutput = Array.from(currentFreq.entries()).map(([w, c]) => `${w} ${c}`).sort().join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'data/freq.txt'), freqOutput, 'utf-8');
console.log('Final enriched data/freq.txt -> total words:', currentFreq.size);
