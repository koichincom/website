export {};

let isInitialized = false;
let observers: IntersectionObserver[] = [];
let tocTracker: TocTracker | null = null;
let lastScrollY = 0;
let lastScrollTimestamp = 0;
let hasScrollSample = false;
let smoothedScrollSpeedPxPerMs = 0;
let cachedRevealDistancePx: number | null = null;
let proseLayout: HTMLElement | null = null;
let tocTransitionMode: TocTransitionMode = "scroll";
let tocClickModeResetTimeoutId: number | null = null;
const tocTransitionCleanupByLink = new Map<HTMLAnchorElement, () => void>();

const MIN_SCROLL_SPEED_PX_PER_MS = 0.02;
const DEFAULT_SCROLL_SPEED_PX_PER_MS = 0.4;
const SCROLL_SPEED_SMOOTHING_FACTOR = 0.25;
const MAX_SAMPLE_INTERVAL_MS = 120;
const TOC_TRIGGER_VIEWPORT_RATIO = 0.3;
const PAGE_END_EPSILON_PX = 1;
const TOC_CLICK_TRANSITION_MS = 150;
const TOC_CLICK_SCROLL_SETTLE_MS = 200;
const TOC_TRANSITION_CLEANUP_BUFFER_MS = 50;

type TocTransitionMode = "scroll" | "click";

interface TocTracker {
    headings: HTMLElement[];
    linksBySlug: Map<string, HTMLAnchorElement>;
    activeSlug: string | null;
}

const clearTocClickModeResetTimeout = (): void => {
    if (tocClickModeResetTimeoutId === null) return;
    window.clearTimeout(tocClickModeResetTimeoutId);
    tocClickModeResetTimeoutId = null;
};

const setTocTransitionMode = (mode: TocTransitionMode): void => {
    tocTransitionMode = mode;
    if (!proseLayout) return;

    if (mode === "click") {
        proseLayout.style.setProperty(
            "--prose-toc-transition-ms",
            `${TOC_CLICK_TRANSITION_MS}ms`,
        );
        return;
    }

    proseLayout.style.setProperty(
        "--prose-toc-transition-ms",
        "var(--prose-scroll-transition-ms, 150ms)",
    );
};

const scheduleTocTransitionModeReset = (): void => {
    clearTocClickModeResetTimeout();
    tocClickModeResetTimeoutId = window.setTimeout(() => {
        setTocTransitionMode("scroll");
        tocClickModeResetTimeoutId = null;
    }, TOC_CLICK_SCROLL_SETTLE_MS);
};

const clearAllTocCurrentTransitions = (): void => {
    tocTransitionCleanupByLink.forEach((cleanup) => cleanup());
    tocTransitionCleanupByLink.clear();
};

const prefersReducedMotion = (): boolean => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const parseCssTimeToMs = (timeValue: string | undefined): number => {
    if (!timeValue) return 0;

    const trimmedValue = timeValue.trim();
    if (trimmedValue.endsWith("ms")) {
        return Number.parseFloat(trimmedValue);
    }
    if (trimmedValue.endsWith("s")) {
        return Number.parseFloat(trimmedValue) * 1000;
    }

    return 0;
};

const getMaxTransitionTotalMs = (link: HTMLAnchorElement): number => {
    const computedStyles = window.getComputedStyle(link);
    const durationTokens = computedStyles.transitionDuration.split(",");
    const delayTokens = computedStyles.transitionDelay.split(",");
    const tokenCount = Math.max(durationTokens.length, delayTokens.length);

    let maxTotalMs = 0;
    for (let tokenIndex = 0; tokenIndex < tokenCount; tokenIndex += 1) {
        const durationToken =
            durationTokens[tokenIndex] ??
            durationTokens[durationTokens.length - 1] ??
            "0s";
        const delayToken =
            delayTokens[tokenIndex] ??
            delayTokens[delayTokens.length - 1] ??
            "0s";

        const totalMs =
            parseCssTimeToMs(durationToken) + parseCssTimeToMs(delayToken);
        maxTotalMs = Math.max(maxTotalMs, totalMs);
    }

    return maxTotalMs;
};

const addTocCurrentTransition = (link: HTMLAnchorElement): void => {
    tocTransitionCleanupByLink.get(link)?.();
    link.classList.add("site-toc-link-current-transition");

    let cleanupTimeoutId: number | null = null;
    const onTransitionEnd = (event: TransitionEvent): void => {
        if (event.target !== link) return;
        if (
            event.propertyName !== "color" &&
            event.propertyName !== "border-bottom-color"
        ) {
            return;
        }

        cleanup();
    };

    const cleanup = (): void => {
        if (cleanupTimeoutId !== null) {
            window.clearTimeout(cleanupTimeoutId);
            cleanupTimeoutId = null;
        }

        link.classList.remove("site-toc-link-current-transition");
        link.removeEventListener("transitionend", onTransitionEnd);
        tocTransitionCleanupByLink.delete(link);
    };

    tocTransitionCleanupByLink.set(link, cleanup);
    link.addEventListener("transitionend", onTransitionEnd);

    const fallbackTimeoutMs = Math.max(
        getMaxTransitionTotalMs(link) + TOC_TRANSITION_CLEANUP_BUFFER_MS,
        TOC_TRANSITION_CLEANUP_BUFFER_MS,
    );
    cleanupTimeoutId = window.setTimeout(cleanup, fallbackTimeoutMs);
};

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
    const pageScrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
    );
    const isAtPageEnd =
        // Prevents "at page end" from being true at initial top position,
        // including short/non-scrollable pages.
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
            pageScrollHeight - PAGE_END_EPSILON_PX;
    if (isAtPageEnd) {
        return tracker.headings[tracker.headings.length - 1].id;
    }

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

    const previousActiveSlug = tocTracker.activeSlug;
    const previousActiveLink = previousActiveSlug
        ? (tocTracker.linksBySlug.get(previousActiveSlug) ?? null)
        : null;
    const currentActiveLink =
        tocTracker.linksBySlug.get(currentActiveSlug) ?? null;

    if (!prefersReducedMotion()) {
        if (previousActiveLink) {
            addTocCurrentTransition(previousActiveLink);
        }
        if (currentActiveLink && currentActiveLink !== previousActiveLink) {
            addTocCurrentTransition(currentActiveLink);
        }
    }

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

const updateTransitionDuration = (layout: HTMLElement): void => {
    if (cachedRevealDistancePx === null) return;

    const sampledSpeed = hasScrollSample
        ? smoothedScrollSpeedPxPerMs
        : DEFAULT_SCROLL_SPEED_PX_PER_MS;
    const effectiveSpeed = Math.max(sampledSpeed, MIN_SCROLL_SPEED_PX_PER_MS);
    const transitionDurationMs = Math.max(
        1,
        Math.round(cachedRevealDistancePx / effectiveSpeed),
    );

    layout.style.setProperty(
        "--prose-scroll-transition-ms",
        `${transitionDurationMs}ms`,
    );
};

const setSidebarAnimation = (layout: HTMLElement): void => {
    const sidebarTitle = layout.querySelector<HTMLElement>(
        "[data-sidebar-title]",
    );
    if (!sidebarTitle) return;

    const revealDistancePx = Math.max(sidebarTitle.scrollHeight, 1);
    cachedRevealDistancePx = revealDistancePx;

    updateTransitionDuration(layout);

    layout.style.setProperty(
        "--sidebar-title-max-height",
        `${revealDistancePx}px`,
    );
};

const init = (): void => {
    if (isInitialized) {
        observers.forEach((observer) => observer.disconnect());
        observers = [];
        clearAllTocCurrentTransitions();
        tocTracker = null;
        proseLayout = null;
        cachedRevealDistancePx = null;
    }

    clearTocClickModeResetTimeout();
    setTocTransitionMode("scroll");

    const headerHeight =
        Number.parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue("--site-header-height")
                .trim(),
        ) || 0;

    proseLayout = document.querySelector<HTMLElement>("[data-prose-layout]");
    if (proseLayout) {
        setTocTransitionMode("scroll");
        buildTocTracker(proseLayout);

        const sentinel = proseLayout.querySelector<HTMLElement>(
            "[data-prose-title-sentinel]",
        );
        if (sentinel) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        setSidebarAnimation(proseLayout!);
                        proseLayout!.setAttribute(
                            "data-sidebar-title-visible",
                            entry.isIntersecting ? "false" : "true",
                        );
                    });
                },
                {
                    rootMargin: `-${headerHeight}px 0px 0px 0px`,
                },
            );

            setSidebarAnimation(proseLayout);
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
    document.addEventListener("click", (event: MouseEvent) => {
        const eventTarget = event.target;
        if (!(eventTarget instanceof Element)) return;

        const tocLink = eventTarget.closest<HTMLAnchorElement>(
            "[data-prose-toc-link]",
        );
        if (!tocLink || !proseLayout || !proseLayout.contains(tocLink)) return;

        setTocTransitionMode("click");
        scheduleTocTransitionModeReset();
    });
    window.addEventListener("resize", init);
    window.addEventListener(
        "scroll",
        () => {
            setScrollSpeed();
            if (proseLayout) {
                updateTransitionDuration(proseLayout);
            }
            if (tocTransitionMode === "click") {
                scheduleTocTransitionModeReset();
            }
            updateTocCurrentStates();
        },
        {
            passive: true,
        },
    );
}
