/**
 * Vim-like keyboard navigation system
 * Provides familiar keybindings for users comfortable with Vim
 */

import { navigate } from "astro:transitions/client";
import { toast } from "sonner";

const HELP_MODAL_ID = "vim-help-modal";

/**
 * Show the Vim help modal
 */
export function showHelpModal() {
  const dialog = document.getElementById(HELP_MODAL_ID) as HTMLDialogElement;
  if (dialog) {
    dialog.showModal();
    dialog.focus(); // Focus the dialog itself, not the close button
  }
}

/**
 * Check if the help modal is currently open
 */
export function isHelpModalOpen(): boolean {
  const dialog = document.getElementById(HELP_MODAL_ID) as HTMLDialogElement;
  return dialog?.open ?? false;
}

/**
 * Initialize Vim key bindings
 * Listens for global keyboard events and triggers navigation or scroll actions
 */
export function initVimBindings() {
  document.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement;

    // Skip key bindings when user is typing in input/textarea
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    // Skip key bindings when modifier keys are pressed
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // Skip global bindings when help modal is open (except ? and q/Esc)
    if (isHelpModalOpen() && event.key !== "?" && event.key !== "q" && event.key !== "Escape") {
      return;
    }

    // Try global bindings first (navigation, scroll, etc.)
    const isGlobalBindingExecuted = handleGlobalBindings(event);
    if (isGlobalBindingExecuted) {
      return;
    }
  });
}

/**
 * State for multi-key sequences (e.g., 'gg' for go to top)
 */
let lastKey = "";
let lastKeyTime = 0;
const KEY_TIMEOUT = 500; // milliseconds

/**
 * Handle global Vim key bindings
 * Navigation: h/p/b/c/v
 * Scrolling: gg/G/u/d
 *
 * @param event The keyboard event
 * @returns true if a binding was executed, false otherwise
 */
function handleGlobalBindings(event: KeyboardEvent): boolean {
  const key = event.key;

  // Navigation bindings
  const navigationMap: Record<string, string> = {
    h: "/", // Home
    p: "/proj", // Projects
    b: "/blog", // Blog
    c: "/club", // Club
    v: "/vision", // Vision
  };

  if (key in navigationMap) {
    if (window.location.pathname === navigationMap[key]) {
      return false; // Already on target page
    }
    navigate(navigationMap[key]);
    return true;
  }

  // Scroll and other bindings
  switch (key) {
    case "g":
      // 'gg' jumps to top (Vim-style double-key)
      if (lastKey !== "g") {
        lastKey = "g";
        lastKeyTime = Date.now();
        return false;
      } else if (Date.now() - lastKeyTime > KEY_TIMEOUT) {
        // Timeout reset
        lastKey = "g";
        lastKeyTime = Date.now();
        return false;
      } else {
        // Execute 'gg' command
        lastKey = "";
        lastKeyTime = 0;
        window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
      }

    case "G":
      // 'G' jumps to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      return true;

    case "u":
      // 'u' scrolls up half page (Ctrl+u in Vim)
      window.scrollBy({
        top: -1 * (window.innerHeight / 2),
        behavior: "smooth",
      });
      return true;

    case "d":
      // 'd' scrolls down half page (Ctrl+d in Vim)
      window.scrollBy({
        top: window.innerHeight / 2,
        behavior: "smooth",
      });
      return true;
    case "y":
      // 'y' copies current URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied");
      return true;
    case "?":
      // '?' shows modal with Vim help
      showHelpModal();
      return true;
    default:
      return false;
  }
}
