import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeBrandDomain(domain: string) {
  // replace both domain and tld (GiroBet.com, Giro.Bet, Giro.vip)
  domain = domain.replace(/giro/i, "Giro");
  domain = domain.replace(/bet/i, "Bet");
  return domain;
}
