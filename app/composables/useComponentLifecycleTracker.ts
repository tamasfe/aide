import type { AsyncMessagesTypes } from "../packages/async-messages/async-messages";

/**
 * Configuration object for lifecycle event tracking
 */
type LifecycleEvents = {
  /** Events to emit when the component is mounted. Each key must be a valid AsyncMessage event name. */
  mounted?: Partial<AsyncMessagesTypes>;
  /** Events to emit when the component is unmounted. Each key must be a valid AsyncMessage event name. */
  unmounted?: Partial<AsyncMessagesTypes>;
};

/**
 * A composable that automatically emits async messages during Vue component lifecycle events.
 *
 * This composable allows you to declaratively specify which events should be emitted when a component
 * mounts or unmounts, providing a clean way to track component lifecycle for analytics, logging,
 * or other cross-cutting concerns.
 *
 * @param events - Configuration object specifying which events to emit during lifecycle phases
 *
 * @example
 * ```typescript
 * // In a Vue component
 * useComponentLifecycleTracker({
 *   mounted: {
 *     "page-view": { page: "/dashboard", timestamp: Date.now() },
 *     "user-interaction": { action: "component-loaded" }
 *   },
 *   unmounted: {
 *     "page-leave": { page: "/dashboard", duration: 5000 }
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Track only mount events
 * useComponentLifecycleTracker({
 *   mounted: {
 *     "analytics-track": { event: "modal-opened", modalId: "user-preferences" }
 *   }
 * });
 * ```
 */
export default function (events: LifecycleEvents) {
  const { $dependencies } = useNuxtApp();

  // Early return if no events are provided - nothing to track
  if (!events.mounted && !events.unmounted) {
    console.warn("No lifecycle events provided to track.");
    return;
  }

  // Handle component mount events
  if (events.mounted) {
    // Capture events in local scope to avoid potential closure issues
    const mountedEvents = events.mounted;

    onMounted(() => {
      // Emit all configured mount events
      Object.entries(mountedEvents).forEach(([eventName, eventData]) => {
        $dependencies.common.asyncMessagePublisher.emit(
          eventName as keyof AsyncMessagesTypes,
          eventData,
        );
      });
    });
  }

  // Handle component unmount events
  if (events.unmounted) {
    // Capture events in local scope to avoid potential closure issues
    const unmountedEvents = events.unmounted;

    onUnmounted(() => {
      // Emit all configured unmount events
      Object.entries(unmountedEvents).forEach(([eventName, eventData]) => {
        $dependencies.common.asyncMessagePublisher.emit(
          eventName as keyof AsyncMessagesTypes,
          eventData,
        );
      });
    });
  }
};
