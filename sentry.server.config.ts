import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://9d48502feda3a5b89674c4ad50c71b83@o4508212543684608.ingest.us.sentry.io/4508212545454080",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  environment: process.env.NODE_ENV || "development",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  ignoreErrors: [
    /Page not found/,
  ],
});
