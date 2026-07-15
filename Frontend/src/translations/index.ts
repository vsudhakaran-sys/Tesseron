import en from "./en";
import nl from "./nl";
export type { Translations } from "./en";
export { en, nl };

export const locales = { en, nl } as const;
export type LocaleKey = keyof typeof locales;
