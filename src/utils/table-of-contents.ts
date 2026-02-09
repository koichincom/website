export interface TocHeading {
    depth: number;
    slug: string;
    text: string;
}

export const getH2Headings = (headings: TocHeading[] = []): TocHeading[] => {
    return headings.filter((heading) => heading.depth === 2 && heading.slug);
};
