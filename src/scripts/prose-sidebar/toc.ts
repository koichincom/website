import {
    decodeHashFragment,
    getHashTargetElement,
    getHeadingTargetScrollY,
    getMaxTransitionTotalMs,
    PAGE_END_EPSILON_PX,
    prefersReducedMotion,
} from "./dom";

const TOC_TRIGGER_VIEWPORT_RATIO = 0.3;
const TOC_CLICK_SCROLL_DURATION_MS = 150;
const TOC_TRANSITION_CLEANUP_BUFFER_MS = 50;

interface TocTracker {
    headings: HTMLElement[];
    linksBySlug: Map<string, HTMLAnchorElement>;
    activeSlug: string | null;
}

let tocTracker: TocTracker | null = null;
let activeTocScrollRafId: number | null = null;
let isProgrammaticTocScroll = false;
let tocClickTargetSlug: string | null = null;
let hasInitializedTocCurrentState = false;
let hasPendingTocKeyboardNavigation = false;
const tocTransitionCleanupByLink = new Map<HTMLAnchorElement, () => void>();
const keyboardFocusedTocLinks = new WeakSet<HTMLAnchorElement>();

const recordTocKeyboardNavigation = (event: KeyboardEvent): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === "Tab" || event.key.startsWith("Arrow")) {
        hasPendingTocKeyboardNavigation = true;
    }
};

const handleTocFocusIn = (event: FocusEvent): void => {
    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) {
        hasPendingTocKeyboardNavigation = false;
        return;
    }

    const tocLink = eventTarget.closest<HTMLAnchorElement>("[data-prose-toc-link]");
    if (tocLink && hasPendingTocKeyboardNavigation) {
        keyboardFocusedTocLinks.add(tocLink);
    }

    hasPendingTocKeyboardNavigation = false;
};

const handleTocFocusOut = (event: FocusEvent): void => {
    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) return;

    const tocLink = eventTarget.closest<HTMLAnchorElement>("[data-prose-toc-link]");
    if (!tocLink) return;

    keyboardFocusedTocLinks.delete(tocLink);
};

const shouldPreserveActivatedTocFocus = (
    event: MouseEvent,
    tocLink: HTMLAnchorElement,
): boolean => {
    if (event.detail > 0) return false;
    if (document.activeElement !== tocLink) return false;
    return keyboardFocusedTocLinks.has(tocLink);
};

const blurActivatedTocLinkIfNeeded = (
    event: MouseEvent,
    tocLink: HTMLAnchorElement,
): void => {
    if (shouldPreserveActivatedTocFocus(event, tocLink)) return;

    tocLink.blur();
};

const clearAllTocCurrentTransitions = (): void => {
    tocTransitionCleanupByLink.forEach((cleanup) => cleanup());
    tocTransitionCleanupByLink.clear();
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

const setActiveTocSlug = (nextActiveSlug: string): void => {
    if (!tocTracker || tocTracker.activeSlug === nextActiveSlug) return;

    const previousActiveSlug = tocTracker.activeSlug;
    const previousActiveLink = previousActiveSlug
        ? (tocTracker.linksBySlug.get(previousActiveSlug) ?? null)
        : null;
    const nextActiveLink = tocTracker.linksBySlug.get(nextActiveSlug) ?? null;

    if (hasInitializedTocCurrentState && !prefersReducedMotion()) {
        if (previousActiveLink) {
            addTocCurrentTransition(previousActiveLink);
        }
        if (nextActiveLink && nextActiveLink !== previousActiveLink) {
            addTocCurrentTransition(nextActiveLink);
        }
    }

    tocTracker.linksBySlug.forEach((link, slug) => {
        setTocLinkCurrentState(link, slug === nextActiveSlug);
    });
    tocTracker.activeSlug = nextActiveSlug;
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

    if (isProgrammaticTocScroll && tocClickTargetSlug) {
        setActiveTocSlug(tocClickTargetSlug);
        return;
    }

    const currentActiveSlug = getActiveTocSlug(tocTracker);
    setActiveTocSlug(currentActiveSlug);
};

const replaceUrlHash = (targetHash: string): void => {
    if (window.location.hash === targetHash) return;

    const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`;
    history.replaceState(history.state, "", nextUrl);
};

const stopProgrammaticTocScroll = (
    syncCurrentState: boolean,
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    const wasProgrammaticTocScroll = isProgrammaticTocScroll;

    if (activeTocScrollRafId !== null) {
        window.cancelAnimationFrame(activeTocScrollRafId);
        activeTocScrollRafId = null;
    }

    isProgrammaticTocScroll = false;
    tocClickTargetSlug = null;
    setTocTransitionDuration();

    if (syncCurrentState && wasProgrammaticTocScroll) {
        updateTocCurrentStates();
    }
};

const syncHashTargetScrollPosition = (
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    const targetElement = getHashTargetElement();
    if (!targetElement) return;

    stopProgrammaticTocScroll(false, setTocTransitionDuration);
    window.scrollTo(0, getHeadingTargetScrollY(targetElement));
};

const startProgrammaticTocScroll = (
    targetSlug: string,
    targetScrollY: number,
    targetHash: string,
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    stopProgrammaticTocScroll(false, setTocTransitionDuration);

    const startScrollY = window.scrollY;
    const distancePx = Math.abs(targetScrollY - startScrollY);
    if (distancePx < 1) {
        setActiveTocSlug(targetSlug);
        window.scrollTo(0, targetScrollY);
        replaceUrlHash(targetHash);
        updateTocCurrentStates();
        return;
    }

    const durationMs = TOC_CLICK_SCROLL_DURATION_MS;
    const scrollDeltaY = targetScrollY - startScrollY;
    const animationStartTime = performance.now();

    setTocTransitionDuration(durationMs);
    isProgrammaticTocScroll = true;
    tocClickTargetSlug = targetSlug;
    setActiveTocSlug(targetSlug);

    const animateScroll = (timestamp: number): void => {
        if (!isProgrammaticTocScroll || tocClickTargetSlug !== targetSlug) {
            return;
        }

        const elapsedTimeMs = timestamp - animationStartTime;
        const progress = Math.min(elapsedTimeMs / durationMs, 1);
        window.scrollTo(0, startScrollY + scrollDeltaY * progress);

        if (progress < 1) {
            activeTocScrollRafId = window.requestAnimationFrame(animateScroll);
            return;
        }

        stopProgrammaticTocScroll(false, setTocTransitionDuration);
        replaceUrlHash(targetHash);
        updateTocCurrentStates();
    };

    activeTocScrollRafId = window.requestAnimationFrame(animateScroll);
};

const handleTocLinkClick = (
    event: MouseEvent,
    proseLayout: HTMLElement | null,
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    if (event.button !== 0) return;

    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) return;

    const tocLink = eventTarget.closest<HTMLAnchorElement>(
        "[data-prose-toc-link]",
    );
    if (!tocLink || !proseLayout || !proseLayout.contains(tocLink)) return;

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        blurActivatedTocLinkIfNeeded(event, tocLink);
        return;
    }

    const targetSlug =
        tocLink.dataset.tocSlug?.trim() ||
        decodeHashFragment(tocLink.hash.slice(1));
    if (!targetSlug) return;

    const targetHeading = (tocTracker?.headings.find(
        (heading) => heading.id === targetSlug,
    ) ?? document.getElementById(targetSlug)) as HTMLElement | null;
    if (!targetHeading) return;

    event.stopPropagation();
    event.preventDefault();

    const targetHash = tocLink.hash || `#${targetSlug}`;
    const targetScrollY = getHeadingTargetScrollY(targetHeading);
    if (prefersReducedMotion()) {
        stopProgrammaticTocScroll(false, setTocTransitionDuration);
        setActiveTocSlug(targetSlug);
        window.scrollTo(0, targetScrollY);
        replaceUrlHash(targetHash);
        updateTocCurrentStates();
        blurActivatedTocLinkIfNeeded(event, tocLink);
        return;
    }

    startProgrammaticTocScroll(
        targetSlug,
        targetScrollY,
        targetHash,
        setTocTransitionDuration,
    );
    blurActivatedTocLinkIfNeeded(event, tocLink);
};

const handleProgrammaticTocScrollInterruption = (
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    if (!isProgrammaticTocScroll) return;
    stopProgrammaticTocScroll(true, setTocTransitionDuration);
};

const resetToc = (
    setTocTransitionDuration: (durationMs?: number) => void,
): void => {
    clearAllTocCurrentTransitions();
    stopProgrammaticTocScroll(false, setTocTransitionDuration);
    tocTracker = null;
    hasInitializedTocCurrentState = false;
};

const markTocCurrentStateInitialized = (): void => {
    hasInitializedTocCurrentState = true;
};

export {
    buildTocTracker,
    handleTocFocusIn,
    handleTocFocusOut,
    handleProgrammaticTocScrollInterruption,
    handleTocLinkClick,
    markTocCurrentStateInitialized,
    recordTocKeyboardNavigation,
    resetToc,
    syncHashTargetScrollPosition,
    updateTocCurrentStates,
};
