import * as Sentry from "@sentry/nuxt";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler for finer control
  tracesSampleRate: 1.0,

  normalizeDepth: 5, // Or however deep you want your state context to be.

  environment: process.env.NUXT_PUBLIC_ENVIRONMENT || "development",
  release: process.env.NUXT_PUBLIC_RELEASE || "development",

  ignoreErrors: [
    /Page not found/,
  ],

  debug: false, // Setting this option to true will print useful information to the console while you're setting up Sentry.
});
