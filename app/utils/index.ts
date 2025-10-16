import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeBrandDomain(domain: string) {
  // replace both domain and tld (GiroBet.com, Giro.Bet, Giro.vip)
  domain = domain.replace(/giro/i, "Giro");
  domain = domain.replace(/bet/i, "Bet");
  domain = domain.replace(/zamba/i, "Zamba");
  return domain;
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function consoleWarning(message: string, style: "danger" | "default" = "default") {
  let css = "font-family:helvetica; font-weight:bold; font-size:24px;";
  if (style === "danger") {
    css += "font-size:60px; color:red;";
  }
  console.log(`%c${message}`, css);
};

export function formatDate(date: string, format: string = "LL") {
  // TODO this should also potentially use Intl instead of dayjs
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  // also we should look at a potential wrapper for Intl as I have read
  // there are some weird bugs with Intl by itself. Adobe has a library
  // wrapper that explains it
  return dayjs(date).format(format);
}

export function copyToClipboard(text: string) {
  const value = String(text);
  navigator.clipboard.writeText(value);
}

export type Camelize<T extends string> = T extends `${infer A}_${infer B}` ? `${A}${Camelize<Capitalize<B>>}` : T;

export type CamelizeKeysWithArrays<T> = T extends (infer U)[]
  ? CamelizeKeysWithArrays<U>[]
  : T extends object
    ? {
        [key in keyof T as key extends string ? Camelize<key> : key]: CamelizeKeysWithArrays<T[key]>;
      }
    : T;

export type CamelizeKeys<T extends object> = {
  [key in keyof T as key extends string ? Camelize<key> : key]: T[key] extends object ? CamelizeKeys<T[key]> : T[key]
};

export const camelize = <T extends string>(key: T): Camelize<T> => key.replace(/_(\w)/g, (match, letter) => letter.toUpperCase()) as Camelize<T>;

export function camelizeKeys<T extends Record<string, unknown>>(obj: T): CamelizeKeys<T> {
  const newObj = {} as CamelizeKeys<T>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = camelize(key);
      const value = obj[key];

      // Handle arrays
      if (Array.isArray(value)) {
        // @ts-expect-error Cannot make the type inference work, but there are unit tests that verify it's working as expected
        newObj[newKey] = value.map(item =>
          item !== null && typeof item === "object"
            ? camelizeKeys(item as Record<string, unknown>)
            : item,
        );
        continue;
      }

      // Handle objects and primitives as before
      // @ts-expect-error Cannot make the type inference work, but there are unit tests that verify it's working as expected
      newObj[newKey] = value !== null && typeof value === "object"
        ? camelizeKeys(value as Record<string, unknown>)
        : value;
    }
  }
  return newObj;
}

export const toKebabCase = (str: string) => str.trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, "-")
  .toLowerCase();
