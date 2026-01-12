const TOOLTIP_ID = "global-tooltip";
const TRIGGER_SELECTOR = "[data-tooltip]";
const PADDING = 30;
const DEFAULT_DELAY = 400;

export function initGlobalTooltips() {
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (!tooltip) return;

    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    let activeTrigger: HTMLElement | null = null;

    const show = (trigger: HTMLElement, immediate = false) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }

        const run = () => {
            activeTrigger = trigger;
            const text = trigger.getAttribute("data-tooltip");
            if (!text) return;

            tooltip.textContent = text;
            tooltip.setAttribute("aria-hidden", "false");

            const id =
                trigger.id ||
                `tooltip-trigger-${Math.random().toString(36).slice(2, 9)}`;
            if (!trigger.id) trigger.id = id;
            trigger.setAttribute("aria-describedby", TOOLTIP_ID);

            tooltip.classList.remove("opacity-0");
            tooltip.classList.add("opacity-100");

            const rect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            const offset = parseInt(
                trigger.getAttribute("data-tooltip-offset") || "8",
                10,
            );

            let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

            const spaceBelow = window.innerHeight - rect.bottom;
            const needsFlip = spaceBelow < tooltipRect.height + PADDING;

            let top = needsFlip
                ? rect.top - tooltipRect.height - offset
                : rect.bottom + offset;

            if (left < PADDING) left = PADDING;
            if (left + tooltipRect.width > window.innerWidth - PADDING) {
                left = window.innerWidth - tooltipRect.width - PADDING;
            }

            if (top < PADDING) top = PADDING;
            if (top + tooltipRect.height > window.innerHeight - PADDING) {
                top = window.innerHeight - tooltipRect.height - PADDING;
            }

            tooltip.style.transform = `translate(${left}px, ${top}px)`;
        };

        if (immediate) {
            run();
        } else {
            showTimeout = setTimeout(run, DEFAULT_DELAY);
        }
    };

    const hide = () => {
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        hideTimeout = setTimeout(() => {
            tooltip.classList.remove("opacity-100");
            tooltip.classList.add("opacity-0");
            tooltip.setAttribute("aria-hidden", "true");
            if (activeTrigger) {
                activeTrigger.removeAttribute("aria-describedby");
                activeTrigger = null;
            }
        }, 150);
    };

    document.addEventListener("mouseover", (e) => {
        const target = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
        if (!target) return;
        const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement;
        if (trigger) {
            // If already showing another tooltip, show this one faster? 
            // For now, keep it simple.
            show(trigger);
        }
    });

    document.addEventListener("mouseout", (e) => {
        const target = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
        if (!target) return;
        const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement;
        if (trigger) hide();
    });

    document.addEventListener("focusin", (e) => {
        const target = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
        if (!target) return;
        const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement;
        if (trigger) {
            // Only show on focus if it's focus-visible (keyboard)
            if (trigger.matches(':focus-visible')) {
                show(trigger);
            }
        }
    });

    document.addEventListener("focusout", (e) => {
        const target = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
        if (!target) return;
        const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement;
        if (trigger) hide();
    });

    // Handle clicks to hide tooltip immediately
    document.addEventListener("click", (e) => {
        const target = e.target instanceof Element ? e.target : (e.target as Node).parentElement;
        if (!target) return;
        const trigger = target.closest(TRIGGER_SELECTOR) as HTMLElement;
        if (trigger) {
            // If we clicked, we usually want to hide the tooltip (e.g. opening a modal)
            // UNLESS it's an action that needs feedback (handled separately)
            hide();
        }
    });
}
