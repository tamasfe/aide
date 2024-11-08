import type { PublicRuntimeConfig } from "nuxt/schema";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { EmitteryAsyncMessagePublisher } from "~/packages/async-messages/emittery-async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import { LoggerConsole } from "~/packages/logger/LoggerConsole";
import { LoggerMiddlewareSentryErrorCapturer } from "~/packages/logger/LoggerMiddlewareSentryErrorCapturer";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export interface CommonDependenciesI {
  asyncMessagePublisher: AsyncMessagePublisherI;
  logger: LoggerI;
  translateFunction: TranslateFunctionType;
}

export async function loadDependencies(config: PublicRuntimeConfig, translateFunction: TranslateFunctionType): Promise<CommonDependenciesI> {
  const isServer = import.meta.server;
  const logFormat = isServer ? "json" : "prettyPrint";

  /**
   * There is a really weird bug with the Sentry Nuxt module where importing it in the top level of the file causes a "Cannot use import statement outside a module" error,
   * and, even more weird, this only happens in localhost, not in the production server where everything works as expected.
   * Related issue (https://github.com/getsentry/sentry-javascript/issues/13917) but that I could not use to make it work locally.
   *
   * To avoid this we need to dynamically import the Sentry capture exception function in production but not in development.
   * This should only be temporary, as importing it at every request is not optimal, as well as not being able to use Sentry in development.
   * Will open a issue in /getsentry/sentry-javascript as well with everything I've tried so far and keep an eye on it.
   *
   */
  const loggerMiddlewares = config.errorCapturingEnabled
    ? [
        new LoggerMiddlewareSentryErrorCapturer(
          (await import("@sentry/nuxt")).captureException,
        ),
      ]
    : [];

  const logger = new LoggerConsole(config.serviceName, logFormat, config.log.level as "debug" | "info" | "warn" | "error", loggerMiddlewares);

  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(logger),
    logger,
    translateFunction,
  };
}
