const MIN_SCROLL_SPEED_PX_PER_MS = 0.02;
const DEFAULT_SCROLL_SPEED_PX_PER_MS = 0.4;
const SCROLL_SPEED_SMOOTHING_FACTOR = 0.25;
const MAX_SAMPLE_INTERVAL_MS = 120;

let lastScrollY = 0;
let lastScrollTimestamp = 0;
let hasScrollSample = false;
let smoothedScrollSpeedPxPerMs = 0;

const resetScrollMetrics = (currentScrollY: number): void => {
    hasScrollSample = false;
    smoothedScrollSpeedPxPerMs = 0;
    lastScrollTimestamp = 0;
    lastScrollY = currentScrollY;
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

const updateTransitionDuration = (
    layout: HTMLElement,
    revealDistancePx: number | null,
): void => {
    if (revealDistancePx === null) return;

    const sampledSpeed = hasScrollSample
        ? smoothedScrollSpeedPxPerMs
        : DEFAULT_SCROLL_SPEED_PX_PER_MS;
    const effectiveSpeed = Math.max(sampledSpeed, MIN_SCROLL_SPEED_PX_PER_MS);
    const transitionDurationMs = Math.max(
        1,
        Math.round(revealDistancePx / effectiveSpeed),
    );

    layout.style.setProperty(
        "--prose-scroll-transition-ms",
        `${transitionDurationMs}ms`,
    );
};

export { resetScrollMetrics, setScrollSpeed, updateTransitionDuration };
