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
  ) {
    this.emittery.on(messageName, callback);
  }

  unsubscribe<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void): void {
    this.emittery.off(messageName, callback);
  }

  once<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void,
  ) {
    this.emittery.once(messageName).then(callback);
  }

  private readonly emittery: Emittery<AsyncMessagesTypes>;
  constructor(logger: LoggerI, env: string) {
    this.emittery = new Emittery<AsyncMessagesTypes>({ debug: { name: "async-message-publisher", logger: (type, _debugName, eventName, eventData) => {
      if (env !== "production") {
        if (type === "emit" && typeof eventName === "string") {
          logger.debug(`Async message emitted`, {
            messageName: eventName,
            messagePayload: eventData,
          });
        }
      }
    } } });
  }
}
