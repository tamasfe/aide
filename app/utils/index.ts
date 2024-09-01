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
  // also we should look at a potential wrapper for Intl as I have read
  // there are some weird bugs with Intl by itself. Adobe has a library
  // wrapper that explains it
  return dayjs(date).format(format);
}
