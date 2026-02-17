const COPY_LINK_SELECTOR = "[data-copy-to-clipboard-link]";

let copyLinkInitialized = false;

const getCopyLink = (
    target: EventTarget | null,
): HTMLAnchorElement | undefined => {
    if (!(target instanceof Element)) {
        return undefined;
    }

    const link = target.closest(COPY_LINK_SELECTOR);

    if (!(link instanceof HTMLAnchorElement)) {
        return undefined;
    }

    return link;
};

const copyText = async (text: string): Promise<void> => {
    if (!navigator.clipboard?.writeText) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
    } catch {
        return;
    }
};

const initCopyToClipboardLink = (): void => {
    if (copyLinkInitialized) {
        return;
    }

    copyLinkInitialized = true;

    document.addEventListener("click", async (event) => {
        const link = getCopyLink(event.target);

        if (!link) {
            return;
        }

        event.preventDefault();

        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        await copyText(href);
    });
};

initCopyToClipboardLink();
