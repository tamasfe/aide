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
    const unsubscribe = this.emittery.on(messageName, callback);
    // @ts-expect-error Can't make the types work, eventhough the code does what it should
    this.listenersMap.set(listenerId, { callback, message: messageName, unsubscribe });
    return listenerId;
  }

  unsubscribe(listenerId: number): void {
    const listener = this.listenersMap.get(listenerId);
    if (listener) {
      listener.unsubscribe();
      this.emittery.off(listener.message, listener.callback);
      this.listenersMap.delete(listenerId);
    }
  }

  once<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void,
  ) {
    this.emittery.once(messageName).then(callback);
  }

  private readonly emittery: Emittery<AsyncMessagesTypes>;
  constructor(logger: LoggerI) {
    this.emittery = new Emittery<AsyncMessagesTypes>({ debug: { name: "async-message-publisher", logger: (type, _debugName, eventName, eventData) => {
      // if (type === "emit" && typeof eventName === "string") {
      //   logger.debug(`Async message emitted`, {
      //     messageName: eventName,
      //     messagePayload: eventData,
      //   });
      // }
    } } });
  }

  private listenersMap = new Map<number, {
    callback: (message: object) => void;
    message: keyof AsyncMessagesTypes;
    unsubscribe: () => void;
  }>();
}
