import * as Sentry from "@sentry/nuxt";

const runtimeConfig = useRuntimeConfig();

/**
 *
 * More information about this file & Sentry with Nuxt @https://docs.sentry.io/platforms/javascript/guides/nuxt/
 *
 */

Sentry.init({
  // If set up, you can use your runtime config here
  // dsn: useRuntimeConfig().public.sentry.dsn,
  dsn: "https://9d48502feda3a5b89674c4ad50c71b83@o4508212543684608.ingest.us.sentry.io/4508212545454080",

  // We recommend adjusting this value in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/girobet\.vip/],

  // Session Replay
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  environment: location?.hostname === "localhost" ? "development" : "production",

  release: runtimeConfig.public.release,

});
