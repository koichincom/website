export const normalizeMinLines = (
    value: number | undefined,
    fallback = 1,
): number => {
    const raw =
        typeof value === "number" && Number.isFinite(value) ? value : fallback;
    return Math.max(1, Math.floor(raw));
};

export const cssVarStyle = (
    variableName: `--${string}`,
    value: number,
): string => `${variableName}: ${value};`;
