import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

type ToastType = "success" | "error";

export function toast(message: string, type: ToastType = "success"): void {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const style = getComputedStyle(document.documentElement);
    const successColor = isDark
        ? style.getPropertyValue("--color-accent-dark").trim() || "#96c93d"
        : style.getPropertyValue("--color-accent-light").trim() || "#00b09b";
    const errorColor = "#ef4444";

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: type === "success" ? successColor : errorColor,
        },
    }).showToast();
}
