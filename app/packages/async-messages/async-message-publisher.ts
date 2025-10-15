import type { AsyncMessagesTypes } from "./async-messages";

export interface AsyncMessagePublisherI {
  emit<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    message: AsyncMessagesTypes[T]
  ): Promise<void>;

  subscribe<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void,
  ): void;

  once<T extends keyof AsyncMessagesTypes>(
    messageName: T,
    callback: (message: AsyncMessagesTypes[T]) => void,
  ): void;

  unsubscribe<T extends keyof AsyncMessagesTypes>(messageName: T, callback: (message: AsyncMessagesTypes[T]) => void): void;
}
