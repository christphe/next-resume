export interface I18n {
  t: (key: string) => string;
}
export async function usei18n(lang: string): Promise<I18n> {
  const messages = await import(`../../messages/${lang}.json`);
  return {
    t(key: string): string {
      const path = key.split(".");
      let value = messages;
      for (const p of path) {
        value = value[p];
      }
      return value;
    },
  };
}
