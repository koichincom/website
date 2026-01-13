import { navigate } from "astro:transitions/client";

export function initShortcuts() {
    document.addEventListener("keydown", (event) => {
        const target = event.target as HTMLElement;

        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const key = event.key;
        const navigationMap: Record<string, string> = {
            h: "/",
            w: "/writing",
            p: "/project",
            c: "/club",
        };

        if (key in navigationMap) {
            if (window.location.pathname === navigationMap[key]) {
                return;
            }
            navigate(navigationMap[key]);
        }
    });
}
