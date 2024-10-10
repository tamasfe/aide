import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { EmitteryAsyncMessagePublisher } from "~/packages/async-messages/emittery-async-message-publisher";
import type { LoggerI } from "~/packages/logger/Logger";
import { LoggerConsole } from "~/packages/logger/LoggerConsole";

export interface CommonDependenciesI {
  asyncMessagePublisher: AsyncMessagePublisherI;
  logger: LoggerI;
}

export async function loadDependencies(): Promise<CommonDependenciesI> {
  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(),
    logger: new LoggerConsole(),
  };
}
