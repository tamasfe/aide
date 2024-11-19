import type { NumberOptions, DateTimeOptions } from "vue-i18n";

export type TranslateFunctionType = (
  key: string,
  params?: Record<string, string>,
) => string;

export type DateTimeFormatterFunctionType = (
  key: string,
  params?: DateTimeOptions,
) => string;

export type NumberFormatterFunctionType = (
  key: number,
  params?: NumberOptions,
) => string;
