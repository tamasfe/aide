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
    listenerId = Date.now(),
  ): number {
    this.emittery.on(messageName, callback);
    // @ts-expect-error Can't make the types work, eventhough the code does what it should
    this.listenersMap.set(listenerId, { callback, message: messageName });
    return listenerId;
  }

  unsubscribe(listenerId: number): void {
    const listener = this.listenersMap.get(listenerId);
    if (listener) {
      this.emittery.off(listener.message, listener.callback);
    }
  }

  private readonly emittery: Emittery<AsyncMessagesTypes>;
  constructor(logger: LoggerI) {
    this.emittery = new Emittery<AsyncMessagesTypes>({ debug: { name: "async-message-publisher", logger: (type, _debugName, eventName, eventData) => {
      if (type === "emit" && typeof eventName === "string") {
        logger.debug(`Async message emitted`, {
          messageName: eventName,
          messagePayload: eventData,
        });
      }
    } } });
  }

  private listenersMap = new Map<number, {
    callback: (message: object) => void;
    message: keyof AsyncMessagesTypes;
  }>();
}
