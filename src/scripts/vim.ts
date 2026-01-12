import { navigate } from "astro:transitions/client";
import { toast } from "../utils/toast";

const HELP_MODAL_ID = "shortcuts-modal";

export function showHelpModal() {
    const dialog = document.getElementById(HELP_MODAL_ID) as HTMLDialogElement;
    if (dialog) {
        dialog.showModal();
        dialog.focus();
    }
}

export function isHelpModalOpen(): boolean {
    const dialog = document.getElementById(HELP_MODAL_ID) as HTMLDialogElement;
    return dialog?.open ?? false;
}

export function initVimBindings() {
    document.addEventListener("keydown", (event) => {
        const target = event.target as HTMLElement;

        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (
            isHelpModalOpen() &&
            event.key !== "?" &&
            event.key !== "q" &&
            event.key !== "Escape"
        ) {
            return;
        }

        const isGlobalBindingExecuted = handleGlobalBindings(event);
        if (isGlobalBindingExecuted) {
            return;
        }
    });
}

let lastKey = "";
let lastKeyTime = 0;
const KEY_TIMEOUT = 500;

function handleGlobalBindings(event: KeyboardEvent): boolean {
    const key = event.key;

    const navigationMap: Record<string, string> = {
        h: "/",
        w: "/writing",
        p: "/project",
        c: "/club",
    };

    if (key in navigationMap) {
        if (window.location.pathname === navigationMap[key]) {
            return false;
        }
        navigate(navigationMap[key]);
        return true;
    }

    switch (key) {
        case "g":
            if (lastKey !== "g") {
                lastKey = "g";
                lastKeyTime = Date.now();
                return false;
            } else if (Date.now() - lastKeyTime > KEY_TIMEOUT) {
                lastKey = "g";
                lastKeyTime = Date.now();
                return false;
            } else {
                lastKey = "";
                lastKeyTime = 0;
                window.scrollTo({ top: 0, behavior: "auto" });
                return true;
            }

        case "G":
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "auto",
            });
            return true;

        case "u":
            window.scrollBy({
                top: -1 * (window.innerHeight / 2),
                behavior: "auto",
            });
            return true;

        case "d":
            window.scrollBy({
                top: window.innerHeight / 2,
                behavior: "auto",
            });
            return true;

        case "j":
            window.scrollBy({
                top: window.innerHeight / 20,
                behavior: "auto",
            });
            return true;

        case "k":
            window.scrollBy({
                top: -1 * (window.innerHeight / 20),
                behavior: "auto",
            });
            return true;

        case "y":
            navigator.clipboard.writeText(window.location.href);
            toast("Link Copied");
            return true;
        case "?":
            showHelpModal();
            return true;
        default:
            return false;
    }
}
