export {};

let isInitialized = false;
let observers: IntersectionObserver[] = [];
let tocTracker: TocTracker | null = null;
let lastScrollY = 0;
let lastScrollTimestamp = 0;
let hasScrollSample = false;
let smoothedScrollSpeedPxPerMs = 0;

const MIN_SCROLL_SPEED_PX_PER_MS = 0.02;
const DEFAULT_SCROLL_SPEED_PX_PER_MS = 0.4;
const SCROLL_SPEED_SMOOTHING_FACTOR = 0.25;
const MAX_SAMPLE_INTERVAL_MS = 120;
const TOC_TRIGGER_VIEWPORT_RATIO = 0.3;

interface TocTracker {
    headings: HTMLElement[];
    linksBySlug: Map<string, HTMLAnchorElement>;
    activeSlug: string | null;
}

const setTocLinkCurrentState = (
    link: HTMLAnchorElement,
    isCurrent: boolean,
): void => {
    if (isCurrent) {
        link.setAttribute("aria-current", "location");
        link.setAttribute("data-current", "true");
        return;
    }
    link.removeAttribute("aria-current");
    link.removeAttribute("data-current");
};

const buildTocTracker = (layout: HTMLElement): void => {
    const tocLinks = Array.from(
        layout.querySelectorAll<HTMLAnchorElement>("[data-prose-toc-link]"),
    );
    if (tocLinks.length === 0) return;

    const linksBySlug = new Map<string, HTMLAnchorElement>();
    tocLinks.forEach((link) => {
        const slug = link.dataset.tocSlug?.trim();
        if (!slug) return;
        linksBySlug.set(slug, link);
        setTocLinkCurrentState(link, false);
    });
    if (linksBySlug.size === 0) return;

    const headings = Array.from(
        layout.querySelectorAll<HTMLElement>(".prose h2[id]"),
    ).filter((heading) => linksBySlug.has(heading.id));
    if (headings.length === 0) return;

    tocTracker = {
        headings,
        linksBySlug,
        activeSlug: null,
    };
};

const getActiveTocSlug = (tracker: TocTracker): string => {
    const triggerY = window.innerHeight * TOC_TRIGGER_VIEWPORT_RATIO;
    let activeSlug = tracker.headings[0]?.id;
    tracker.headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= triggerY) {
            activeSlug = heading.id;
        }
    });
    return activeSlug;
};

const updateTocCurrentStates = (): void => {
    if (!tocTracker) return;
    const currentActiveSlug = getActiveTocSlug(tocTracker);
    if (tocTracker.activeSlug === currentActiveSlug) return;

    tocTracker.linksBySlug.forEach((link, slug) => {
        setTocLinkCurrentState(link, slug === currentActiveSlug);
    });
    tocTracker.activeSlug = currentActiveSlug;
};

const setScrollSpeed = (): void => {
    const currentScrollTimestamp = performance.now();
    const currentScrollY = window.scrollY;

    if (lastScrollTimestamp > 0) {
        const deltaTimeMs = currentScrollTimestamp - lastScrollTimestamp;
        if (deltaTimeMs > 0 && deltaTimeMs <= MAX_SAMPLE_INTERVAL_MS) {
            const deltaY = Math.abs(currentScrollY - lastScrollY);
            const instantSpeed = deltaY / deltaTimeMs;

            if (!hasScrollSample) {
                smoothedScrollSpeedPxPerMs = instantSpeed;
                hasScrollSample = true;
            } else {
                smoothedScrollSpeedPxPerMs =
                    smoothedScrollSpeedPxPerMs *
                        (1 - SCROLL_SPEED_SMOOTHING_FACTOR) +
                    instantSpeed * SCROLL_SPEED_SMOOTHING_FACTOR;
            }
        } else if (deltaTimeMs > MAX_SAMPLE_INTERVAL_MS) {
            hasScrollSample = false;
        }
    }

    lastScrollY = currentScrollY;
    lastScrollTimestamp = currentScrollTimestamp;
};

const setSidebarAnimation = (layout: HTMLElement): void => {
    const sidebarTitle = layout.querySelector<HTMLElement>(
        "[data-sidebar-title]",
    );
    if (!sidebarTitle) return;

    const revealDistancePx = Math.max(sidebarTitle.scrollHeight, 1);
    const sampledSpeed = hasScrollSample
        ? smoothedScrollSpeedPxPerMs
        : DEFAULT_SCROLL_SPEED_PX_PER_MS;
    const effectiveSpeed = Math.max(sampledSpeed, MIN_SCROLL_SPEED_PX_PER_MS);
    const transitionDurationMs = Math.max(
        1,
        Math.round(revealDistancePx / effectiveSpeed),
    );

    layout.style.setProperty(
        "--sidebar-transition-ms",
        `${transitionDurationMs}ms`,
    );
    layout.style.setProperty(
        "--sidebar-title-max-height",
        `${revealDistancePx}px`,
    );
};

const init = (): void => {
    if (isInitialized) {
        observers.forEach((observer) => observer.disconnect());
        observers = [];
        tocTracker = null;
    }

    // TODO: better way to handle this
    const headerHeight = ((): number => {
        const header =
            document.querySelector<HTMLElement>("[data-site-header]");
        if (!header) return 0;
        const cssHeaderHeight = getComputedStyle(header)
            .getPropertyValue("--site-header-height")
            .trim();
        const parsedHeaderHeight = Number.parseFloat(cssHeaderHeight);
        if (Number.isFinite(parsedHeaderHeight)) {
            return parsedHeaderHeight;
        }
        return header.getBoundingClientRect().height;
    })();

    const layout = document.querySelector<HTMLElement>("[data-prose-layout]");
    if (layout) {
        buildTocTracker(layout);

        const sentinel = layout.querySelector<HTMLElement>(
            "[data-prose-title-sentinel]",
        );
        if (sentinel) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        setSidebarAnimation(layout);
                        layout.setAttribute(
                            "data-sidebar-title-visible",
                            entry.isIntersecting ? "false" : "true",
                        );
                    });
                },
                {
                    rootMargin: `-${headerHeight}px 0px 0px 0px`,
                },
            );

            setSidebarAnimation(layout);
            observer.observe(sentinel);
            observers.push(observer);
        }
    }

    updateTocCurrentStates();
};

if (typeof document !== "undefined" && !isInitialized) {
    init();
    isInitialized = true;
    setScrollSpeed();

    document.addEventListener("astro:after-swap", init);
    window.addEventListener("resize", init);
    window.addEventListener(
        "scroll",
        () => (setScrollSpeed(), updateTocCurrentStates()),
        {
            passive: true,
        },
    );
}
