const COMMENT_SECTION_SELECTOR = "[data-mastodon-comments]";

type ParsedStatusUrl = {
    instanceOrigin: string;
    statusId: string;
};

type MastodonComment = {
    id: string;
    name: string;
    text: string;
    url: string;
};

let mastodonCommentsInitialized = false;

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const parseStatusUrl = (statusUrl: string): ParsedStatusUrl | undefined => {
    try {
        const url = new URL(statusUrl);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return undefined;
        }

        const statusId = url.pathname.split("/").filter(Boolean).at(-1);

        if (!statusId || !/^\d+$/.test(statusId)) {
            return undefined;
        }

        return {
            instanceOrigin: url.origin,
            statusId,
        };
    } catch {
        return undefined;
    }
};

const htmlToText = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.textContent?.trim() || "";
};

const parseComment = (status: unknown): MastodonComment | undefined => {
    if (!isRecord(status)) {
        return undefined;
    }

    const id = status.id;
    const url = status.url;
    const content = status.content;
    const account = status.account;

    if (
        typeof id !== "string" ||
        typeof url !== "string" ||
        typeof content !== "string" ||
        !isRecord(account)
    ) {
        return undefined;
    }

    const displayName = account.display_name;
    const acct = account.acct;
    const name =
        typeof displayName === "string" && displayName.trim().length > 0
            ? displayName
            : typeof acct === "string" && acct.trim().length > 0
              ? acct
              : "Unknown";

    const text = htmlToText(content);

    return {
        id,
        name,
        text: text || "(No text content)",
        url,
    };
};

const parseDescendants = (data: unknown): MastodonComment[] => {
    if (!isRecord(data)) {
        return [];
    }

    const descendants = data.descendants;
    if (!Array.isArray(descendants)) {
        return [];
    }

    return descendants
        .map((status) => parseComment(status))
        .filter((comment): comment is MastodonComment => Boolean(comment));
};

const setStateText = (section: HTMLElement, text: string): void => {
    const stateElement = section.querySelector(
        "[data-mastodon-comments-state]",
    );
    if (!(stateElement instanceof HTMLElement)) {
        return;
    }

    stateElement.hidden = false;
    stateElement.textContent = text;
};

const hideStateText = (section: HTMLElement): void => {
    const stateElement = section.querySelector(
        "[data-mastodon-comments-state]",
    );
    if (!(stateElement instanceof HTMLElement)) {
        return;
    }

    stateElement.hidden = true;
};

const getListElement = (section: HTMLElement): HTMLUListElement | undefined => {
    const listElement = section.querySelector("[data-mastodon-comments-list]");

    if (!(listElement instanceof HTMLUListElement)) {
        return undefined;
    }

    return listElement;
};

const renderComments = (
    section: HTMLElement,
    comments: MastodonComment[],
): void => {
    const listElement = getListElement(section);
    if (!listElement) {
        return;
    }

    listElement.innerHTML = "";

    if (comments.length === 0) {
        listElement.hidden = true;
        setStateText(section, "No comments yet.");
        return;
    }

    const fragment = document.createDocumentFragment();

    comments.forEach((comment) => {
        const item = document.createElement("li");
        const nameParagraph = document.createElement("p");
        const nameStrong = document.createElement("strong");
        nameStrong.textContent = comment.name;
        nameParagraph.append(nameStrong);

        const textParagraph = document.createElement("p");
        textParagraph.textContent = comment.text;

        const linkParagraph = document.createElement("p");
        const link = document.createElement("a");
        link.href = comment.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer nofollow";
        link.textContent = "View on Mastodon";
        linkParagraph.append(link);

        item.append(nameParagraph, textParagraph, linkParagraph);
        fragment.append(item);
    });

    listElement.append(fragment);
    listElement.hidden = false;
    hideStateText(section);
};

const loadCommentsForSection = async (section: HTMLElement): Promise<void> => {
    const statusUrl = section.getAttribute("data-mastodon-status-url");
    if (!statusUrl) {
        setStateText(section, "Mastodon URL is missing.");
        return;
    }

    const parsed = parseStatusUrl(statusUrl);
    if (!parsed) {
        setStateText(section, "Mastodon URL is invalid.");
        return;
    }

    setStateText(section, "Loading comments...");

    const listElement = getListElement(section);
    if (listElement) {
        listElement.innerHTML = "";
        listElement.hidden = true;
    }

    const contextUrl = `${parsed.instanceOrigin}/api/v1/statuses/${parsed.statusId}/context`;

    try {
        const response = await fetch(contextUrl, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            setStateText(section, "Failed to load comments.");
            return;
        }

        const data: unknown = await response.json();
        const comments = parseDescendants(data);
        renderComments(section, comments);
    } catch {
        setStateText(section, "Failed to load comments.");
    }
};

const loadMastodonComments = (): void => {
    const sections = document.querySelectorAll<HTMLElement>(
        COMMENT_SECTION_SELECTOR,
    );

    sections.forEach((section) => {
        void loadCommentsForSection(section);
    });
};

const initMastodonComments = (): void => {
    if (mastodonCommentsInitialized) {
        return;
    }

    mastodonCommentsInitialized = true;

    loadMastodonComments();
    document.addEventListener("astro:page-load", loadMastodonComments);
};

initMastodonComments();
