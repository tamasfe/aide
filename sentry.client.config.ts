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
  dsn: runtimeConfig.public.sentry.dsn,

  tracesSampleRate: 1.0, // We recommend adjusting this value in production, or using tracesSampler for finer control
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [/.*/],

  // Session Replay
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.piniaIntegration(usePinia()),
  ],

  normalizeDepth: 5, // Or however deep you want your state context to be.

  propagateTraceparent: true,

  enableLogs: true,

  environment: runtimeConfig.public.environment,
  release: runtimeConfig.public.release,

  ignoreErrors: [
    /Page not found/,
  ],

});
