export const normalizeMinLines = (value: number): number => {
    if (value <= 0 || isNaN(value) || !isFinite(value)) {
        throw new Error(
            `Invalid rowMinLines: ${value}. Must be a positive finite number.`,
        );
    }
    return Math.floor(value);
};

export const cssVarStyle = (
    variableName: `--${string}`,
    value: number,
): string => `${variableName}: ${value};`;
