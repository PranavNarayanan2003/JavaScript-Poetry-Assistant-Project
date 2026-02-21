// DATA STRUCTURES

/*
 * Data Structure: Global Wordlist Array
 * This is array that holds the entire list of words from the 
 * wordlist.txt file and acts as a comprehensive dictionary for the
 * `findRhymingWords` and `findAlliterativeWords` algorithms to scan through.
 */
let WORDLIST = [];
async function fetchWordlist() {
    try {
        const response = await fetch('wordlist.txt');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}. Make sure wordlist.txt is in the same folder as your HTML file.`);
        }
        const text = await response.text();
        // Parse the text file into a clean array of lowercase words.
        WORDLIST = text.split(/\s+/).map(w => w.trim().toLowerCase()).filter(w => w.length > 1);
        console.log(`Wordlist loaded successfully with ${WORDLIST.length} words.`);
    } catch (error) {
        console.error("Failed to fetch wordlist:", error);
        previewTitle.textContent = "Could not load wordlist.txt for preview.";
    }
}

/**
 * [OWASP Item 13] Validate Data Length
 * Strategy: Defense-in-Depth
 * Layer 1: HTML attribute maxlength="50" (Presentation Layer)
 * Layer 2: JavaScript check below (Logic Layer) to prevent bypass.
 */
const INPUT_CONSTRAINTS = {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50, // Strict quota to prevent algorithmic exhaustion (DoS)
};

// Usage Example:
// Even if 'userInput' is "<img src=x onerror=alert(1)>", it renders safely as text.
SafeDOM.setText('poemTitle', `Poem for "${userInput}"`);

/*
 * Data Structure: Prefix-Indexed Alliteration Map (Hash Map)
 * This hash map is used by the `generateAlliterationPoem` algorithm to quickly retrieve high-quality,
 * thematically appropriate words for constructing a poem.
 */
const CURATED_ALLITERATION_WORDS = {
    a: { adjs: ["ancient", "amber", "alone", "ashen", "awful", "azure", "absent"], nouns: ["autumn", "air", "arrow", "ark", "ash", "abyss", "age", "anchor"] },
    b: { adjs: ["broken", "burning", "brilliant", "bitter", "blue", "brave", "boundless"], nouns: ["beauty", "brook", "breath", "blood", "battle", "breeze", "branch"] },
    c: { adjs: ["crystal", "cold", "crimson", "calm", "ceaseless", "cosmic", "cruel"], nouns: ["chaos", "cloud", "candle", "circle", "cry", "cinder", "crown", "curse"] },
    d: { adjs: ["dark", "distant", "dreaming", "dying", "deep", "divine", "dreadful"], nouns: ["darkness", "day", "dawn", "death", "dew", "dust", "door", "dream"] },
    e: { adjs: ["endless", "empty", "eternal", "ebon", "echoing", "ethereal"], nouns: ["echo", "ember", "earth", "edge", "eternity", "evening", "eye"] },
    f: { adjs: ["fearless", "fragile", "flowing", "fluttering", "fiery", "flickering", "faint", "fast", "forgotten"], nouns: ["fire", "flame", "forest", "flower", "field", "fate", "friend", "father", "feather", "frost"] },
    g: { adjs: ["golden", "gentle", "graceful", "green", "glassy", "grand", "gray"], nouns: ["ghost", "garden", "gate", "grace", "gloom", "gleam", "glory", "god"] },
    h: { adjs: ["hidden", "hollow", "haunting", "holy", "heavy", "humble", "harsh"], nouns: ["heart", "heaven", "hell", "hope", "horizon", "hush", "hand"] },
    i: { adjs: ["infinite", "icy", "ivory", "idle", "immortal", "inner"], nouns: ["ice", "illusion", "isle", "iron", "ink", "infinity"] },
    j: { adjs: ["jaded", "joyful", "jagged", "joyous"], nouns: ["jewel", "journey", "joy", "judgment", "jest"] },
    k: { adjs: ["keen", "kind", "kingly", "knotted"], nouns: ["king", "kingdom", "key", "knowledge", "knife"] },
    l: { adjs: ["lonely", "luminous", "lasting", "lost", "light", "living", "little"], nouns: ["light", "life", "love", "land", "leaf", "lore", "lament", "liar"] },
    m: { adjs: ["misty", "mad", "magic", "moonlit", "mournful", "mortal", "mighty"], nouns: ["mist", "moon", "mother", "memory", "mind", "mirth", "monster"] },
    n: { adjs: ["naked", "nameless", "narrow", "new", "noble", "northern"], nouns: ["night", "north", "nothing", "name", "needle", "nest"] },
    o: { adjs: ["old", "open", "ornate", "ominous", "other"], nouns: ["ocean", "oath", "oracle", "orb", "omen"] },
    p: { adjs: ["pale", "patient", "perfect", "passing", "peaceful", "pure"], nouns: ["pain", "peace", "path", "phantom", "power", "prayer", "pride"] },
    q: { adjs: ["quiet", "quaking", "quivering"], nouns: ["queen", "quest", "quill", "quarry"] },
    r: { adjs: ["radiant", "resolute", "resonant", "rising", "rushing", "red", "restless", "rare"], nouns: ["river", "road", "rain", "rose", "ray", "rhyme", "reflection", "ruin"] },
    s: { adjs: ["silent", "shimmering", "sparkling", "soft", "sacred", "soaring", "swift", "strong", "summer's"], nouns: ["sun", "star", "shadow", "silence", "sea", "sky", "soul", "stone", "stream", "song"] },
    t: { adjs: ["timeless", "trembling", "terrible", "true", "twisted", "tender"], nouns: ["time", "tear", "thunder", "thought", "throne", "tide", "tongue"] },
    u: { adjs: ["unseen", "undying", "unbroken", "unholy", "utter"], nouns: ["universe", "unity", "urn", "undertow"] },
    v: { adjs: ["vast", "veiled", "violent", "vital", "vivid"], nouns: ["void", "voice", "valor", "veil", "vision", "vow"] },
    w: { adjs: ["wandering", "whispering", "wild", "warm", "watchful", "weary"], nouns: ["wind", "water", "world", "winter", "wave", "willow", "wonder", "word"] },
    x: { adjs: [], nouns: [] },
    y: { adjs: ["yellow", "yearning", "young", "yielding"], nouns: ["youth", "year", "yesterday", "yoke"] },
    z: { adjs: ["zealous", "zodiac"], nouns: ["zenith", "zephyr", "zone"] }
};

/*
 * 2. Data Structure: Suffix-Search Rhyme Collection (Hash Map)
 * This Hash Map functions as a Inverted Index, mapping a rhyming suffix 
 * to a list of words that contain that sound.Used by the
 * `generateRhymingPoem` algorithm to find a suitable rhyme family
 * for the user's input word from a curated list.
 */
const CURATED_RHYME_GROUPS = {
    "ace": { nouns: ["face", "grace", "place", "race", "space"], others: [] },
    "ade": { nouns: ["grade", "shade", "trade"], others: ["fade", "made"] },
    "ain": { nouns: ["brain", "chain", "gain", "pain", "rain", "stain", "train"], others: [] },
    "ake": { nouns: ["cake", "lake", "sake"], others: ["bake", "fake", "make", "take"] },
    "ale": { nouns: ["sale", "scale", "tale", "whale"], others: ["pale"] },
    "ame": { nouns: ["flame", "game", "name", "shame"], others: ["blame", "same"] },
    "ank": { nouns: ["bank", "rank"], others: ["blank", "drank", "thank"] },
    "ash": { nouns: ["cash", "clash", "crash", "flash", "trash"], others: [] },
    "at": { nouns: ["bat", "cat", "hat", "mat", "rat"], others: ["fat", "sat", "that"] },
    "ate": { nouns: ["date", "fate", "gate", "hate", "rate", "state"], others: ["great", "late"] },
    "ay": { nouns: ["day", "hay", "way"], others: ["gray", "may", "play", "say", "stay"] },
    "eat": { nouns: ["feat", "heat", "seat", "wheat"], others: ["beat", "neat", "treat"] },
    "ed": { nouns: ["bed"], others: ["dead", "fed", "led", "red", "said"] },
    "eep": { nouns: ["jeep"], others: ["cheap", "creep", "deep", "keep", "sleep", "weep"] },
    "eet": { nouns: ["feet", "sheet", "street"], others: ["greet", "meet", "sweet"] },
    "ell": { nouns: ["bell", "cell", "hell"], others: ["dwell", "fell", "sell", "tell", "well"] },
    "end": { nouns: ["friend", "trend"], others: ["bend", "lend", "send", "spend"] },
    "ent": { nouns: ["cent", "rent", "tent"], others: ["bent", "sent", "went"] },
    "est": { nouns: ["guest", "nest", "test", "quest"], others: ["best", "rest", "west"] },
    "ice": { nouns: ["dice", "ice", "mice", "price", "rice", "spice"], others: ["nice"] },
    "ick": { nouns: ["brick", "chick"], others: ["kick", "pick", "quick", "sick", "thick"] },
    "ide": { nouns: ["bride", "pride", "side", "tide"], others: ["hide", "ride", "wide"] },
    "ife": { nouns: ["knife", "life", "strife", "wife"], others: [] },
    "ight": { nouns: ["fight", "flight", "knight", "light", "might", "night", "sight"], others: ["bright", "right"] },
    "ike": { nouns: ["bike", "mike", "spike"], others: ["hike", "like", "strike"] },
    "ill": { nouns: ["bill", "hill"], others: ["chill", "fill", "kill", "still", "will"] },
    "in": { nouns: ["chin", "grin", "pin", "sin"], others: ["begin", "spin", "thin", "win"] },
    "ine": { nouns: ["brine", "line", "mine", "nine", "spine", "wine"], others: ["dine", "fine", "shine"] },
    "ing": { nouns: ["king", "ring", "spring", "sting", "swing", "thing"], others: ["bring", "sing"] },
    "ink": { nouns: ["drink", "link"], others: ["pink", "shrink", "sink", "think"] },
    "ip": { nouns: ["chip", "dip", "grip", "hip", "lip", "rip", "ship", "tip"], others: [] },
    "oat": { nouns: ["boat", "coat", "float", "goat", "moat"], others: [] },
    "ock": { nouns: ["block", "clock", "dock", "flock", "rock", "sock"], others: ["knock"] },
    "oil": { nouns: ["coil", "foil", "soil"], others: ["boil", "spoil"] },
    "oke": { nouns: ["joke"], others: ["broke", "choke", "poke", "smoke", "spoke", "woke"] },
    "ook": { nouns: ["book", "cook", "hook"], others: ["look", "shook", "took"] },
    "oom": { nouns: ["bloom", "boom", "doom", "gloom", "room", "zoom"], others: [] },
    "oon": { nouns: ["moon", "noon", "spoon"], others: ["soon", "tune"] },
    "ore": { nouns: ["score", "shore"], others: ["more", "pour", "roar", "sore", "tore"] },
    "orn": { nouns: ["corn", "horn", "thorn"], others: ["born", "morn", "scorn"] },
    "ound": { nouns: ["ground", "hound", "sound", "wound"], others: ["bound", "found", "round"] },
    "out": { nouns: ["gout", "pout", "sprout"], others: ["about", "doubt", "shout"] },
    "ow": { nouns: ["bow", "brow", "cow", "plow", "vow"], others: ["allow", "how", "now"] },
    "own": { nouns: ["clown", "crown", "down", "gown", "town"], others: ["brown", "drown"] },
    "uck": { nouns: ["buck", "duck", "truck"], others: ["luck", "pluck", "stuck"] },
    "ug": { nouns: ["bug", "hug", "jug", "mug", "rug"], others: ["dug", "tug"] },
    "ump": { nouns: ["bump", "dump", "grump", "jump", "lump", "pump"], others: [] },
    "unk": { nouns: ["bunk", "chunk", "junk", "trunk"], others: ["drunk", "sunk"] },
    "ush": { nouns: ["blush", "brush", "crush"], others: ["flush", "hush", "rush"] },
};

/*
 * Data Structure: Thematic Content Map (Hash Map)
 * This Hash Map is used to group stylistic elements (adjectives and
 * poem templates) under a single, descriptive theme name.
 * Allows the `generateRhymingPoem` algorithm to create poems with a consistent mood
 * and narrative by selecting a theme and using its associated content.
 */
const THEMED_RHYME_CONTENT = {
    nature: {
        adjs: ["gentle", "green", "wild", "flowing", "silent", "golden"],
        poemTemplates: [
            (nouns, adj) => `The ${adj} forest knows the sleeping ${nouns[0]},\nA secret kept where winding rivers ${nouns[1]}.\nThe wind speaks softly of a coming ${nouns[2]},\nBeneath the sun, a new day finds its ${nouns[3]}.`
        ]
    },
    night: {
        adjs: ["lonely", "dark", "moonlit", "silent", "distant", "hollow"],
        poemTemplates: [
            (nouns, adj) => `Upon the roof, a ${adj} ${nouns[0]},\nChasing a moth in a fleeting ${nouns[1]}.\nThe stars bear witness to its silent ${nouns[2]},\nAnd dreams take hold to banish all the ${nouns[3]}.`
        ]
    },
    emotion: {
        adjs: ["bright", "endless", "golden", "forgotten", "gentle", "bitter"],
        poemTemplates: [
            (nouns, adj) => `My heart recalls a ${adj} ${nouns[0]},\nA bittersweet and almost perfect ${nouns[1]}.\nIt's hard to capture and it's hard to ${nouns[2]},\nA fragile memory I can't let ${nouns[3]}.`
        ]
    }
};


// ALGORITHMS

/*
 Algorithm: Sound Core algorithm
 * Finds rhyming words by identifying a word's rhyme core, which starts from its first vowel.
 * It then finds other words in the wordlist that end with the same core.
 */
function findRhymingWords(word, list) {
    if (!word) return [];
    const vowels = "aeiou";
    let firstVowelIndex = -1;
    // Find the index of the first vowel in the word.
    for (let i = 0; i < word.length; i++) {
        if (vowels.includes(word[i])) {
            firstVowelIndex = i;
            break;
        }
    }
    // If no vowel is found, can't determine the rhyme sound.
    if (firstVowelIndex === -1) return [];

    // The rhyme core is the part of the word from the first vowel to the end.
    const rhymeSuffix = word.substring(firstVowelIndex);
    // A Set is used to automatically handle duplicate words.
    const rhymes = new Set();
    // linear scan through the wordlist.
    for (const w of list) {
        // A word cannot rhyme with itself.
        if (w !== word && w.endsWith(rhymeSuffix)) {
            rhymes.add(w);
        }
    }
    // Convert the Set to an array and limit the number of results.
    return Array.from(rhymes).slice(0, 30);
}


/*
 * Algorithm: Prefix-Based Alogorithm
 * Finds alliterative words by looking for words that start with the same first letter
 * as the input word.
 */
function findAlliterativeWords(word, list) {
    const alliterations = new Set();
    const firstLetter = word.charAt(0);
    if (!firstLetter) return [];
    // Scan the wordlist for words with the same prefix.
    for (const w of list) {
        if (w !== word && w.startsWith(firstLetter)) {
            alliterations.add(w);
        }
    }
    return Array.from(alliterations).slice(0, 30);
}


/*
 * Algorithm: Templated Alliteration Poem Generator
 * Constructs a four-line alliterative poem using the curated word lists and pre-written templates.
 */
function generateAlliterationPoem(word, lines = 4) {
    const letter = word.charAt(0);
    const curatedData = CURATED_ALLITERATION_WORDS[letter];
    if (!curatedData || (!curatedData.adjs.length && !curatedData.nouns.length)) {
        return `I don't have enough curated words for '${letter}' to write a meaningful poem yet.`;
    }
    // Helper functions for random word selection.
    const pickAdj = () => curatedData.adjs[Math.floor(Math.random() * curatedData.adjs.length)];
    const pickNoun = () => curatedData.nouns[Math.floor(Math.random() * curatedData.nouns.length)];
    // Pre-defined templates for poetic structure.
    const templates = [
        (adj, noun) => `The ${adj} ${noun} in the twilight fades.`,
        (adj, noun, w) => `A distant echo of the ${w} made.`,
        (adj, noun) => `${noun.charAt(0).toUpperCase() + noun.slice(1)}s call through ${adj} glades.`,
        (adj, noun) => `A world of ${adj} wonders and of passing shades.`
    ];
    const poemLines = [];
    // A Set is used to ensure templates are not repeated within the same poem.
    const usedTemplates = new Set();
    // Ensure the user's word is included in the poem for relevance.
    const wordTemplate = templates.find(t => t.toString().includes('(adj, noun, w)'));
    if (wordTemplate) {
        poemLines.push(wordTemplate(pickAdj(), pickNoun(), word));
        usedTemplates.add(wordTemplate);
    }
    // Fill the remaining lines with other templates.
    while (poemLines.length < lines) {
        let template;
        if (usedTemplates.size < templates.length) {
            do {
                template = templates[Math.floor(Math.random() * templates.length)];
            } while (usedTemplates.has(template));
        } else {
            template = templates[Math.floor(Math.random() * templates.length)];
        }
        usedTemplates.add(template);
        if (!template.toString().includes('(adj, noun, w)')) {
            poemLines.push(template(pickAdj(), pickNoun()));
        }
    }
    return poemLines.map(line => line.charAt(0).toUpperCase() + line.slice(1)).join('\n');
}


/*
 * Algorithm: Thematic Rhyming Poem Generator
 * Constructs a four-line rhyming poem using a specific theme and a curated rhyme family.
 */
function generateRhymingPoem(word, lines = 4) {
    let bestMatch = '';
    // Search for the most specific matching rhyme group.
    for (const suffix in CURATED_RHYME_GROUPS) {
        if (word.endsWith(suffix)) {
            if (suffix.length > bestMatch.length) {
                bestMatch = suffix;
            }
        }
    }
    let wordGroupInfo = null;
    if (bestMatch) {
        const group = CURATED_RHYME_GROUPS[bestMatch];
        if (group.nouns.includes(word)) {
            wordGroupInfo = { type: 'noun', nouns: group.nouns };
        } else if (group.others.includes(word)) {
            wordGroupInfo = { type: 'other', nouns: group.nouns };
        }
    }

    // If no curated rhyme group is found, return a message instead of a poem.
    if (!wordGroupInfo || wordGroupInfo.nouns.length < 1) {
        return { type: 'no_rhyme', content: `No rhyming poem could be generated for "${word}".` };
    }

    // Randomly select a theme to guide the poem's mood and vocabulary.
    const themes = Object.keys(THEMED_RHYME_CONTENT);
    const chosenThemeKey = themes[Math.floor(Math.random() * themes.length)];
    const theme = THEMED_RHYME_CONTENT[chosenThemeKey];
    const poemTemplate = theme.poemTemplates[Math.floor(Math.random() * theme.poemTemplates.length)];
    const chosenAdjective = theme.adjs[Math.floor(Math.random() * theme.adjs.length)];
    // Assemble the rhyming nouns for the poem.
    const poemNouns = [];
    const availableNouns = [...wordGroupInfo.nouns];
    if (wordGroupInfo.type === 'noun') {
        poemNouns.push(word);
    } else {
        poemNouns.push(availableNouns.shift() || 'rhyme');
    }
    let otherRhymeNouns = availableNouns.filter(r => r !== word);
    while (poemNouns.length < 4) {
        if (otherRhymeNouns.length > 0) {
            poemNouns.push(otherRhymeNouns.shift());
        } else {
            // Reuse nouns if necessary to fill the four lines.
            poemNouns.push(availableNouns[Math.floor(Math.random() * availableNouns.length)]);
        }
    }
    const poemContent = poemTemplate(poemNouns, chosenAdjective);
    return { type: 'rhyme', content: poemContent };
}


// UI AND EVENT HANDLING 
// connects the algorithms to the HTML elements, manages user input, and updates
// the display.
document.addEventListener('DOMContentLoaded', () => {
    //  Element References
    // Caching DOM elements for performance.
    const userInput = document.getElementById('userInput');
    const rhymeBtn = document.getElementById('rhymeBtn');
    const alliterationBtn = document.getElementById('alliterationBtn');
    const output = document.getElementById('output');
    const previewWords = document.getElementById('previewWords');
    const previewTitle = document.getElementById('previewTitle');
    const rhymingWordsOutput = document.getElementById('rhymingWordsOutput');
    const alliterativeWordsOutput = document.getElementById('alliterativeWordsOutput');
    const rhymePreviewContainer = document.getElementById('rhymePreviewContainer');
    const alliterationPreviewContainer = document.getElementById('alliterationPreviewContainer');
    const poemTitle = document.getElementById('poemTitle');
    const poemOutput = document.getElementById('poemOutput');

    // Core UI Functions 

    // Updates the poem display area with a title and content
    function displayPoem(title, content) {
        poemTitle.textContent = title;
        poemOutput.textContent = content;
    }

    // Updates the preview section with either rhyming or alliterative words.
    function displayPreview(word, type) {
        if (WORDLIST.length === 0) {
            previewWords.classList.remove('hidden');
            rhymingWordsOutput.textContent = 'Wordlist is not available or failed to load.';
            alliterativeWordsOutput.textContent = 'Wordlist is not available or failed to load.';
            return;
        }
        previewTitle.textContent = `Suggestions for "${word}"`;
        // Hide both preview containers initially to reset the state.
        rhymePreviewContainer.classList.add('hidden');
        alliterationPreviewContainer.classList.add('hidden');
        // Show only the relevant container based on the button clicked.
        if (type === 'rhyme') {
            const rhymes = findRhymingWords(word, WORDLIST);
            rhymingWordsOutput.textContent = rhymes.length > 0 ? rhymes.join(', ') : 'No common rhymes found.';
            rhymePreviewContainer.classList.remove('hidden');
        } else if (type === 'alliteration') {
            const alliterations = findAlliterativeWords(word, WORDLIST);
            alliterativeWordsOutput.textContent = alliterations.length > 0 ? alliterations.join(', ') : 'No common alliterations found.';
            alliterationPreviewContainer.classList.remove('hidden');
        }
        previewWords.classList.remove('hidden');
    }

    //Central handler for both poem generation buttons. 
    function handleGeneration(generatorFn, type) {
        const input = userInput.value.trim().toLowerCase();
        if (!input) {
            alert('Please enter a word.');
            return;
        }
        // Hide previous output before generating new content.
        output.classList.add('hidden');
        previewWords.classList.add('hidden');

        // Use a small timeout to allow the UI to update smoothly.
        setTimeout(() => {
            displayPreview(input, type);

            if (type === 'rhyme') {
                const result = generatorFn(input);
                // Handle the case where no curated rhyme poem could be made.
                if (result.type === 'no_rhyme') {
                    const title = `No Rhymes Found`;
                    displayPoem(title, result.content);
                } else { // Handle a successful rhyme poem generation.
                    const title = `A Rhyming Poem for "${input}"`;
                    displayPoem(title, result.content);
                }
            } else { // Handle alliteration poem generation.
                const poem = generatorFn(input);
                const title = `An Alliteration Poem on the word "${input}"`;
                displayPoem(title, poem);
            }

            // Show the output section with the new content.
            output.classList.remove('hidden');
        }, 50);
    }

    // Event Listeners
    // Connect the buttons to the central handler function.
    rhymeBtn.addEventListener('click', () => handleGeneration(generateRhymingPoem, 'rhyme'));
    alliterationBtn.addEventListener('click', () => handleGeneration(generateAlliterationPoem, 'alliteration'));

    // Initial Setup 
    // Load the wordlist from the file when the page is ready.
    fetchWordlist();
});
