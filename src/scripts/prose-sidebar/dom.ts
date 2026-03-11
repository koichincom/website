const PAGE_END_EPSILON_PX = 1;

const prefersReducedMotion = (): boolean => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const decodeHashFragment = (value: string): string | null => {
    try {
        return decodeURIComponent(value).trim();
    } catch {
        return null;
    }
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

const getHeaderHeight = (): number => {
    return (
        Number.parseFloat(
            getComputedStyle(document.documentElement)
                .getPropertyValue("--site-header-height")
                .trim(),
        ) || 0
    );
};

const getRootCssLengthVar = (variableName: string): number => {
    const rawValue = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    return Number.parseFloat(rawValue) || 0;
};

const getLayoutMainStartOffset = (): number => {
    return (
        getRootCssLengthVar("--site-header-height") +
        getRootCssLengthVar("--layout-main-start-gap")
    );
};

const getHeadingTargetScrollY = (heading: HTMLElement): number => {
    const headingTop = window.scrollY + heading.getBoundingClientRect().top;
    const targetY = headingTop - getLayoutMainStartOffset();
    const pageScrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
    );
    const maxScrollY = Math.max(pageScrollHeight - window.innerHeight, 0);

    return Math.min(Math.max(targetY, 0), maxScrollY);
};

const getHashTargetElement = (): HTMLElement | null => {
    const rawHash = window.location.hash.slice(1);
    if (!rawHash) return null;

    const targetId = decodeHashFragment(rawHash);
    if (!targetId) return null;

    const targetElement = document.getElementById(targetId);
    return targetElement instanceof HTMLElement ? targetElement : null;
};

export {
    decodeHashFragment,
    getHashTargetElement,
    getHeaderHeight,
    getHeadingTargetScrollY,
    getMaxTransitionTotalMs,
    PAGE_END_EPSILON_PX,
    prefersReducedMotion,
};
