import Emittery from "emittery";
import type { LoggerI } from "../logger/Logger";
import type { AsyncMessagePublisherI } from "./async-message-publisher";
import type { AsyncMessagesTypes } from "./async-messages";

Emittery.isDebugEnabled = true;

/**
 * More information on the Emittery package: https://github.com/sindresorhus/emittery
 */
export class EmitteryAsyncMessagePublisher implements AsyncMessagePublisherI {
  emit<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    message: AsyncMessagesTypes[T],
  ): Promise<void> {
    return this.emittery.emit(messageName, message);
  }

  subscribe<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void,
  ): void {
    this.emittery.on(messageName, callback);
  }

  private readonly emittery: Emittery;
  constructor(logger: LoggerI) {
    this.emittery = new Emittery({ debug: { name: "async-message-publisher", logger: (type, _debugName, eventName, eventData) => {
      if (type === "emit" && typeof eventName === "string") {
        logger.debug(`Async message emitted`, {
          messageName: eventName,
          messagePayload: eventData,
        });
      }
    } } });
  }
}
