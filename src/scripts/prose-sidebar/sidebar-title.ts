import { getHashTargetElement } from "./dom";
import { updateTransitionDuration } from "./scroll-metrics";

let sidebarTitleObserver: IntersectionObserver | null = null;
let cachedRevealDistancePx: number | null = null;
let enableSidebarTitleTransitionsRafId: number | null = null;
let hasInitializedSidebarTitleTransitions = false;

const resetSidebarTitle = (): void => {
    disconnectSidebarTitleObserver();

    if (enableSidebarTitleTransitionsRafId !== null) {
        window.cancelAnimationFrame(enableSidebarTitleTransitionsRafId);
        enableSidebarTitleTransitionsRafId = null;
    }

    cachedRevealDistancePx = null;
    hasInitializedSidebarTitleTransitions = false;
};

const setSidebarTitleTransitionsEnabled = (
    layout: HTMLElement | null,
    enabled: boolean,
): void => {
    if (!layout) return;

    if (enabled) {
        layout.setAttribute("data-sidebar-title-transitions", "true");
        return;
    }

    layout.removeAttribute("data-sidebar-title-transitions");
};

const updateSidebarTitleVisibility = (
    layout: HTMLElement,
    headerHeight: number,
): void => {
    const sentinel = layout.querySelector<HTMLElement>(
        "[data-prose-title-sentinel]",
    );
    if (!sentinel) return;

    const shouldShowSidebarTitle =
        sentinel.getBoundingClientRect().top < headerHeight;
    layout.setAttribute(
        "data-sidebar-title-visible",
        shouldShowSidebarTitle ? "true" : "false",
    );
};

const setSidebarAnimation = (layout: HTMLElement): void => {
    const sidebarTitle = layout.querySelector<HTMLElement>(
        "[data-sidebar-title]",
    );
    if (!sidebarTitle) return;

    const revealDistancePx = Math.max(sidebarTitle.scrollHeight, 1);
    cachedRevealDistancePx = revealDistancePx;

    updateTransitionDuration(layout, cachedRevealDistancePx);

    layout.style.setProperty(
        "--sidebar-title-max-height",
        `${revealDistancePx}px`,
    );
};

const refreshSidebarTitleState = (
    layout: HTMLElement,
    headerHeight: number,
): void => {
    setSidebarAnimation(layout);
    updateSidebarTitleVisibility(layout, headerHeight);
};

const disconnectSidebarTitleObserver = (): void => {
    sidebarTitleObserver?.disconnect();
    sidebarTitleObserver = null;
};

const setupSidebarTitleObserver = (
    layout: HTMLElement,
    headerHeight: number,
): void => {
    const sentinel = layout.querySelector<HTMLElement>(
        "[data-prose-title-sentinel]",
    );

    disconnectSidebarTitleObserver();
    if (!sentinel) return;

    sidebarTitleObserver = new IntersectionObserver(
        () => {
            refreshSidebarTitleState(layout, headerHeight);
        },
        {
            rootMargin: `-${headerHeight}px 0px 0px 0px`,
        },
    );

    sidebarTitleObserver.observe(sentinel);
};

const scheduleSidebarTitleTransitionsEnable = (
    layout: HTMLElement | null,
): void => {
    if (!layout || hasInitializedSidebarTitleTransitions) return;

    if (enableSidebarTitleTransitionsRafId !== null) {
        window.cancelAnimationFrame(enableSidebarTitleTransitionsRafId);
    }

    enableSidebarTitleTransitionsRafId = window.requestAnimationFrame(() => {
        enableSidebarTitleTransitionsRafId = null;

        setSidebarTitleTransitionsEnabled(layout, true);
        hasInitializedSidebarTitleTransitions = true;
    });
};

const maybeEnableSidebarTitleTransitions = (
    layout: HTMLElement | null,
): void => {
    if (getHashTargetElement() && document.readyState !== "complete") {
        return;
    }

    scheduleSidebarTitleTransitionsEnable(layout);
};

const getCachedRevealDistancePx = (): number | null => {
    return cachedRevealDistancePx;
};

export {
    disconnectSidebarTitleObserver,
    getCachedRevealDistancePx,
    maybeEnableSidebarTitleTransitions,
    refreshSidebarTitleState,
    resetSidebarTitle,
    scheduleSidebarTitleTransitionsEnable,
    setSidebarTitleTransitionsEnabled,
    setupSidebarTitleObserver,
};
