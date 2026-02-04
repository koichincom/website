const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

export function formatDate(date: Date): string {
    return DATE_FORMATTER.format(date);
}
