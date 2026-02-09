import { getActiveSection, normalizePath } from "../utils/nav-section";

type Section = ReturnType<typeof getActiveSection>;

type AstroBeforePreparationEvent = Event & {
    sourceElement?: Element | null;
    to?: URL | string;
};

let initialized = false;

export const initNavState = (): void => {
    if (initialized) return;
    initialized = true;

    let pendingSection: Section = null;

    const setNavPending = (pending: boolean): void => {
        const nav = document.querySelector("[data-site-nav]");
        if (!nav) return;
        if (pending) {
            nav.setAttribute("data-nav-pending", "true");
        } else {
            nav.removeAttribute("data-nav-pending");
        }
    };

    const clearPendingHighlights = (root: ParentNode = document): void => {
        root.querySelectorAll("[data-section][data-pending='true']").forEach(
            (item) => {
                item.removeAttribute("data-pending");
            },
        );
    };

    const applyPendingHighlight = (
        root: ParentNode | null,
        section: NonNullable<Section>,
    ): void => {
        if (!root || !section) return;
        const nav = root.querySelector("[data-site-nav]");
        if (!nav) return;
        const target = nav.querySelector(`[data-section="${section}"]`);
        if (target) {
            target.setAttribute("data-pending", "true");
        }
    };

    setNavPending(false);
    clearPendingHighlights();

    document.addEventListener("astro:before-preparation", (event: Event) => {
        const astroEvent = event as AstroBeforePreparationEvent;
        const currentSection = getActiveSection(
            normalizePath(window.location.pathname),
        );

        let nextPending: Section = null;
        let shouldApplyPendingHighlight = false;

        const source = astroEvent.sourceElement;
        if (source) {
            const candidate = source.closest("[data-site-nav] [data-section]");
            if (candidate) {
                nextPending = candidate.getAttribute("data-section") as Section;
                shouldApplyPendingHighlight = candidate.matches(":hover");
            }
        }

        if (!nextPending && astroEvent.to) {
            const toValue = astroEvent.to;
            const toUrl =
                typeof toValue === "string"
                    ? new URL(toValue, window.location.origin)
                    : toValue;
            if (toUrl && toUrl.pathname) {
                nextPending = getActiveSection(normalizePath(toUrl.pathname));
            }
        }

        if (nextPending && nextPending === currentSection) {
            pendingSection = null;
            clearPendingHighlights();
            setNavPending(false);
            return;
        }

        pendingSection = shouldApplyPendingHighlight ? nextPending : null;
        clearPendingHighlights();
        setNavPending(shouldApplyPendingHighlight);

        if (pendingSection) {
            applyPendingHighlight(document, pendingSection);
        }
    });

    // Using Astro Client-Router, JS runtime is not reloaded on page nav, so clear the pendingSection
    document.addEventListener("astro:after-swap", () => {
        pendingSection = null;
    });
};

initNavState();
