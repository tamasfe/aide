import * as Sentry from "@sentry/nuxt";

/**
 *
 * More information about this file & Sentry with Nuxt @https://docs.sentry.io/platforms/javascript/guides/nuxt/
 *
 */

Sentry.init({
  dsn: "https://9d48502feda3a5b89674c4ad50c71b83@o4508212543684608.ingest.us.sentry.io/4508212545454080",

  // We recommend adjusting this value in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/girobet\.vip/],

  environment: process?.env?.NODE_ENV === "production" ? "production" : "development",

});
