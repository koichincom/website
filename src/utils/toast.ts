/**
 * Toast notification utility using Toastify.js
 * Provides a simple API for showing toast messages throughout the app
 * 
 * Styling uses design tokens from tokens/tokens.json for single source of truth
 */
import Toastify from "toastify-js";
import { tokens } from "../tokens";

interface ToastOptions {
    text: string;
    duration?: number;
    gravity?: "top" | "bottom";
    position?: "left" | "center" | "right";
}

/**
 * Show a toast notification
 * @param text - Message to display
 * @param options - Optional configuration
 */
export function toast(text: string, options?: Partial<ToastOptions>) {
    // Detect dark mode using system preferences
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Use design tokens for consistent styling
    const backgroundColor = isDark
        ? tokens.color.accent.dark
        : tokens.color.accent.light;

    const textColor = isDark
        ? tokens.color.background.dark
        : tokens.color.background.light;

    Toastify({
        text,
        duration: options?.duration ?? 3000,
        gravity: options?.gravity ?? "top",
        position: options?.position ?? "right",
        stopOnFocus: true,
        style: {
            // Colors from design tokens
            background: backgroundColor,
            color: textColor,

            // Typography
            fontFamily: tokens.font.family.sans,
            fontSize: "14px",
            fontWeight: "500",

            // Design adjustments
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "12px 20px",
        },
    }).showToast();
}

/**
 * Show a success toast notification
 * @param text - Success message to display
 */
toast.success = (text: string) => toast(text);
