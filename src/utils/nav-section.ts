export type TopLevelPath = "home" | "writing" | "project" | "about";

export const normalizePath = (path: string): string => {
    if (path === "/") return "/";
    return path.replace(/\/$/, "");
};

export const getExactActiveSection = (path: string): TopLevelPath | null => {
    if (path === "/") return "home";
    if (path === "/writing") return "writing";
    if (path === "/project") return "project";
    if (path === "/about") return "about";
    return null;
};

export const getActiveSection = (path: string): TopLevelPath | null => {
    if (path === "/") return "home";
    if (path.startsWith("/writing")) return "writing";
    if (path.startsWith("/project")) return "project";
    if (path.startsWith("/about")) return "about";
    return null;
};
