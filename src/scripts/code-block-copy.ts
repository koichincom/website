let initialized = false;

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
            (
                window as unknown as { notyf: { error(message: string): void } }
            ).notyf.error("Failed to Copy Code");
            return;
        }

        const copied = await writeToClipboard(code);
        if (copied) {
            (
                window as unknown as {
                    notyf: { success(message: string): void };
                }
            ).notyf.success("Code Copied");
        } else {
            (
                window as unknown as { notyf: { error(message: string): void } }
            ).notyf.error("Failed to Copy Code");
        }
    });
};

initCodeBlockCopy();
