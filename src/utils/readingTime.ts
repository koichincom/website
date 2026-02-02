export function getReadingTime(content: string): string {
    const WORDS_PER_MINUTE = 238;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / WORDS_PER_MINUTE);
    if (minutes > 60) {
        const hours = Math.trunc(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes === 0
            ? `${hours} hr${hours > 1 ? "s" : ""}`
            : `${hours} hr${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
    } else {
        return `${minutes} min`;
    }
}
