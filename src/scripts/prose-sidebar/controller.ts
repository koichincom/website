import { getHeaderHeight } from "./dom";
import {
    getCachedRevealDistancePx,
    maybeEnableSidebarTitleTransitions,
    refreshSidebarTitleState,
    resetSidebarTitle,
    scheduleSidebarTitleTransitionsEnable,
    setSidebarTitleTransitionsEnabled,
    setupSidebarTitleObserver,
} from "./sidebar-title";
import {
    resetScrollMetrics,
    setScrollSpeed,
    updateTransitionDuration,
} from "./scroll-metrics";
import {
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
} from "./toc";

let proseLayout: HTMLElement | null = null;

const setTocTransitionDuration = (durationMs?: number): void => {
    if (!proseLayout) return;

    if (typeof durationMs === "number") {
        proseLayout.style.setProperty(
            "--prose-toc-transition-ms",
            `${Math.max(0, Math.round(durationMs))}ms`,
        );
        return;
    }

    proseLayout.style.setProperty(
        "--prose-toc-transition-ms",
        "var(--prose-scroll-transition-ms, 150ms)",
    );
};

const init = ({
    isReinitializing = false,
    syncHashTarget = false,
}: {
    isReinitializing?: boolean;
    syncHashTarget?: boolean;
} = {}): void => {
    if (isReinitializing) {
        resetSidebarTitle();
        resetToc(setTocTransitionDuration);
        proseLayout = null;
    }

    resetScrollMetrics(window.scrollY);

    proseLayout = document.querySelector<HTMLElement>("[data-prose-layout]");
    if (proseLayout) {
        const headerHeight = getHeaderHeight();
        setSidebarTitleTransitionsEnabled(proseLayout, false);
        setTocTransitionDuration();
        buildTocTracker(proseLayout);
        setupSidebarTitleObserver(proseLayout, headerHeight);
    }

    if (syncHashTarget) {
        syncHashTargetScrollPosition(setTocTransitionDuration);
    }

    if (proseLayout) {
        refreshSidebarTitleState(proseLayout, getHeaderHeight());
        maybeEnableSidebarTitleTransitions(proseLayout);
    }

    updateTocCurrentStates();
    markTocCurrentStateInitialized();
};

const primeScrollMetrics = (): void => {
    setScrollSpeed();
};

const handleWindowLoad = (): void => {
    syncHashTargetScrollPosition(setTocTransitionDuration);

    if (proseLayout) {
        refreshSidebarTitleState(proseLayout, getHeaderHeight());
    }

    scheduleSidebarTitleTransitionsEnable(proseLayout);
};

const handleDocumentClick = (event: MouseEvent): void => {
    handleTocLinkClick(event, proseLayout, setTocTransitionDuration);
};

const handleDocumentFocusIn = (event: FocusEvent): void => {
    handleTocFocusIn(event);
};

const handleDocumentFocusOut = (event: FocusEvent): void => {
    handleTocFocusOut(event);
};

const handleInteractionInterruption = (event?: Event): void => {
    if (event instanceof KeyboardEvent) {
        recordTocKeyboardNavigation(event);
    }

    handleProgrammaticTocScrollInterruption(setTocTransitionDuration);
};

const handleResize = (): void => {
    if (!proseLayout) return;

    const headerHeight = getHeaderHeight();
    setupSidebarTitleObserver(proseLayout, headerHeight);
    refreshSidebarTitleState(proseLayout, headerHeight);
    updateTransitionDuration(proseLayout, getCachedRevealDistancePx());
    updateTocCurrentStates();
};

const handleScroll = (): void => {
    setScrollSpeed();

    if (proseLayout) {
        updateTransitionDuration(proseLayout, getCachedRevealDistancePx());
    }

    updateTocCurrentStates();
};

export {
    handleDocumentClick,
    handleDocumentFocusIn,
    handleDocumentFocusOut,
    handleInteractionInterruption,
    handleResize,
    handleScroll,
    handleWindowLoad,
    init,
    primeScrollMetrics,
};
