const COPY_LABEL = "Copy";
const COPIED_LABEL = "Copied";
const FAILED_LABEL = "Failed";
const RESET_DELAY_MS = 1500;

let initialized = false;
const resetTimers = new WeakMap<HTMLButtonElement, number>();

const getCodeText = (container: Element): string | undefined => {
    const codeElement = container.querySelector("pre.astro-code code");
    const text = codeElement?.textContent;

    if (!text) {
        return undefined;
    }

    return text;
};

const writeToClipboard = async (text: string): Promise<boolean> => {
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

const setButtonLabel = (button: HTMLButtonElement, label: string): void => {
    button.textContent = label;
};

const clearResetTimer = (button: HTMLButtonElement): void => {
    const timerId = resetTimers.get(button);

    if (timerId !== undefined) {
        window.clearTimeout(timerId);
        resetTimers.delete(button);
    }
};

const scheduleReset = (button: HTMLButtonElement): void => {
    clearResetTimer(button);

    const timerId = window.setTimeout(() => {
        setButtonLabel(button, COPY_LABEL);
        resetTimers.delete(button);
    }, RESET_DELAY_MS);

    resetTimers.set(button, timerId);
};

const initCodeBlockCopy = (): void => {
    if (initialized) {
        return;
    }

    initialized = true;

    document.addEventListener("click", async (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const button = target.closest("[data-code-copy-btn]");

        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        const container = button.closest("[data-code-block]");

        if (!(container instanceof Element)) {
            return;
        }

        const code = getCodeText(container);

        if (!code) {
            setButtonLabel(button, FAILED_LABEL);
            scheduleReset(button);
            return;
        }

        const copied = await writeToClipboard(code);
        setButtonLabel(button, copied ? COPIED_LABEL : FAILED_LABEL);
        scheduleReset(button);
    });
};

initCodeBlockCopy();
