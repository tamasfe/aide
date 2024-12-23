import type { SupportedLocale } from "~/packages/translation";

export interface RequestContextI {
  currentHost: string;
  locale: SupportedLocale;
  userJurisdiction?: string;
  headers?: Record<string, string>;
}
