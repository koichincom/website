type ClassValue = string | false | null | undefined;

export const classNames = (...classes: ClassValue[]): string =>
    classes.filter(Boolean).join(" ");
