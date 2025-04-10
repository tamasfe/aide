const MARKETING_WHITELIST = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_referrer",
];

export const pickWhitelistedParams = (params: URLSearchParams): URLSearchParams => {
  const filteredParams = new URLSearchParams();

  for (const [key, value] of params.entries()) {
    if (MARKETING_WHITELIST.includes(key.toLowerCase())) {
      filteredParams.append(key, value);
    }
  }

  return filteredParams;
};
