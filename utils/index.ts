import { Mask } from "maska";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FormatNumberOptions } from "../types/utils";
import type { GameImageVariant, ValidationErrorMetadata } from "~/types/api";

export const overlay = (element: HTMLElement) => {
  const existing = element.parentElement?.querySelector(".giro__overlay");
  if (existing) {
    return;
  }
  const div = document.createElement("div");
  div.classList.add("giro__overlay");
  element.style.zIndex = "12";
  element.parentElement?.appendChild(div);
};

export const hideOverlay = (element: HTMLElement) => {
  element.style.zIndex = "";
  const overlay = element.parentElement?.querySelector(".giro__overlay");
  overlay?.remove();
};

export const getCurrencySymbol = (currency_iso: string) => {
  const currency = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    // add currency symbol
    style: "currency",
    currency: currency_iso,
  }).format(0);
  const symbol = currency.replace(/[\d\s.,]/g, "");
  return symbol;
};

export const formatNumber = (number: number, options: FormatNumberOptions) => {
  return new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimalPlaces,
    style: options.currency ? "currency" : "decimal",
    currency: options.currency,
  }).format(number);
};

export const roundToDecimalPlaces = (number: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
};

export const formatCPF = (cpf: string) => {
  cpf = cpf.replace(/\D+/g, ""); // remove all non-digit characters
  cpf = cpf.substring(0, 11); // limit to 11 characters

  if (cpf.length <= 3) {
    return cpf;
  }
  else if (cpf.length <= 6) {
    return `${cpf.substring(0, 3)}.${cpf.substring(3)}`;
  }
  else if (cpf.length <= 9) {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6)}`;
  }
  else {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(
      6,
      9,
    )}-${cpf.substring(9, 11)}`;
  }
};

/*
 *  Validates a CPF number
 *  @param   String:  cpfString     // User CPF (just numbers or formated(000.000.000-00))
 *  @return  Boolean: success/false // Returns if is valid
 *  Reference and logic: https://www.devmedia.com.br/validar-cpf-com-javascript/23916
 *  Official code: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
 */
export const validateCpf = (cpfString: string) => {
  let validated = false; // Start with false

  // Checking cpf lenght
  if (cpfString.length !== 14 && cpfString.length !== 11) {
    return validated;
  }

  // Checking for "formated cpf (000.000.000-00)" and replace "points"
  if (cpfString.length === 14) {
    cpfString = cpfString.replace(".", "");
    cpfString = cpfString.replace(".", "");
    cpfString = cpfString.replace("-", "");
  }

  // Variables to check cpf valid (sum and rest)
  let sum = 0,
    rest = 0;

  // Checking for "null" CPF
  if (cpfString === "00000000000") {
    return validated;
  }

  // sum numbers
  for (let i = 1; i <= 9; ++i) {
    sum += parseInt(cpfString.substring(i - 1, i)) * (11 - i);
  }

  // Getting rest
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) {
    rest = 0;
  }

  if (rest != parseInt(cpfString.substring(9, 10))) {
    return validated;
  }

  validated = true;
  return validated;
};

export const numberMasks = {
  US: ["(###) ###-####"],
  BR: ["(##) #####-####", "(##) ####-####"],
};

export const isValidPhoneNumber = (number: string, countryCode: string) => {
  const masks = numberMasks[countryCode as keyof typeof numberMasks];
  if (!masks) {
    return false;
  }
  const mask = new Mask({
    mask: masks,
  });
  return mask.completed(number);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getValidationErrorTranslationKeys = (
  metadata: ValidationErrorMetadata,
) => {
  const messages: string[] = [];
  for (const key in metadata) {
    for (const error of metadata[key]) {
      messages.push(`validation.${key}_${error.code}`.toLowerCase());
    }
  }
  return messages;
};

export const getGameImageUrl = (gameId: number, variant: GameImageVariant) => {
  const config = useRuntimeConfig();
  const url = new URL(`/game/${gameId}/image`, config.public.apiBaseUrl);
  url.searchParams.append("variant", variant);
  return url.toString();
};
