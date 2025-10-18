import { LoggerMiddlewareSentryErrorCapturer } from "../packages/logger/LoggerMiddlewareSentryErrorCapturer";
import { LoggerConsole } from "../packages/logger/LoggerConsole";
import { captureException } from "@sentry/nuxt";

export default defineNuxtPlugin({
  name: "logger",
  parallel: true,
  async setup(_nuxtApp) {
    const config = useRuntimeConfig();

    const logger = new LoggerConsole(
      "prettyPrint",
      config.public.logLevel as "debug" | "info" | "warn" | "error",
      { name: config.public.serviceName, release: config.public.release },
      [
        new LoggerMiddlewareSentryErrorCapturer(captureException),
      ],
    );

    return {
      provide: {
        logger,
      },
    };
  },
});
