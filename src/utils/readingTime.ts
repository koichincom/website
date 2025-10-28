/**
 * Calculate reading time for content
 * @param content The text content to analyze
 * @returns Reading time in minutes
 */
export function getReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return minutes;
}

/**
 * Format reading time as human-readable string
 * @param minutes Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
