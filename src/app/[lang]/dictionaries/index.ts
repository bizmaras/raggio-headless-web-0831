import "server-only";

const dictionaries = {
  en: () => import("../../../../messages/en.json").then((m) => m.default),
  es: () => import("../../../../messages/es.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const supportedLocales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
