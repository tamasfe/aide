import type { PublicRuntimeConfig } from "nuxt/schema";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { EmitteryAsyncMessagePublisher } from "~/packages/async-messages/emittery-async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import { LoggerConsole } from "~/packages/logger/LoggerConsole";
import type { TranslateFunctionType } from "~/packages/translation/TranslateFunctionType";

export interface CommonDependenciesI {
  asyncMessagePublisher: AsyncMessagePublisherI;
  logger: LoggerI;
  translateFunction: TranslateFunctionType;
}

export async function loadDependencies(config: PublicRuntimeConfig, translateFunction: TranslateFunctionType): Promise<CommonDependenciesI> {
  const isServer = import.meta.server;
  const logFormat = isServer ? "json" : "prettyPrint";
  const logger = new LoggerConsole(config.serviceName, logFormat, config.log.level as "debug" | "info" | "warn" | "error");

  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(logger),
    logger,
    translateFunction,
  };
}
