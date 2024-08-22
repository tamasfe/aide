import type {
  Country,
  Jurisdiction,
  Locale,
} from "~/types/constants";

// IMPORTANT: when you update this, move the associated flag
// from assets/flags to assets/flags/active
export const LOCALES: Locale[] = [
  { language: "en", countryCode: "US" },
  { language: "pt", countryCode: "BR" },
  { language: "es", countryCode: "ES" },
  { language: "es", countryCode: "MX" },
];

// shows in phone dropdown
export const COUNTRIES: Country[] = [
  { // Argentina
    code: "AR",
    dialCode: "+54",
    masks: {
      phone: ["(##) 123"],
    },
  },
  { // Brazil
    code: "BR",
    dialCode: "+55",
    masks: {
      phone: ["(##) #####-####", "(##) ####-####"],
      cpf: "###.###.###-##",
    },
  },
  { // Spain
    code: "ES",
    dialCode: "+34",
    masks: {
      phone: ["(##) 123"],
    },
  },
  { // India
    code: "IN",
    dialCode: "+91",
    masks: {
      phone: ["(##) 123"],
    },
  },
  { // Mexico
    code: "MX",
    dialCode: "+52",
    masks: {
      phone: ["(##) 123"],
    },
  },
  { // United States
    code: "US",
    dialCode: "+1",
    masks: {
      phone: ["(###) ###-####"],
    },
  },
];

export const JURISDICTIONS: Jurisdiction[] = [
  {
    country: COUNTRIES[0], // TODO
    currency: {
      code: "BRL",
      symbol: "R$",
    },
  },
];
