export interface KeywordExtractionOptions {
  /** Maximum number of keywords to return. Defaults to 10. */
  limit?: number;
  /** Ignore single-word keywords shorter than this. Defaults to 2. */
  minWordLength?: number;
  /** Additional words to exclude, alongside common English stop words. */
  stopWords?: string[];
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}

const DEFAULT_STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by",
  "for", "from", "had", "has", "have", "he", "her", "hers", "him",
  "his", "i", "if", "in", "into", "is", "it", "its", "me", "my",
  "of", "on", "or", "our", "ours", "she", "so", "than", "that",
  "the", "their", "theirs", "them", "then", "there", "these", "they",
  "this", "those", "to", "too", "us", "was", "we", "were", "what",
  "when", "where", "which", "who", "will", "with", "you", "your",
  "yours",
]);

function tokenize(text: string): string[] {
  return text.toLocaleLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
}

/**
 * Returns the most frequent non-stop-word terms and their share of all words.
 * Density is expressed as a percentage, rounded to two decimal places.
 */
export function extractTopKeywords(
  text: string,
  options: KeywordExtractionOptions = {},
): KeywordFrequency[] {
  const limit = options.limit ?? 10;
  const minWordLength = options.minWordLength ?? 2;

  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative integer");
  }
  if (!Number.isInteger(minWordLength) || minWordLength < 1) {
    throw new RangeError("minWordLength must be a positive integer");
  }

  const stopWords = new Set(DEFAULT_STOP_WORDS);
  for (const word of options.stopWords ?? []) {
    for (const token of tokenize(word)) stopWords.add(token);
  }

  const words = tokenize(text);
  if (words.length === 0 || limit === 0) return [];

  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < minWordLength || stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([wordA, countA], [wordB, countB]) => countB - countA || wordA.localeCompare(wordB))
    .slice(0, limit)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number(((count / words.length) * 100).toFixed(2)),
    }));
}

/**
 * Calculates the percentage of text words covered by occurrences of a keyword
 * or phrase. Matching is case-insensitive and punctuation-insensitive.
 */
export function calculateKeywordDensity(text: string, keyword: string): number {
  const words = tokenize(text);
  const phrase = tokenize(keyword);
  if (words.length === 0 || phrase.length === 0 || phrase.length > words.length) return 0;

  let occurrences = 0;
  for (let index = 0; index <= words.length - phrase.length; index++) {
    if (phrase.every((word, offset) => words[index + offset] === word)) {
      occurrences++;
    }
  }

  return Number(((occurrences * phrase.length / words.length) * 100).toFixed(2));
}
