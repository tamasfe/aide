import type { AsyncMessagesTypes } from "../packages/async-messages/async-messages";

export default function<
  T extends keyof AsyncMessagesTypes,
>(messageName: T, callback: (message: AsyncMessagesTypes[T]) => void) {
  const { $dependencies } = useNuxtApp();

  const instance = getCurrentInstance();

  // If we are within a component, we want to automatically subscribe/unsubscribe on mount/unmount
  // If we are outside a component (e.g. in a composable used outside setup), we just subscribe once and never unsubscribe
  // as there are no lifecycle hooks available. This use case mainly appears in plugins and other parts of the app that are
  // not tied to a specific component lifecycle.
  if (instance) {
    onMounted(() => {
      $dependencies.common.asyncMessagePublisher.subscribe(
        messageName,
        callback,
      );
    });

    onUnmounted(() => {
      $dependencies.common.asyncMessagePublisher.unsubscribe(messageName, callback);
    });
  }

  else {
    $dependencies.common.asyncMessagePublisher.subscribe(
      messageName,
      callback,
    );
  }
};
