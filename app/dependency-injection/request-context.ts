import type { SupportedLocale } from "~/packages/translation";

export interface RequestContextI {
  currentHost: string;
  locale: SupportedLocale;
  headers?: Record<string, string>;
}
