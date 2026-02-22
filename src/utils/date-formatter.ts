const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
});

export function formatDate(date: Date): string {
    return DATE_FORMATTER.format(date);
}
