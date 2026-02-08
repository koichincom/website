import { getActiveSection, normalizePath } from "../utils/nav-section";

let initialized = false;

export const initNavState = () => {
    if (initialized) return;
    initialized = true;

    let pendingSection = null;

    const setNavPending = (pending) => {
        const nav = document.querySelector("[data-site-nav]");
        if (!nav) return;
        if (pending) {
            nav.setAttribute("data-nav-pending", "true");
        } else {
            nav.removeAttribute("data-nav-pending");
        }
    };

    const clearPendingHighlights = (root = document) => {
        root.querySelectorAll("[data-section][data-pending='true']").forEach(
            (item) => {
                item.removeAttribute("data-pending");
            },
        );
    };

    const applyPendingHighlight = (root, section) => {
        if (!root || !section) return;
        const nav = root.querySelector("[data-site-nav]");
        if (!nav) return;
        const target = nav.querySelector(`[data-section="${section}"]`);
        if (target) {
            target.setAttribute("data-pending", "true");
        }
    };

    const shouldApplyPendingHighlight = (section) => {
        return Boolean(section && section !== "home");
    };

    setNavPending(false);
    clearPendingHighlights();

    document.addEventListener("astro:before-preparation", (event) => {
        const currentSection = getActiveSection(
            normalizePath(window.location.pathname),
        );

        let nextPending = null;
        const source = event && event.sourceElement;
        if (source && source.closest) {
            const candidate = source.closest("[data-site-nav] [data-section]");
            if (candidate) {
                nextPending = candidate.getAttribute("data-section");
            }
        }

        if (!nextPending && event && event.to) {
            const toValue = event.to;
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

        pendingSection = nextPending;
        clearPendingHighlights();
        setNavPending(true);

        if (shouldApplyPendingHighlight(pendingSection)) {
            applyPendingHighlight(document, pendingSection);
        }
    });

    document.addEventListener("astro:before-swap", (event) => {
        if (!shouldApplyPendingHighlight(pendingSection)) return;
        if (!event || !event.newDocument) return;
        applyPendingHighlight(event.newDocument, pendingSection);
    });

    document.addEventListener("astro:after-swap", () => {
        setNavPending(false);
        clearPendingHighlights();
        pendingSection = null;
    });
};

initNavState();
