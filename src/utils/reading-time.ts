export function getReadingTime(content: string): string {
    const WORDS_PER_MINUTE = 238;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / WORDS_PER_MINUTE);
    if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    } else {
        return `${minutes}m`;
    }
}
