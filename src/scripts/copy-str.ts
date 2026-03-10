const COPY_STR_SELECTOR = "[data-copy-str]";

let copyStrInitialized = false;

const getCopyStrElement = (
    target: EventTarget | null,
): HTMLButtonElement | undefined => {
    if (!(target instanceof Element)) {
        return undefined;
    }

    const copyStrElement = target.closest(COPY_STR_SELECTOR);

    if (!(copyStrElement instanceof HTMLButtonElement)) {
        return undefined;
    }

    return copyStrElement;
};

const getCopyValue = (
    copyStrElement: HTMLButtonElement,
): string | undefined => {
    const copyValue = copyStrElement.getAttribute("data-copy-str-value");
    if (copyValue) {
        return copyValue;
    }

    return undefined;
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

const initCopyStr = (): void => {
    if (copyStrInitialized) {
        return;
    }

    copyStrInitialized = true;

    document.addEventListener("click", async (event) => {
        const copyStrElement = getCopyStrElement(event.target);

        if (!copyStrElement) {
            return;
        }

        const copyValue = getCopyValue(copyStrElement);
        if (!copyValue) {
            return;
        }

        const copied = await copyText(copyValue);
        const pointerActivated = event.detail > 0;

        if (copied) {
            (
                window as unknown as {
                    notyf: { success(message: string): void };
                }
            ).notyf.success("Copied");

            if (pointerActivated) {
                copyStrElement.blur();
            }
        } else {
            (
                window as unknown as { notyf: { error(message: string): void } }
            ).notyf.error("Failed to copy");
        }
    });
};

initCopyStr();
