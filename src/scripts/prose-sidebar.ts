export {};

let initialized = false;
let observers: IntersectionObserver[] = [];
let lastScrollY = 0;
let lastScrollTimestamp = 0;
let hasScrollSample = false;
let smoothedScrollSpeedPxPerMs = 0;

const MIN_SCROLL_SPEED_PX_PER_MS = 0.02;
const DEFAULT_SCROLL_SPEED_PX_PER_MS = 0.4;
const SCROLL_SPEED_SMOOTHING_FACTOR = 0.25;
const MAX_SAMPLE_INTERVAL_MS = 120;

const disconnectObservers = (): void => {
    observers.forEach((observer) => observer.disconnect());
    observers = [];
};

const getHeaderHeight = (): number => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return 0;

    const cssHeaderHeight = getComputedStyle(header)
        .getPropertyValue("--site-header-height")
        .trim();
    const parsedHeaderHeight = Number.parseFloat(cssHeaderHeight);

    if (Number.isFinite(parsedHeaderHeight)) {
        return parsedHeaderHeight;
    }

    return header.getBoundingClientRect().height;
};

const sampleScrollSpeed = (): void => {
    const now = performance.now();
    const currentScrollY = window.scrollY;

    if (lastScrollTimestamp > 0) {
        const deltaTimeMs = now - lastScrollTimestamp;
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
    lastScrollTimestamp = now;
};

const getEffectiveScrollSpeed = (): number => {
    const sampledSpeed = hasScrollSample
        ? smoothedScrollSpeedPxPerMs
        : DEFAULT_SCROLL_SPEED_PX_PER_MS;
    return Math.max(sampledSpeed, MIN_SCROLL_SPEED_PX_PER_MS);
};

const applySidebarMotionTiming = (layout: HTMLElement): void => {
    const sidebarTitle = layout.querySelector<HTMLElement>(
        "[data-sidebar-title]",
    );
    if (!sidebarTitle) return;

    const revealDistancePx = Math.max(sidebarTitle.scrollHeight, 1);
    const effectiveSpeed = getEffectiveScrollSpeed();
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

const initProseSidebar = (): void => {
    disconnectObservers();

    const headerHeight = getHeaderHeight();

    document
        .querySelectorAll<HTMLElement>("[data-prose-layout]")
        .forEach((layout) => {
            const sentinel = layout.querySelector<HTMLElement>(
                "[data-prose-title-sentinel]",
            );
            if (!sentinel) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        applySidebarMotionTiming(layout);
                        layout.setAttribute(
                            "data-sidebar-title-visible",
                            entry.isIntersecting ? "false" : "true",
                        );
                    });
                },
                {
                    rootMargin: `-${headerHeight}px 0px 0px 0px`,
                    threshold: 0,
                },
            );

            applySidebarMotionTiming(layout);
            observer.observe(sentinel);
            observers.push(observer);
        });
};

if (typeof document !== "undefined" && !initialized) {
    initialized = true;
    sampleScrollSpeed();

    initProseSidebar();

    window.addEventListener("scroll", sampleScrollSpeed, { passive: true });
    window.addEventListener("resize", initProseSidebar);
    document.addEventListener("astro:after-swap", initProseSidebar);
}
