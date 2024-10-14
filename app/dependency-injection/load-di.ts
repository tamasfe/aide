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

export async function loadDependencies(translateFunction: TranslateFunctionType): Promise<CommonDependenciesI> {
  const logger = new LoggerConsole();
  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(logger),
    logger,
    translateFunction,
  };
}
