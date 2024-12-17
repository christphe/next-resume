export interface I18n {
  t: (key: string) => string;
}
interface LangResource {
  [key: string]: string | LangResource;
}
const langsCache: Record<string, Record<string, LangResource>> = {};
export async function usei18n(lang: string): Promise<I18n> {
  if (langsCache[lang] == null) {
    langsCache[lang] = await import(`../../messages/${lang}.json`);
  }
  const messages = langsCache[lang];
  return {
    t(key: string): string {
      const path = key.split(".");
      let value: string | LangResource = messages;
      for (const p of path) {
        if (typeof value !== "object") {
          throw new Error(`Invalid key: ${key}`);
        }
        value = value[p];
      }
      if (typeof value !== "string") {
        throw new Error(`Invalid key: ${key}`);
      }
      return value;
    },
  };
}
