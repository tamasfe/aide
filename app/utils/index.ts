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
  return domain;
}

export function formatDate(date: string, format: string = "LL") {
  // TODO this should also potentially use Intl instead of dayjs
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  // TODO there is more to be desired with the default format here...
  // but we need more customizations than these options
  // https://day.js.org/docs/en/display/format#list-of-localized-formats
  return dayjs(date).format(format);
}
