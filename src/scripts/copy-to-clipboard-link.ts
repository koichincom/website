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

const copyText = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard?.writeText) {
        return false;
    }

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
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

        const copied = await copyText(href);
        if (copied) {
            (
                window as unknown as {
                    notyf: { success(message: string): void };
                }
            ).notyf.success("Link Copied");
        } else {
            (
                window as unknown as { notyf: { error(message: string): void } }
            ).notyf.error("Failed to Copy Link");
        }
    });
};

initCopyToClipboardLink();
