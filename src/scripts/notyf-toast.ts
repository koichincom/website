import { Notyf } from "notyf";
import notyfErrorIcon from "../assets/cross.svg?raw";
import notyfSuccessIcon from "../assets/check.svg?raw";

const NOTYF_CONTAINER_SELECTOR = ".notyf";

const hasNotyfContainer = (): boolean => {
    const container = document.querySelector(NOTYF_CONTAINER_SELECTOR);

    return container instanceof HTMLElement && container.isConnected;
};

export const ensureNotyf = (): Notyf => {
    if (window.notyf && hasNotyfContainer()) {
        return window.notyf;
    }

    const notyf = new Notyf({
        duration: 2000,
        position: {
            x: "right",
            y: "bottom",
        },
        dismissible: false,
        ripple: false,
        types: [
            {
                type: "success",
                background: "",
                icon: notyfSuccessIcon,
            },
            {
                type: "error",
                background: "",
                icon: notyfErrorIcon,
            },
        ],
    });

    window.notyf = notyf;

    return notyf;
};

declare global {
    interface Window {
        notyf?: Notyf;
    }
}

ensureNotyf();

document.addEventListener("astro:page-load", ensureNotyf);
