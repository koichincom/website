export {};

import {
    handleDocumentClick,
    handleDocumentFocusIn,
    handleDocumentFocusOut,
    handleInteractionInterruption,
    handleResize,
    handleScroll,
    handleWindowLoad,
    init,
    primeScrollMetrics,
} from "./controller";

let isInitialized = false;

if (typeof document !== "undefined" && !isInitialized) {
    init({ syncHashTarget: true });
    isInitialized = true;
    primeScrollMetrics();

    document.addEventListener("astro:after-swap", () => {
        init({ isReinitializing: true, syncHashTarget: true });
    });
    document.addEventListener("click", handleDocumentClick, {
        capture: true,
    });
    document.addEventListener("focusin", handleDocumentFocusIn);
    document.addEventListener("focusout", handleDocumentFocusOut);
    window.addEventListener("wheel", handleInteractionInterruption, {
        passive: true,
    });
    window.addEventListener("touchstart", handleInteractionInterruption, {
        passive: true,
    });
    window.addEventListener("keydown", handleInteractionInterruption);
    window.addEventListener("pointerdown", handleInteractionInterruption, {
        passive: true,
    });
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleWindowLoad);
    window.addEventListener("scroll", handleScroll, {
        passive: true,
    });
}
